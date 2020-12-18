import React, {Component} from 'react';
import "../layouts/Home.css";
import  MapContainer  from "./MapContainer";
import firebase from "firebase/app";
import Swal from 'sweetalert2';

export default class Home extends Component{

    constructor(){
        super();
        
        this.state = {
            
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) =>{this.setState({value: e.target.value})}

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
    }

    render(){
        return(
            <div className="container_all_homepage">
                <div className="container_menu_homepage">
                    <div className="Botoes_menu">
                        <button>Preferências</button>
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
                <div className="container_map_homepage">
                    <MapContainer/>                    
                </div>
            </div>
        )
    }
}