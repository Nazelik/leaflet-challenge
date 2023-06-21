
// Part 1
// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// --------------------------------------------------------------------------------------------------------------------
function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the time and title (magnitude, place) of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.title}</h3><h4>Depth ${feature.geometry.coordinates[2]}</h4><hr><p>${new Date(feature.properties.time)}</p>`);

  }

  function ChooseSize(magnitude) {
    return magnitude * 4;
  }
 
  function ChooseColor(depth) {
    if (depth >= 90) {
        color = "#003300";
    }
    else if (depth >= 70) {
        color = "#006400";
    }
    else if (depth >= 50) {
        color = "#008000";
    }
    else if (depth >= 30) {
        color = "#00FF00";
    }
    else if (depth >= 10) {
        color = "#7CFC00";
        
    }
    else if (depth >= -10) {
        color = "#FFFF00";
    };

    return color;
  };

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var geojsonMarkerOptions = {
        radius: ChooseSize(feature.properties.mag),
        fillColor: ChooseColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
  }
  });


  // Send the earthquakes layer to the createMap function/
  createMap(earthquakes);
}

// ---------------------------------------------------------------------------------------------------------------------
function createMap(earthquakes) {

  // Create the base layers.
 
  let grayscale = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
  }); 

  // Create a baseMaps object.
  let baseMaps = {
    "Grayscale": grayscale, 
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [grayscale, earthquakes]
  });


  function ChooseSize(magnitude) {
    return magnitude * 4;
  }

  function ChooseColor(depth) {
    if (depth >= 90) {
        color = "#003300";
    }
    else if (depth >= 70) {
        color = "#006400";
    }
    else if (depth >= 50) {
        color = "#008000";
    }
    else if (depth >= 30) {
        color = "#00FF00";
    }
    else if (depth >= 10) {
        color = "#7CFC00";
        
    }
    else if (depth >= -10) {
        color = "#FFFF00";
    };

    return color;
  };
 
  let depths = [-10, 10, 30, 50, 70, 90]
  let colorsList = [];
  for (let i = 0; i < 6; i++) {
    colorsList.push(ChooseColor(depths[i]));
  }
  console.log(colorsList)

  // create legend
  var legend = L.control({
    position: "bottomright"
  });

  
  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'legend');
    let intervals = ['-10 - 10', '10 - 30', '30 - 50', '50 - 70', '70 - 90', '90 +'];
    
    // Loop through the intervals and colorsList to create the legend items
    for (let i = 0; i < intervals.length; i++) {
      let interval = intervals[i];
      let color = colorsList[i];
      
      div.innerHTML +=
        '<div><i style="background:' + color + '"></i>' +
        interval + '</div>';
    }
    
    return div;
  };
  

  // add legend to the map.
  legend.addTo(myMap);
}









// --------------------------------------------------------------------------------