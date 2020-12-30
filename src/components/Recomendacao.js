import React, {Component} from 'react';
import "../layouts/Recomendacao.css";
import firebase from './firestore';
import Swal from 'sweetalert2';




export default class Recomendacao extends Component{

    constructor(){
        super();

        this.state = {
            avaliacoes:{},
            ranking: [],
            usuarios: 0,
            recomendar: {},
            rankitems: []

        };
        this.handleChange = this.handleChange.bind(this);
        this.pearson= this.pearson.bind(this);
        this.rank= this.rank.bind(this);
        this.recomendador= this.recomendador.bind(this);
    }


    handleChange = (e) =>{this.setState({value: e.target.value})}


    pearson(dataset, p1, p2){
        var existp1p2 = {};
        for(item in dataset[p1]){
            if(item in dataset[p2]){
                existp1p2[item] = 1
            }
        }
        var num_existence = Object.getOwnPropertyNames(existp1p2).length;
        console.log(num_existence);
        if(num_existence == 0){ 
            return 0;
        }
        var p1_sum=0,
            p2_sum=0,
            p1_sq_sum=0,
            p2_sq_sum=0,
            prod_p1p2 = 0;
        for(var item in existp1p2){
            p1_sum += dataset[p1][item];
            p2_sum += dataset[p2][item];
            p1_sq_sum += Math.pow(dataset[p1][item],2);
            p2_sq_sum += Math.pow(dataset[p2][item],2);
            prod_p1p2 += dataset[p1][item]*dataset[p2][item];
        }
        console.log(p1_sum);
        console.log(p2_sum);
        console.log(p1_sq_sum);
        console.log(p2_sq_sum);
        console.log(prod_p1p2);
        var numerator =prod_p1p2 - (p1_sum*p2_sum/num_existence);
        var st1 = p1_sq_sum - Math.pow(p1_sum,2)/num_existence;
        var st2 = p2_sq_sum -Math.pow(p2_sum,2)/num_existence;
        var denominator = Math.sqrt(st1*st2);
        console.log(numerator);
        console.log(st1);
        console.log(st2);
        console.log(denominator);
        if(denominator ==0) return 0;
        else {
            var val = numerator / denominator;
            return val;
        }


    }

    rank(dataset,pessoa,users){
        var scores=[];
        for(var others in dataset){
            if(others != pessoa){
                var val = this.pearson(this.state.avaliacoes,pessoa,others);
                console.log(val)
                var p = others;
                scores.push({val:val,p:p});
            }
        }
        console.log(scores);
        scores.sort(function(a,b){
            return b.val < a.val ? -1 : b.val > a.val ? 1 : b.val >= a.val ? 0 : NaN;
        });
        var score=[];
        for(var i =0;i<users;i++){
            score.push(scores[i]);
        }
        this.setState({ranking: score});
    }

    recomendador(dataset, person){
        var totals = {
            setDefault:function(props,value){
                if(!this[props]){
                    this[props] =0;
                }
                this[props] += value;
            }
        },
        simsum = {
            setDefault:function(props,value){
                if(!this[props]){
                    this[props] =0;
                }
                this[props] += value;
            }
        },
        rank_lst =[];
        for(var other in dataset){
        if(other ===person) continue;
        var similar = this.pearson(dataset,person,other);
        if(similar <=0) continue;
        for(var item in dataset[other]){
            if(!(item in dataset[person]) ||(dataset[person][item]==0)){
                //the setter help to make this look nice.
                totals.setDefault(item,dataset[other][item]*similar);
                simsum.setDefault(item,similar);                        
                    }
                
            }
        }
        for(var item in totals){
        //this what the setter function does
        //so we have to find a way to avoid the function in the object     
            if(typeof totals[item] !="function"){
                var val = totals[item] / simsum[item];
                rank_lst.push({val:val,items:item});
           }
        }
        rank_lst.sort(function(a,b){
            return b.val < a.val ? -1 : b.val > a.val ? 1 : b.val >= a.val ? 0 : NaN;
        });
        var recommend = []; 
        for(var i in rank_lst){
            recommend.push(rank_lst[i].items);
        }
        console.log([rank_lst,recommend]);
        this.setState({rankitems: recommend})
        var list= {};
        firebase.firestore().collection("Restaurantes").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                var verify=String(doc.data().Id);
                console.log(doc.data().Id);
                if(recommend.includes(verify)){
                    list[doc.data().Id]= doc.data();
                }
            });
        this.setState({recomendar: list});
        console.log(list);
    })}
    

    componentDidMount(){
        var user = firebase.auth().currentUser;
        if (user) {
        console.log(user);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Nenhum usuário conectado!!!',
                text:  'Você será redirecionado a página de login',
            }).then(
                this.props.history.push("/")
              );
        }
        var lista={};
        this.setState({usuarios: 0});
        firebase.firestore().collection("Users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                lista[doc.id]=doc.data().Notas;
                this.setState({usuarios: this.state.usuarios+1});
            });
            this.setState({avaliacoes: lista})
            console.log(this.state.avaliacoes);
            this.rank(this.state.avaliacoes, firebase.auth().currentUser.uid, this.state.usuarios-1);
            console.log(this.state.ranking);
            this.recomendador(this.state.avaliacoes, firebase.auth().currentUser.uid);
        });
    }

    render(){
        return(
            <div className="container_all_homepage">
                <div className="container_menu_homepage">
                    <div className="Botoes_menu">
                        <button onClick={() => {this.props.history.push("/home")}}>Home</button>
                        <button>Preferências</button>
                        <button onClick={() => {this.props.history.push("/recomendacao")}}>Recomendações</button>
                    </div>
                    <button onClick={() => {firebase.auth().signOut().then(() => {
                        this.props.history.push("/");
                        }).catch((error) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ocorreu algum erro!'
                              })
                        })}}>Sair</button>
                </div>
                <div className="container_recomendacao">
                    {Object.values(Object.values(this.state.recomendar)).map((dado) => {
                        console.log(dado.Nome);
                        return <div className="card">
                            <h1>{dado.Nome}</h1>
                        </div>
                        })
                    }
                </div>
            </div>
        )
    }
}