import React, {Component} from 'react';
import "../layouts/Home.css";
import  MapContainer  from "./MapContainer";


export default class Home extends Component{

    constructor(){
        super();
        
        this.state = {
            
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) =>{this.setState({value: e.target.value})}

    render(){
        return(
            <div className="container_all_homepage">
                <div className="container_menu_homepage">

                </div>
                <div className="container_map_homepage">
                    <MapContainer/>                    
                </div>
            </div>
        )
    }
}