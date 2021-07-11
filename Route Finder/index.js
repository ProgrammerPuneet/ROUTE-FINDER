const map = new L.Map('map').setView([26.8897879,75.7810092],5);
const titleUrl='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution='&copy;&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tiles=L.tileLayer(titleUrl,{attribution});
var locations=[];
//const osrm=require('osrm');
tiles.addTo(map);

googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//googleSat.addTo(map);

var dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

var myIcon=L.icon({
  iconUrl:'ware.png',
  iconSize:[30,30],
});


var delivery=L.icon({
  iconUrl:'delivery.jpg',
  iconSize:[30,30],
});

var baseMaps = {
    "Grayscale":tiles ,
    "GoogleSat": googleSat,
    "Dark":dark
};

var marker=L.marker([26.8897879,75.7810092],{icon:myIcon,draggable:true});
var overlayMaps = {
    "Marker": marker
};


L.control.layers(baseMaps, overlayMaps).addTo(map);


//When you click On the map this function will place a marker over there 

map.on('click',function(e){
  var marker=L.marker([e.latlng.lat,e.latlng.lng],{draggable:true});
  console.log(e.latlng.lat+" "+e.latlng.lng);
  var popup=marker.bindPopup('Lat:'+e.latlng.lat+" Lng:"+e.latlng.lng).openPopup();
  popup.addTo(map);
})

function decode(encoded){

    // array that holds the points

    var points=[ ]
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;
    while (index < len) {
        var b, shift = 0, result = 0;
        do {
              b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii                                                                                    //and substract it by 63
              result |= (b & 0x1f) << shift;
              shift += 5;

            } while (b >= 0x20);


        var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
          b = encoded.charAt(index++).charCodeAt(0) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lng += dlng;
 
      points.push({latitude:( lat / 1E5),longitude:( lng / 1E5)});  
 
    }
    return points;
}



function send(){
  var marker=L.marker([26.8897879,75.7810092],{icon:myIcon,draggable:true}).addTo(map);

  if(locations.length==0){
    alert("Add Locations");
  }
  else{
      instructions=[];
      polyline=[];
      request=new XMLHttpRequest();
      url="https://router.project-osrm.org/trip/v1/driving/";
      
      var coordinates="75.7810092,26.8897879;";
      for(var x=0;x<locations.length;x++){
          var marker=L.marker([locations[x][1],locations[x][0]],{icon:delivery,draggable:true}).bindPopup("Location"+(x+1));
          marker.addTo(map);
          if(x==locations.length-1)
            coordinates+=locations[x][0]+","+locations[x][1];
          else 
            coordinates+=locations[x][0]+","+locations[x][1]+";";
      }
      //console.log(coordinates);
      suffix="?geometries=geojson&steps=true";
      
      url=url+coordinates+suffix;
      //console.log(url);
      request.open("GET",url);
      request.send();
      request.onload=()=>{
        //console.log(request);
        if(request.status===200){
          var parsedData=JSON.parse(request.response);
          var r=parsedData["trips"][0]["geometry"].coordinates;
          //console.log(r);
          //r=decode(r);
          //console.log(r[0][0]);
          for(x=0;x<r.length;x++){
            var point = new L.LatLng(r[x][1],r[x][0]);
            //var marker=L.marker(point).addTo(map);

            //console.log(point);
            polyline.push(point);
          }

          var firstpolyline = new L.Polyline(polyline, {
              color: 'blue',
              weight: 5,
              opacity: 0.9,
              smoothFactor: 1
          });
          firstpolyline.addTo(map);
        }
        else{
          alert("Unable to reach to servers");
        }
      }
  }
  
}

function route(){
  if(locations.length<=1){
    alert("Add Atleast 2 Locations");
  }
  else if(locations.length>2){
    alert("Route Service Works for 2 locations only");
  } 
  else{
      instructions=[];
      polyline=[];
      request=new XMLHttpRequest();
      url="https://router.project-osrm.org/route/v1/driving/";
      
      var coordinates="";
      for(var x=0;x<locations.length;x++){
          var marker=L.marker([locations[x][1],locations[x][0]],{icon:delivery,draggable:true}).bindPopup("Location"+(x+1));
          marker.addTo(map);
          if(x==locations.length-1)
            coordinates+=locations[x][0]+","+locations[x][1];
          else 
            coordinates+=locations[x][0]+","+locations[x][1]+";";
      }
      //console.log(coordinates);
      suffix="?geometries=geojson&steps=true";
      
      url=url+coordinates+suffix;
      //console.log(url);
      request.open("GET",url);
      request.send();
      request.onload=()=>{
        //console.log(request);
        if(request.status===200){
          var parsedData=JSON.parse(request.response);
          var r=parsedData["routes"][0]["geometry"].coordinates;
          console.log(r);
          //r=decode(r);
          //console.log(r[0][0]);
          for(x=0;x<r.length;x++){
            var point = new L.LatLng(r[x][1],r[x][0]);
            //var marker=L.marker(point).addTo(map);

            //console.log(point);
            polyline.push(point);
          }

          var firstpolyline = new L.Polyline(polyline, {
              color: 'blue',
              weight: 5,
              opacity: 0.9,
              smoothFactor: 1
          });
          firstpolyline.addTo(map);
        }
        else{
          alert("Unable to reach to servers");
        }
      }
  }
}

function addItem() {
      var ul = document.getElementById("dynamic-list");
      var candidate = document.getElementById("candidate");
      //address.push(candidate.value);
      request=new XMLHttpRequest();
      request.open("GET","https://api.opencagedata.com/geocode/v1/json?key=5db515186a3d461b8b5c8337767b4315&q="+candidate.value);
      request.send();
      request.onload=()=>{
        //console.log(request);
        if(request.status===200){
          var parsedData=JSON.parse(request.response);
          var r=parsedData;
          
          if(r["results"].length==0){
            removeItem();
            alert("Try Writing Exact Address");

          }
          else{
            
            var lat=r["results"][0].geometry.lat;
            var long=r["results"][0].geometry.lng;
            locations.push([long,lat]);
            //console.log(locations);  
          }
          
        }
        else{
          removeItem();
          alert("Location not found Try Again");
        }
      }
      
      var li = document.createElement("li");
      li.setAttribute('id', candidate.value);
      li.appendChild(document.createTextNode(candidate.value));
      ul.appendChild(li);
  }
  
  
  function removeItem() {
      var ul = document.getElementById("dynamic-list");
      var candidate = document.getElementById("candidate");
      var item = document.getElementById(candidate.value);
      locations.pop();
      ul.removeChild(item);
  }