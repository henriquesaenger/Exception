import React, {Component} from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react';
import firebase from './firestore';
import Swal from 'sweetalert2';

const styleMap= {
  width: "100%",
  height: "92%"
};

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

  centralizar(){
    
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({lat: position.coords.latitude});
      this.setState({lng: position.coords.longitude});
      console.log(position);
    });
  }
  componentDidMount(){
    this.centralizar();
    console.log(localStorage.getItem('preferencias'));
    if(localStorage.getItem('preferencias') == "lactose"){
    firebase.firestore().collection("Restaurantes").where("LactoseFO" , "==", true)
    .get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      console.log(data);
      this.setState({ rest: data });
      var positions= [];
      for(var i=0; i<data.length; i++){
        var myLatlng = {lat:data[i].Latitude , lng:data[i].Longitude};
        positions.push(myLatlng);
      }
      this.setState({ pos: positions});
      console.log(this.state.pos);
      firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then((dados) =>{
        if(dados.exists){
          this.setState({nota: dados.data().Notas});
          console.log(dados.data().Notas)
          console.log(this.state.nota)
        }
        else{
          this.setState({nota: {} });
          console.log(this.state.nota)
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
        console.log(data);
        this.setState({ rest: data });
        var positions= [];
        for(var i=0; i<data.length; i++){
          var myLatlng = {lat:data[i].Latitude , lng:data[i].Longitude};
          positions.push(myLatlng);
        }
        this.setState({ pos: positions});
        console.log(this.state.pos);
        firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then((dados) =>{
          if(dados.exists){
            this.setState({nota: dados.data().Notas});
            console.log(dados.data().Notas)
            console.log(this.state.nota)
          }
          else{
            this.setState({nota: {} });
            console.log(this.state.nota)
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
          console.log(data);
          this.setState({ rest: data });
          var positions= [];
          for(var i=0; i<data.length; i++){
            var myLatlng = {lat:data[i].Latitude , lng:data[i].Longitude};
            positions.push(myLatlng);
          }
          this.setState({ pos: positions});
          console.log(this.state.pos);
          firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then((dados) =>{
            if(dados.exists){
              this.setState({nota: dados.data().Notas});
              console.log(dados.data().Notas)
              console.log(this.state.nota)
            }
            else{
              this.setState({nota: {} });
              console.log(this.state.nota)
            }
          })
          
        });
      }
    }
  } 
  }

  render() {
    const position= { lat: this.state.lat, lng: this.state.lng }
    return (
      <Map
        google={this.props.google}
        zoom={14}
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