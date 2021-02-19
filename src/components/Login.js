import "../layouts/Login.css";
import React, {Component} from 'react';
import Authentication from './Auth';
import $ from 'jquery';
import Swal from 'sweetalert2';


export default class extends Component{
    

    constructor(){
        super();
        
        this.state = {
          email: "",
          password:""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin =  this.handleLogin.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.escolha = this.escolha.bind(this);
    }

    escolha(controle){
        if(controle === 0){
            $(".login_botoes_cadastro").css("color", "#410A78");
            $(".login_botoes_cadastro").css("background-color", "white");
            $(".login_botoes_login").css("color", "white");
            $(".login_botoes_login").css("background-color", "#410A78");
            $(".cadastro_button").show();
            $(".login_button").hide();
        }
        else if(controle === 1){
            $(".login_botoes_login").css("color", "#410A78");
            $(".login_botoes_login").css("background-color", "white");
            $(".login_botoes_cadastro").css("color", "white");
            $(".login_botoes_cadastro").css("background-color", "#410A78");
            $(".login_button").show();
            $(".cadastro_button").hide();
        }
    }
    


    handleChange = (e) =>{this.setState({value: e.target.value})}

    handleLogin(){
        Authentication.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((user) => {
            this.props.history.push("/home");
        }).catch((err) =>{
            switch(err.code){
                case "auth/invalid-email":
                    Swal.fire({
                        icon: 'error',
                        title: 'Email inválido',
                        text: 'O email digitado está incorreto!'
                      })
                case "auth/user-disabled":
                case "auth/user-not-found":
                    Swal.fire({
                        icon: 'error',
                        title: 'Usuário não encontrado!',
                        text: 'O usuário não foi encontrado, talvez você não tenha se cadastrado ainda em nosso sistema?'
                      })
                case "auth/wrong_password":
                    Swal.fire({
                        icon: 'error',
                        title: 'Email ou senha incorretos',
                        text: 'Digite novamente suas informações!'
                      })
            }
        })
    }

    handleSignUp(){
        Authentication.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((user) => {
            Swal.fire({
                icon: 'success',
                title: 'Usuário Cadastrado!!!',
                text: 'Seja bem vindo a nossa plataforma',
                confirmButtonText: 'Avançar',
                confirmButtonColor: '#410A78'
              }).then(() => {
                this.props.history.push("/");
                this.handleLogin();

              })
            }).catch((err) =>{
            switch(err.code){
                case "auth/email-already-in-use":
                    Swal.fire({
                        icon: 'error',
                        title: 'O email escolhido já está em uso!',
                        text: 'Tente se conectar a nossa plataforma por um outro email'
                      })
                case "auth/invalid-email":
                    Swal.fire({
                        icon: 'error',
                        title: 'Email inválido!',
                        text: 'Por favor, utilize um email válido para que possamos concluir seu cadastro'
                      })
                case "auth/weak_password":
            }
        })
    }


    componentDidMount(){
        localStorage.setItem('preferencias', "ambos");
        localStorage.setItem("coord_res_lat", 0);
        localStorage.setItem("coord_res_lng", 0);
        localStorage.setItem("controlador_rec", 0);
        console.log(localStorage.getItem('preferencias'))
    }


    render(){
        return(
            <div className="container_all_login">
                <div className="container_box_login">
                    <div className="login_botoes">
                        <button className="login_botoes_cadastro" onClick={() => this.escolha(0)}>Cadastro</button>
                        <button className="login_botoes_login" onClick={() => this.escolha(1)}>Login</button>
                    </div>
                    <div className="container_login_info">
                        <h1>Email</h1>
                        <input type="text" onChange={(e) => {this.setState({email: e.target.value })}}/>
                        <h1>Senha</h1>
                        <input type="password" onChange={(e) => {this.setState({password: e.target.value })}}/>
                    </div>
                    <button className="login_button" onClick={() => this.handleLogin()}>Login</button>
                    <button className="cadastro_button" onClick={() => this.handleSignUp()}>Sign Up</button>
                </div>
            </div>
        );
    }
}