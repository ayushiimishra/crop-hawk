import React, { useEffect, useRef, useState } from 'react';
import { useMapEvents } from 'react-leaflet/hooks'
import { MapContainer, TileLayer ,Marker,Popup,CircleMarker,FeatureGroup} from 'react-leaflet'
import { ImageOverlay } from 'react-leaflet/ImageOverlay'
import { EditControl } from "react-leaflet-draw";
import'leaflet/dist/leaflet.css'
import'leaflet-draw/dist/leaflet.draw.css'
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FormControl, Card } from 'react-bootstrap';

// import Search from 'react-leaflet-search';

import Toggle from 'react-bootstrap-toggle';


import { GeoJSON } from 'react-leaflet'
import img from './marker.png'



import * as L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
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
              77.42277105839571,
              12.983024927657993
            ],
            [
              77.49880687047454,
              12.983024927657993
            ],
            [
              77.49880687047454,
              13.015589211128244
            ],
            [
              77.42277105839571,
              13.015589211128244
            ],
            [
              77.42277105839571,
              12.983024927657993
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


    ]

  }
  ]
}






const onEdit = (e)=>{

}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: require("https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png"),
});
 





function  MyComponent (){ 


  const [ScanbuttonOn, setScanButtonOn] = useState(false);
  
  const handleScanButtonClick = () => {
    setScanButtonOn(prevState => !prevState);
    console.log(ScanbuttonOn)
  }  

const [buttonOn, setButtonOn] = useState(false);

  
const handleButtonClick = () => {
  setButtonOn(prevState => !prevState);
  console.log(buttonOn)
}

  
 var Position = [12.912868552893608, 77.6441963795714]


const[getDrawPoints,setDrawPoints] = useState(null);

const[getBoundDrawPoints,setBoundDrawPoints] = useState([]);

  const onCreate = (e) =>{
    const { layerType, layer } = e;
    setDrawPoints(layer.toGeoJSON());
    // console.log(e.layer._bounds._northEast )
    // console.log(e.layer._bounds._southWest)
    setBoundDrawPoints([e.layer._bounds._northEast ,e.layer._bounds._southWest])

  }

  
  useEffect(() => {
    if(getBoundDrawPoints.length===0){

      return;
    }
    console.log('notreturn',boundJson.featurepoints[0].boundCords.length)

    var pointa = getBoundDrawPoints;
  

    boundJson.featurepoints[0].boundCords.push(pointa)


  console.log('testing',boundJson.featurepoints[0].boundCords)


  }, [getBoundDrawPoints]);
 
  
 

 




  const onDelete = (e) =>{
    // console.log('Delet');
  
  
  }
  const geojsonTemp = Drawjson;
  // console.log(geojsonTemp)




var [now,then]=useState(Position)
// const [arr,setArr] = useState([Position])
const markerRef= useRef(0)

const CircleRef = useRef(0)
// console.log(CircleRef)
const move = ()=>{
  then([parseFloat(now[0]+0.1), parseFloat(now[1]+0.1)])
}

// console.log(arr,'arrrr')


function Mapclick(){

  const map = useMapEvents({
    click(e) {
    console.log(e.latlng['lat']);
    then([e.latlng['lat'],e.latlng['lng']])
    
    map.flyTo(now,11) 
    // setArr([...arr,[e.latlng['lat'],e.latlng['lng']]])
    },
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom())
    },

  })

}





useEffect(()=>{
  if(!getDrawPoints){
    return;
  }

  var newFeature = getDrawPoints;
  geojsonTemp.features.push(newFeature);
},[getDrawPoints])
 



// console.log(arr,'arrrr log')
useEffect(() => {
  if(!markerRef.current){
    // console.log('testing');
   return;} 
  if(!CircleRef.current){
    // console.log('circle ran');
    return;
  } 
  CircleRef.current.setLatLng(now)
 
  // console.log(markerRef.current);
  markerRef.current.setLatLng(now);
  

},[now])



const blueOptions = { color: 'blue' }

const redOptions = { color: 'red' }

const Featureholder = {
  width:'13rem',
  position: 'absolute',
  zIndex: '12',
  right: '54px',
  top: '61px'
};

const [address, setAddress] = useState('');

const handleSubmit = (event) => {
    event.preventDefault();
    getCoordinates(address);
}


const getCoordinates = (address) => {
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${address}&key=9c9a3f0f87b14f28a6a8ab93c385d85f`)
        .then(response => response.json())
        .then(data => {
            if (data.status.code === 200) {
                const latlng = data.results[0].geometry;
                console.log(`Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`);
           
                // Mapclick().locationfound.map.flyTo([latlng.lat,latlng.lng], 14);
                then([latlng.lat,latlng.lng]);

            }
        });
}





  return (



<>
<Button data-aos-duration="1000" onClick={move}>
  {now[0]},{now[1]}

 </Button>


 <Card style={Featureholder} >
     
      <Card.Body>
  
      <Form inline onSubmit={handleSubmit} >
      <FormControl type="search" value={address} onChange={e => setAddress(e.target.value)} placeholder="Search location"/>
      <Button type='submit' variant="outline-success">Search</Button>
     </Form>

     
      <Form>
      <Form.Check 
        type="switch"
        id="custom-switch"
        label="GeoJason"
       
        onChange={handleButtonClick}
       
      />
        <Form.Check 
        type="switch"
      
        id="custom-switch"
        label="ScanbuttonOn"
        
        onChange={handleScanButtonClick}
      
      />

    </Form>    
    
      </Card.Body>
    </Card>

  





    <MapContainer data-aos="fade-up" data-aos-duration="1000"  style={{ height: "100vh",width: "100vw",position: "relative",zIndex: "10",
  }} center={Position} zoom={13} scrollWheelZoom={false}>
   
 
    <Mapclick/>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
 
 {/* <Search position="topleft" /> */}
 <FeatureGroup >
          <EditControl
            position="bottomright"
            left='10rem'
            style={{left: '-30px',
            top :'-49px'}} 
            onCreated={(e) => onCreate(e)}
            onEdited={(e) => onEdit(e)}
            onDeleted={(e) => onDelete(e)}
         
            draw={{
              marker: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              polygon: {
                allowIntersection: false,
                shapeOptions: { color: "blue" },
                edit: false,
                showLength: false,
                metric: ["km", "m"],
                feet: false,
                showArea: false,
              },
              rectangle: {
                allowIntersection: false,
                shapeOptions: { color: "blue" },
                edit: true,
                showLength: true,
                metric: ["km", "m"],
                feet: false,
                showArea: true,
              },
            }}
          />
        </FeatureGroup>

     

        {
          boundJson.featurepoints[0].boundCords.map(item => {
            if (ScanbuttonOn){
              return(<ImageOverlay 
            url={img}
            bounds={item}   />)
            }
            return null;
       
          })
        }

        {
           buttonOn && (  <GeoJSON key = {'1'} data={geojsonTemp} pathOptions={redOptions}/> 
           
           ) 
        }

 
      
         

       

   <CircleMarker  ref={CircleRef} center={Position} pathOptions={redOptions} radius={20}>
      <Popup>Popup in CircleMarker</Popup>
    </CircleMarker>
  
  
   <Marker ref={markerRef} position={Position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
    </MapContainer>
    
    </>
    )
}




export default MyComponent ;
