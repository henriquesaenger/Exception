import React, {Component} from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react';
import firebase from './firestore';
import Swal from 'sweetalert2';
import { map } from 'jquery';

const styleMap= {
  width: "100%",
  height: "92%"
};

export class MapContainer extends Component {
  constructor(){
    
    super();
    this.state = {
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
          title: "Gostou de "+ this.state.rest[index].Nome+ "?",
          icon: "question",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Gostei!',
          denyButtonText: 'Não gostei',
          cancelButtonText: 'Voltar',
          confirmButtonColor: '#4CAF50',
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("deu like");
            if(this.state.nota == {}){
              var single= this.state.nota;
              single[this.state.rest[index].Id]= 1;
              this.setState({Nota: single});
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }
            else{
              var single= this.state.nota;
              single[this.state.rest[index].Id] = 1;
              this.setState({nota: single});
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }
          } else if (result.isDenied) {
            console.log("deu dislike");
            if(this.state.nota == {}){
              var single= this.state.nota;
              single[this.state.rest[index].Id] = 0;
              this.setState({nota: single});
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }
            else{
              var single= this.state.nota;
              single[this.state.rest[index].Id] = 0;
              this.setState({nota: single});  
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }  
          }
        })
      }}>
          
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
          title: "Gostou de "+ this.state.rest[index].Nome+ "?",
          icon: "question",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Gostei!',
          denyButtonText: 'Não gostei',
          cancelButtonText: 'Voltar',
          confirmButtonColor: '#4CAF50',
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("deu like");
            if(this.state.nota == {}){
              var single= this.state.nota;
              single[this.state.rest[index].Id]= 1;
              this.setState({Nota: single});
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }
            else{
              var single= this.state.nota;
              single[this.state.rest[index].Id] = 1;
              this.setState({nota: single});
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }
          } else if (result.isDenied) {
            console.log("deu dislike");
            if(this.state.nota == {}){
              var single= this.state.nota;
              single[this.state.rest[index].Id] = 0;
              this.setState({nota: single});
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
                Notas: this.state.nota
              })
            }
            else{
              var single= this.state.nota;
              single[this.state.rest[index].Id] = 0;
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


  componentDidMount(){
    firebase.firestore().collection("Restaurantes")
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

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={15}
        style={styleMap}
        onClick={this.onMapClicked}
        initialCenter={{ lat: -31.7622969, lng: -52.3294118 }}
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