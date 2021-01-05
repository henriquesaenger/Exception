import React, {Component} from 'react';
import "../layouts/Home.css";
import MapContainer  from "./MapContainer";
import firebase from "firebase/app";
import Swal from 'sweetalert2';
import $ from 'jquery';

export default class Home extends Component{

    constructor(){
        super();
        
        this.state = {

        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) =>{this.setState({value: e.target.value})}

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
                    <input type="text" placeholder="Qual estabelecimento deseja buscar?"/>
                </div>
                <div className="container_map_homepage">
                    <MapContainer/>                    
                </div>
            </div>
        )
    }
}