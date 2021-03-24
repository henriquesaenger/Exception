import React, {Component} from 'react';
import "../layouts/Recomendacao.css";
import firebase from './firestore';
import Swal from 'sweetalert2';
import $ from 'jquery';
import { Navbar, NavDropdown, Form, FormControl, Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';




export default class Recomendacao extends Component{

    constructor(){
        super();

        this.state = {
            avaliacoes:{},
            ranking: [],
            usuarios: 0,
            recomendar: {},
            rankitems: [],
            hora: '',
            eu: '',
            latitudes: [],
            longitudes: [],
            tipos:[]

        };
        this.handleChange = this.handleChange.bind(this);
        this.pearson= this.pearson.bind(this);
        this.rank= this.rank.bind(this);
        this.recomendador= this.recomendador.bind(this);
        this.botao_centralizar= this.botao_centralizar.bind(this);
        this.euclidean= this.euclidean.bind(this);
    }


    handleChange = (e) =>{this.setState({value: e.target.value})}




    euclidean(item){
       
    

        
    }


    pearson(dataset, p1, p2){
        var existp1p2 = {};
        for(item in dataset[p1]){
            if(item in dataset[p2]){
                existp1p2[item] = 1;
            }
        }
        var num_existence = Object.getOwnPropertyNames(existp1p2).length;
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
        var numerator =prod_p1p2 - (p1_sum*p2_sum/num_existence);
        var st1 = p1_sq_sum - Math.pow(p1_sum,2)/num_existence;
        var st2 = p2_sq_sum -Math.pow(p2_sum,2)/num_existence;
        var denominator = Math.sqrt(st1*st2);
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
                var p = others;
                scores.push({val:val,p:p});
            }
        }
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
            for(var other in dataset){  //para uma dada pessoa presente no dataset
            if(other ===person) continue;   //se essa pessoa for igual ao usuário, o ciclo apenas segue
            var similar = this.pearson(dataset,person,other);   //calcula-se a similaridade dessa outra pessoa com o usuário
            if(similar <=0) continue;                           //se a similaridade for menor que 0, o sistema nem considera
            for(var item in dataset[other]){                    //para as avaliações dessa pessoa
                if(!(item in dataset[person]) ||(dataset[person][item]==0)){    //se o item não foi avaliado pelo usuário ou a avaliação consta como zero 
                    //the setter help to make this look nice.
                    /*if(this.state.hora >= 11 && this.state.hora<=14  && this.state.avaliacoes){
                        similar= similar * 0.8;
                    }
                    else{
                        if(this.state.hora >14 && this.state.hora <= 19){
                        
                        }
                    }*/
                    totals.setDefault(item,dataset[other][item]*similar);
                    simsum.setDefault(item,similar);                        
                }
            }
            }
            for(var item in totals){
                if(typeof totals[item] !="function"){
                            // doc.data() is never undefined for query doc snapshots
                            var dista =  Math.sqrt( Math.pow((this.state.latitudes[item]-this.state.eu.latitude), 2) + Math.pow((this.state.longitudes[item] -this.state.eu.longitude), 2));
                            if(dista< 0.2){
                                var val = (totals[item] / simsum[item]) - (dista * 10);
                                console.log(dista);
                                console.log(totals[item] / simsum[item])
                                console.log(val);
                                switch(this.state.tipos[item]) {
                                    case "Café":
                                        switch(true){
                                            case 0 <= this.state.hora && this.state.hora <= 5:
                                                break
                                            case this.state.hora > 5 && this.state.hora < 11:
                                                val+=0.5;
                                                break
                                            case this.state.hora > 10 && this.state.hora < 15:
                                                break
                                            case this.state.hora > 14 && this.state.hora < 19:
                                                val+=0.5;
                                                console.log(val);
                                                break
                                            case this.state.hora > 18 && this.state.hora <=23:
                                                break
                                        }
                                      break;
                                    case "Restaurante":
                                        switch(true){
                                            case 0 <= this.state.hora && this.state.hora <= 5:
                                                break
                                            case this.state.hora > 5 && this.state.hora < 11:
                                                break
                                            case this.state.hora > 10 && this.state.hora < 15:
                                                val+=0.5;
                                                break
                                            case this.state.hora > 14 && this.state.hora < 19:
                                                break
                                            case this.state.hora > 18 && this.state.hora <=23:
                                                val+=0.5;
                                                break
                                        }
                                        break;
                                }
                                rank_lst.push({val:val,items: item});
                            }
               }
            }
            console.log(rank_lst);
            rank_lst.sort(function(a,b){
                return b.val < a.val ? -1 : b.val > a.val ? 1 : b.val >= a.val ? 0 : NaN;
            });
            var recommend = []; 
            for(var i in rank_lst){
                recommend.push(rank_lst[i].items);
            }
            console.log(rank_lst);
            console.log(recommend);
            this.setState({rankitems: recommend});
            var list= {};
            if(localStorage.getItem("preferencias") == "lactose"){
            firebase.firestore().collection("Restaurantes").where("LactoseFO", "==", true).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var verify=String(doc.data().Id);
                    if(recommend.includes(verify)){
                        list[doc.data().Id]= doc.data();
                    }
                });
            this.setState({recomendar: list});
            console.log(this.state.recomendar);
            })}
            else{
                if(localStorage.getItem("preferencias") == "gluten"){
                    firebase.firestore().collection("Restaurantes").where("GlutenFO", "==", true).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            var verify=String(doc.data().Id);
                            if(recommend.includes(verify)){
                                list[doc.data().Id]= doc.data();
                            }
                        });
                    this.setState({recomendar: list});
                    console.log(this.state.recomendar);
                    })}
                else{
                    if(localStorage.getItem("preferencias") == "ambos"){
                        firebase.firestore().collection("Restaurantes").where("Id", ">=", 0).get().then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                var verify=String(doc.data().Id);
                                if(recommend.includes(verify)){
                                    list[doc.data().Id]= doc.data();
                                }
                            });
                        this.setState({recomendar: list});
                        })}
                }
        }
        
        
    }

    botao_centralizar(latitude, longitude){     //função pra setar as coordenadas do setcenter do maps
        localStorage.setItem("coord_res_lat", latitude);
        localStorage.setItem("coord_res_lng", longitude);
        localStorage.setItem("controlador_rec", 1);
        console.log(localStorage.getItem("coord_res_lat"));
        console.log(localStorage.getItem("coord_res_lng"));
        console.log(localStorage.getItem("controlador_rec"));
        this.props.history.push("/home");
    }

    componentDidMount(){
        navigator.geolocation.getCurrentPosition((position) => {
            this.state.eu= position.coords;
          });
        $("body").css("overflow-y", "scroll");
        $(".container_all_homepage").css("height","auto");
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Nenhum usuário conectado!!!',
                    text:  'Você será redirecionado a página de login',
                }).then(
                    this.props.history.push("/")
                  );
            }
        });
        var lista={};
        firebase.firestore().collection("Restaurantes").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => { 
                this.state.latitudes[doc.data().Id]= doc.data().Latitude;
                this.state.longitudes[doc.data().Id]= doc.data().Longitude;
                this.state.tipos[doc.data().Id]= doc.data().Tipo;
            });
        })
        this.setState({usuarios: 0});
        firebase.firestore().collection("Users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                //firebase.firestore().collection("Users2").doc(doc.id).set(doc.data());            duplicação do banco
                // doc.data() is never undefined for query doc snapshots
                lista[doc.id]=doc.data().Notas;
                this.setState({usuarios: this.state.usuarios+1});
            });
            this.setState({avaliacoes: lista})
            
            var date= new Date();
            this.setState({hora: date.getHours()});
            this.rank(this.state.avaliacoes, firebase.auth().currentUser.uid, this.state.usuarios-1);
            this.recomendador(this.state.avaliacoes, firebase.auth().currentUser.uid);
        });
        
    }

    render(){
        return(
            <div className="container_all_homepage">
               <Navbar id="menu_nav"  expand="md">
                    <Navbar.Brand id="brand" href="">Exception</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link id="item" href="/home">Home</Nav.Link>
                            <Nav.Link id="item" onClick={() => {
                                Swal.fire({
                                    icon: 'info',
                                    title: 'Quer saber um lugar que tenha opções de alimentação para alérgicos a:',
                                    input: 'select',
                                    inputOptions: {
                                        'Alergias': {
                                            lactose: 'Lactose',
                                            gluten: 'Glúten',
                                            ambos: 'Nenhuma das opções'
                                        }
                                    },
                                    inputPlaceholder: 'Selecione uma alergia',
                                    showCancelButton: true,
                                }).then((resposta) => {
                                    console.log(resposta);
                                    if (resposta.value == "lactose") {
                                        console.log("entrou lactose");
                                        localStorage.setItem("preferencias", resposta.value);
                                        window.location.reload();
                                    }
                                    else {
                                        if (resposta.value == "gluten") {
                                            console.log("entrou gluten");
                                            localStorage.setItem("preferencias", resposta.value);
                                            window.location.reload();
                                        }
                                        else {
                                            if (resposta.value == "ambos") {
                                                console.log("entrou ambos");
                                                localStorage.setItem("preferencias", resposta.value);
                                                window.location.reload();
                                            }
                                        }
                                    }
                                })
                            }}>Preferências</Nav.Link>
                            <Nav.Link id="item" href="/recomendacao">Recomendações</Nav.Link>
                        </Nav>
                        <button id="botao_sair" onClick={() => {
                        firebase.auth().signOut().then(() => {
                            this.props.history.push("/");
                        }).catch((error) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ocorreu algum erro!'
                            })
                        })
                    }}>Sair</button>
                    </Navbar.Collapse>
                </Navbar>
                <div className="container_recomendacao">
                    {Object.values(Object.values(this.state.rankitems)).map((dado) => {
                        if (this.state.recomendar[dado] !== undefined) {
                            return <button className="card" onClick={() => this.botao_centralizar(this.state.recomendar[dado].Latitude, this.state.recomendar[dado].Longitude)}>
                                <h1>{this.state.recomendar[dado].Nome}</h1>
                                <p>{this.state.recomendar[dado].Tipo}</p>
                            </button>
                        }
                        
                        })
                    }
                </div>
            </div>
        )
    }
}