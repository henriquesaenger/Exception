import React, {Component} from 'react';
import "../layouts/Home.css";
import MapContainer  from "./MapContainer";
import firebase from "firebase/app";
import Swal from 'sweetalert2';
import $ from 'jquery';
import Autocomplete from 'react-autocomplete';


export default class Home extends Component{

    constructor(){
        super();
        
        this.state = {
            value: "",
            nomes: [],
            restaurantes: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.centralizar= this.centralizar.bind(this);
    }

    handleChange = (e) =>{this.setState({value: e.target.value})}

    centralizar(restaurante){
        console.log(restaurante);
        console.log(restaurante.Latitude);
        console.log(restaurante.Longitude);
        localStorage.setItem("coord_res_lat", restaurante.Latitude);
        localStorage.setItem("coord_res_lng", restaurante.Longitude);
        localStorage.setItem("controlador_rec", 1);
        console.log(localStorage.getItem("coord_res_lat"));
        console.log(localStorage.getItem("coord_res_lng"));
        console.log(localStorage.getItem("controlador_rec"));
        window.location.reload();
    }

    componentDidMount(){
        $("body").css("overflow", "hidden");
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
        })
        var list= {};
        var ad= [];
        if(localStorage.getItem("preferencias") == "lactose"){
            firebase.firestore().collection("Restaurantes").where("LactoseFO", "==", true).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    {
                        list[doc.data().Nome]= doc.data();
                        ad.push({label: doc.data().Nome});
                    }
                });
            this.setState({nomes: ad});
            this.setState({restaurantes: list});
            
            console.log(this.state.restaurantes);
            })}
            else{
                if(localStorage.getItem("preferencias") == "gluten"){
                    firebase.firestore().collection("Restaurantes").where("GlutenFO", "==", true).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            list[doc.data().Nome]= doc.data();
                            ad.push({label: doc.data().Nome});
                        });
                    this.setState({nomes: ad});
                    this.setState({restaurantes: list});
                    
            console.log(this.state.restaurantes);
                    })}
                else{
                    if(localStorage.getItem("preferencias") == "ambos"){
                        firebase.firestore().collection("Restaurantes").where("Id", ">=", 0).get().then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                list[doc.data().Nome]= doc.data();
                                ad.push({label: doc.data().Nome});
                            });
                        this.setState({nomes: ad});
                        this.setState({restaurantes: list});
                        
            console.log(this.state.restaurantes);
                        })}
                }
            }
            
    }

    render(){
        return(
            <div className="container_all_homepage">
                <div className="container_menu_homepage">
                    <div className="Botoes_menu">
                        <button onClick={() => {window.location.reload()}}>Home</button>
                        <button onClick={() =>{
                             Swal.fire({
                                icon: 'info',
                                title: 'Quer saber um lugar que tenha opções de alimentação para alérgicos a:',
                                input: 'select',
                                inputOptions: {
                                    'Alergias':{
                                        lactose: 'Lactose',
                                        gluten: 'Glúten',
                                        ambos: 'Nenhuma das opções'
                                    }
                                },
                                inputPlaceholder: 'Selecione uma alergia',
                                showCancelButton: true,
                              }).then((resposta) =>{
                                  console.log(resposta);
                                  if(resposta.value == "lactose"){
                                      console.log("entrou lactose");
                                      localStorage.setItem("preferencias", resposta.value);
                                      window.location.reload();
                                  }
                                  else{
                                      if(resposta.value == "gluten"){
                                          console.log("entrou gluten");
                                          localStorage.setItem("preferencias", resposta.value);
                                          window.location.reload();
                                      }
                                      else{
                                          if(resposta.value == "ambos"){
                                              console.log("entrou ambos");
                                              localStorage.setItem("preferencias", resposta.value);
                                              window.location.reload();
                                          }
                                      }
                                  }
                              })
                        }}>Preferências</button>
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
                <div className="searchbar">
                    <Autocomplete
                        getItemValue={(item) => item.label}
                        items={this.state.nomes}
                        shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                            getItemValue={item => item.label}
                            renderItem={(item, highlighted) =>
                            <div
                                key={item.id}
                                style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                            >
                                {item.label}
                            </div>
                        }
                        value={this.state.value}
                        onChange={(e) => this.setState({value: e.target.value})}
                        onSelect={(value) => {
                            this.setState({value: value});
                            localStorage.setItem("busca", value);
                            console.log(value);
                            //console.log(this.state.restaurantes[value]);
                            this.centralizar(this.state.restaurantes[value]);

                        }}
                    />
                </div>
                <div className="container_map_homepage">
                    <MapContainer/>                    
                </div>
            </div>
        )
    }
}