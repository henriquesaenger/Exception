import React, {Component} from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react';
import firebase from './firestore';
import Swal from 'sweetalert2';
import { error } from 'jquery';



export class MapContainer extends Component {
  constructor(){
    
    super();
    
    this.state = {
      lat: '',
      lng: '',
      rest: [],
      lat: [],
      lng: [],
      pos: [],
      nota:{},
      zoom: 15,
      activeMarker: {},
      selectedPlace: {},
      showingInfoWindow: false
    };
    this.displayMarkers= this.displayMarkers.bind(this);
    this.onMarkerClick= this.onMarkerClick.bind(this);
    this.onInfoWindowClose= this.onInfoWindowClose.bind(this);
    this.onMapClicked= this.onMapClicked.bind(this);
    this.centralizar= this.centralizar.bind(this);
  }




  onMarkerClick = (props, marker) =>
  this.setState({
    activeMarker: marker,
    selectedPlace: props,
    showingInfoWindow: true
  });

  onInfoWindowClose = () =>
  this.setState({
    activeMarker: null,
    showingInfoWindow: false
  });

  onMapClicked = () => {
  if (this.state.showingInfoWindow)
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });
};

  displayMarkers = () => {
    return this.state.pos.map((posit, index) => {
      if(this.state.rest[index].Tipo == "Restaurante"){
      return <Marker key={index} id={index} position={posit} icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"} title={this.state.rest[index].Nome} onClick={() => {
        console.log("foi clicado");
        Swal.fire({
          title: "Classifique "+ this.state.rest[index].Nome+ "?",
          icon: "question",
          input: 'range',
          inputAttributes: {
            min: 1,
            max: 5,
            step: 1
          },
          inputValue: 3,
          cancelButtonText: 'Classificar',
          cancelButtonColor: '#4CAF50',
        }).then((result) => {
          var aval= Number(result.value);
          if(aval > 0 && aval < 6){
            if(this.state.nota == {}){
              var single= this.state.nota;
              single[this.state.rest[index].Id]= aval;
              this.setState({Nota: single});
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }
            else{
              var single= this.state.nota;
              single[this.state.rest[index].Id] = aval;
              this.setState({nota: single});
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }
          }
        })
        
      }}
      
      >
          
          <InfoWindow marker={this.state.activeMarker} onClose={this.onInfoWindowClose} visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.rest[index].Nome}</h1>
            </div>
          </InfoWindow>
        </Marker>
    }
    else{
      return <Marker key={index} id={index} position={posit} icon={"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"} title={this.state.rest[index].Nome} onClick={() => {
        console.log("foi clicado");
        Swal.fire({
          title: "Classifique "+ this.state.rest[index].Nome+ "?",
          icon: "question",
          input: 'range',
          inputAttributes: {
            min: 1,
            max: 5,
            step: 1
          },
          inputValue: 3,
          cancelButtonText: 'Classificar',
          cancelButtonColor: '#4CAF50',
        }).then((result) => {
          var aval= Number(result.value);
          if(aval > 0 && aval < 6){
            if(this.state.nota == {}){
              var single= this.state.nota;
              single[this.state.rest[index].Id]= aval;
              this.setState({Nota: single});
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }
            else{
              var single= this.state.nota;
              single[this.state.rest[index].Id] = aval;
              this.setState({nota: single});
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }
          }
        })
      }}>
          
          <InfoWindow position={posit} marker={this.state.activeMarker} onClose={this.onInfoWindowClose} visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.rest[index].Nome}</h1>
            </div>
          </InfoWindow>
        </Marker>
    }
  })
  }

  centralizar = () => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000
    };
    this.setState({zoom: 15});
    if(localStorage.getItem("controlador_rec") == 1){
      this.setState({lat: localStorage.getItem("coord_res_lat")});
      this.setState({lng: localStorage.getItem("coord_res_lng")});
      localStorage.setItem("controlador_rec", 0);
      this.setState({zoom: 18});
    }
    else{
      if(localStorage.getItem("controlador_rec") == 0){
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({lat: position.coords.latitude});
          this.setState({lng: position.coords.longitude});
          console.log(position);
        }, error, options);
      }
      else{
        console.log("entrou");
        localStorage.setItem("controlador_rec", 0);
      }
    }
  }


  componentDidMount(){
    window.addEventListener("storage",(() => {
      console.log(localStorage.getItem("busca"));
    }).bind(this));
    this.centralizar();
    console.log(localStorage.getItem('preferencias'));
    if(localStorage.getItem('preferencias') == "lactose"){
    firebase.firestore().collection("Restaurantes").where("LactoseFO" , "==", true).get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      this.setState({ rest: data });
      var positions= [];
      for(var i=0; i<data.length; i++){
        var myLatlng = {lat:data[i].Latitude , lng:data[i].Longitude};
        positions.push(myLatlng);
      }
      this.setState({ pos: positions});
      firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then((dados) =>{
        if(dados.exists){
          this.setState({nota: dados.data().Notas});
        }
        else{
          this.setState({nota: {} });
        }
      })
      
    });
  }
  else{
    if(localStorage.getItem('preferencias') == "gluten"){
      firebase.firestore().collection("Restaurantes").where("GlutenFO" , "==", true)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        this.setState({ rest: data });
        var positions= [];
        for(var i=0; i<data.length; i++){
          var myLatlng = {lat:data[i].Latitude , lng:data[i].Longitude};
          positions.push(myLatlng);
        }
        this.setState({ pos: positions});
        firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then((dados) =>{
          if(dados.exists){
            this.setState({nota: dados.data().Notas});
          }
          else{
            this.setState({nota: {} });
          }
        })
        
      });
    }
    else{
      if(localStorage.getItem('preferencias') == "ambos"){
        firebase.firestore().collection("Restaurantes").where("Id" , ">=", 0)
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          this.setState({ rest: data });
          var positions= [];
          for(var i=0; i<data.length; i++){
            var myLatlng = {lat:data[i].Latitude , lng:data[i].Longitude};
            positions.push(myLatlng);
          }
          this.setState({ pos: positions});
          firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then((dados) =>{
            if(dados.exists){
              this.setState({nota: dados.data().Notas});
            }
            else{
              this.setState({nota: {} });
            }
          })
          
        });
      }
    }
  } 
  }

  render() {
    const styleMap= {
      width: "100%",
      height: "92%",
    };
    const position= { lat: this.state.lat, lng: this.state.lng };
    const zoom= this.state.zoom;
    return (
      <Map
        google={this.props.google}
        zoom={zoom}
        style={styleMap}
        onClick={this.onMapClicked}
        initialCenter={position}
        center={position}
      >
      {this.displayMarkers()}
      </Map>

    );
  }
}

export default GoogleApiWrapper(
  (props) => ({
    apiKey: 'AIzaSyC_3wQ-jMGOLXB_DJxQiJHmD-hZCLOD3_g',
  }
))(MapContainer)