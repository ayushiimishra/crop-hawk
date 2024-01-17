import React, { useEffect, useState,memo } from 'react';
import {Button , Card,Image} from 'react-bootstrap';
import { MapContainer, TileLayer,FeatureGroup , GeoJSON } from 'react-leaflet'
import { ImageOverlay } from 'react-leaflet/ImageOverlay'
import { EditControl } from "react-leaflet-draw";
import Modal1 from '../MainModal/Modal1';
import Settings  from '../settings/settings';
import OrderDetails from'../jsonAPI/OrderDetail.json'
import OrderList from '../OrderCartComponent/OrderList.js'
import * as turf from '@turf/turf' 
import { useNavigate } from "react-router-dom";
import'leaflet/dist/leaflet.css'
import'leaflet-draw/dist/leaflet.draw.css'
// import img from './marker.png'



const Drawjson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
         
              [
                  75.117642,
                  30.677011
              ],
              [
                  75.117642,
                  30.685608
              ],
              [
                  75.135752,
                  30.685608
              ],
              [
                  75.135752,
                  30.677011
              ],
              [
                  75.117642,
                  30.677011
              ]
     
        ]
          
        ],
        "type": "Polygon"
      }
    }
  ]
}

const boundJson = {
  'featurepoints':[{
    'boundCords':[
      [75.104942,
        30.6834],
          [
            75.174465,
            30.671444
        ],
        



    ]

  }
  ]
}



function LeafletMap () {


//Navigate in react 

const redOptions = { color: 'red' } 


let navigate = useNavigate();
const goHome = () => {
    navigate("/OrderCart");
};
console.log('hello i ran twice')

//useState to store DrawnPoints
const[getDrawPoints,setDrawPoints] = useState(null);

//useState to store BoundPoints
const[getBoundDrawPoints,setBoundDrawPoints] = useState([]);

// show modal 
const [modal , setModdal] = useState(false);

// draw Controller
const [drawControl, setDrawControl] = useState(null);



//LeafletDraw feature grp to 
const onEdit = (e)=>{
    const { layerType, layer } = e;
    console.log(e)
  

  }


const onDelete = (e)=>{

  setModdal(false)
}
 
//LeafletDraw feature grp to save polygonCordinates in geojason   
  const onCreate = (e) =>{
      const { layerType, layer } = e;
      console.log(e)
      setDrawPoints(layer.toGeoJSON());
      setBoundDrawPoints([e.layer._bounds._northEast ,e.layer._bounds._southWest])
      setModdal(true)
  
    }

//Use Effect to save to GeoJason


const handleDelete = () => {
  console.log('map')
}
 useEffect(()=>{
      if(!getDrawPoints){
        return;
      }
      var newFeature = getDrawPoints;
      console.log(getDrawPoints)
      //turf code to get all features 
      var polygon = turf.polygon(getDrawPoints.geometry.coordinates);
      var area = turf.area(polygon) /1000;
      var roundoffArea = Math.floor(area)

      OrderDetails.polygon.splice(0, 1);
      
      OrderDetails.polygon.push(newFeature.geometry.coordinates[0][0]);
      OrderDetails.area = (roundoffArea);
      console.log(OrderDetails);
      setModdal(true)
    
      
     
},[getDrawPoints])




//Styles
const cart = {
  right: '12px',
  top:'12px',
 
  zIndex:'999',
  position: 'absolute',
}
const Orcart = {
  left: '112px',
  top:'112px',
 
  zIndex:'999',
  position: 'absolute',
}




return (
  <>


<Settings/>


{/* MapContainer for showing Map */}
<MapContainer center={[30.682361,75.12507 ]}  
style={{ height: "100vh",width: "100vw",position: "relative",zIndex: "10", color:'black'}} 
zoom={16} scrollWheelZoom={false}> 

{/* //Navigate to cart Button */}
<Button style={cart} variant="primary"
onClick={goHome}>
Order
</Button> 


<div style={Orcart}  class="card text-white bg-secondary mb-3" >

<div class="card-header">Orders</div>

<Card.Body>
<Image src='./marker.png'></Image>
<ul class="list-group list-group-flush">
    <li class="list-group-item">🟥 Detected Heat Stroke</li>
    <li class="list-group-item">🟩 Detected Healthy Plant</li>
    <li class="list-group-item">🟨 Unhealthy Plant</li>
  </ul>
</Card.Body>

</div>

{// Conditinally render Modem when drawpoints gets value
    modal &&  <Modal1  modal={modal} setModal={setModdal}/>
}
    
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

<FeatureGroup  ref={setDrawControl} >
<EditControl   
 position="bottomright"
 left='10rem'
 style={{left: '-30px',
 top :'-49px'}} 
 onCreated={(e) => onCreate(e) }
 onEdited={(e) => onEdit(e)}
 onDeleted={(e) => onDelete(e)}
 
draw={{   
 marker: false,
 polyline: false,
 circle: false,
 circlemarker: false,
              
 rectangle: {
 allowIntersection: true,
 shapeOptions: { color: "blue" },
 edit: true,
 showLength: true,
 metric: ["km", "m"],
 feet: false,
 showArea: true,
},
}
}
/>
</FeatureGroup>

 {/* To show the farm image  */}
{ 
      
            // console.log(item)
           <ImageOverlay 
            url="./marker.png"
            
            bounds={ [
              { 
              
                  "lat":30.677011,
                  "lng": 75.117642
              },
              {
                
                  "lat": 30.685608,
                  "lng": 75.135752
              }
          ]}   />
     
        }
{
         (  <GeoJSON key = {'1'} data={Drawjson} pathOptions={redOptions}/> 
 
           
           ) 
}

</MapContainer>

</>
);
}
export default LeafletMap;
