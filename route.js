var fires = [
  {
    center: [44.99351515, -119.54351515],
    area: 22.764399999999995
  },
  {
    center: [31.73566667, -88.58654321],
    area: 15.946222222222218
  },
  {
    center: [18.25357143, -92.68457143],
    area: 46.04840000000001
  },
  {
    center: [40.86898925, -122.61396774],
    area: 22.56583333333333
  },
  {
    center: [37.72333333, -106.112],
    area: 20.400646666666667
  },
  {
    center: [37.55411364, -96.96277273],
    area: 30.556008333333338
  },
  {
    center: [33.43306494, -91.46745455],
    area: 15.946222222222218
  },
  {
    center: [20.05728571, -73.466],
    area: 45.69203333333335
  },
  {
    center: [38.69575862, -113.08910345],
    area: 28.287279999999992
  },
  {
    center: [34.38552941, -117.56247059],
    area: 8.369731666666668
  },
  {
    center: [30.73726316, -100.94052632],
    area: 10.609295000000001
  },
  {
    center: [19.67182353, -101.65323529],
    area: 20.099656269841265
  },
  {
    center: [34.903, -81.15033333],
    area: 27.270433333333322
  },
  {
    center: [44.83510811, -110.71237838],
    area: 18.087366666666668
  },
  {
    center: [48.71922222, -98.39466667],
    area: 19.851373333333328
  },
  {
    center: [40.10145732, -120.64760976],
    area: 31.388135
  },
  {
    center: [32.34637097, -85.40972581],
    area: 23.396222222222217
  },
  {
    center: [32.98243478, -112.21421739],
    area: 5.697083333333332
  },
  {
    center: [46.68841667, -114.861],
    area: 21.363639999999997
  },
  {
    center: [22.40215789, -97.63831579],
    area: 7.35484
  },
  {
    center: [37.44747368, -89.22794737],
    area: 21.294722936507934
  },
  {
    center: [42.102, -79.71375],
    area: 20.361491666666666
  },
  {
    center: [31.64201587, -93.49755556],
    area: 30.771497222222223
  },
  {
    center: [24.96233333, -107.92],
    area: 44.43920000000001
  },
  {
    center: [17.92683333, -88.73822222],
    area: 42.8575
  }
];

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey

var sourceLocation;
var destLocation;
var routeButton = document.getElementById("Button");

let map;

function initMap() {
  // @param  {H.Map} map;

  //Step 2: initialize a map - this map is centered over Europe
  var myLatLng = { lat: 39.953885, lng: -75.193048 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 3
  });

  // add a resize listener to make sure that the map occupies the whole container
  // window.addEventListener("resize", () => map.getViewPort().resize());

  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  // var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  // Create the default UI components
  // var ui = H.ui.UI.createDefault(map, defaultLayers);

  // Now use the map as required...
  window.onload = function () { };

  var myLatLng = new google.maps.LatLng({ lat: 39.953885, lng: -75.193048 });
  var sourceMarker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  var destMarker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  sourceMarker.setVisible(false);
  destMarker.setVisible(false);
  sourceMarker.setPosition(myLatLng);
  destMarker.setPosition(myLatLng);

  //AUTOCOMPLETE
  var source = document.getElementById("source");
  var dest = document.getElementById("dest");
  let firesNum = fires.length;
  console.log(firesNum);
  for (var i = 0; i < firesNum; ++i) {
    var fireCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 4,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: { lat: fires[i].center[0], lng: fires[i].center[1] },
      radius: Math.sqrt(fires[i].area / (100 * Math.PI)) * 100000
    });
  }
  // console.log(source);

  // window.onload = function() {
  // ev = document.createEvent('Event');
  // ev.initEvent('change', true, false);
  // source.dispatchEvent(ev);
  source.onkeypress = () => {
    console.log("sd");
    autofill(source);
  };
  dest.onkeypress = () => {
    autofill(dest);
  };
  // }

  var currentAutoFill = "abc";
  function autofill(input) {
    if (input.id == currentAutoFill) return;
    console.log(input.id);
    currentAutoFill = input.id;
    // console.log('inside');
    console.log(input);
    // new google
    var autocomplete = new google.maps.places.Autocomplete(input);
    console.log(autocomplete);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo("bounds", map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById("infowindow-content");
    infowindow.setContent(infowindowContent);

    autocomplete.addListener("place_changed", function () {
      console.log(input.id);
      infowindow.close();
      if (input.id == "source") {
        sourceMarker.setVisible(false);
      } else {
        destMarker.setVisible(false);
      }
      var place = autocomplete.getPlace();
      // console.log(place);
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      if ("source" == input.id) {
        sourceMarker.setPosition(place.geometry.location);
      } else {
        destMarker.setPosition(place.geometry.location);
      }

      let bounds = new google.maps.LatLngBounds();
      bounds.extend(sourceMarker.position);
      bounds.extend(destMarker.position);
      console.log(bounds);
      map.fitBounds(bounds);

      if ("source" == input.id) {
        sourceMarker.setVisible(true);
      } else {
        destMarker.setVisible(true);
      }

      var address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
          "",
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
          "",
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
          ""
        ].join(" ");
      }

      infowindowContent.children["place-icon"].src = place.icon;
      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-address"].textContent = address;
      if ("source" == input.id) {
        infowindow.open(map, sourceMarker);
        sourceLocation = sourceMarker.position;
      } else {
        infowindow.open(map, destMarker);
        destLocation = destMarker.position;
      }

      if (sourceLocation != undefined && destLocation != undefined) {
        routeButton.disabled = false;
      }
    });
  }

  // Get an instance of the routing service:

  // Call calculateRoute() with the routing parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
}
var platform = new H.service.Platform({
  apikey: "L0aJyWiq8hYm9uE5Pr_gqU2ZFNXaenQdKHTVxTY91sI"
});
var defaultLayers = platform.createDefaultLayers();

var router = platform.getRoutingService();

var onResult = function (result) {

  var route, routeShape, startPoint, endPoint, linestring;
  if (result.response.route) {
    // Pick the first route from the response:
    route = result.response.route[0];
    // Pick the route's shape:
    routeShape = route.shape;
    // console.log(routeShape, route);
    // Create a linestring to use as a point source for the route line
    // linestring = new H.geo.LineString();

    // Push all the points in the shape into the linestring:
    let pathCoordinates = [];
    routeShape.forEach(function (point) {
      var parts = point.split(",");
      pathCoordinates.push({
        lat: parseFloat(parts[0]),
        lng: parseFloat(parts[1])
      });
      /*if (Math.random() < 0.1) {
        pathCoordinates.push({
          lat: parseFloat(parts[0]),
          lng: parseFloat(parts[1])
        });
    }*/
    });

    // map.panTo(parseFloat(parts[0]))

    var paths = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    paths.setMap(map);
  }
};
var btn = document.getElementById('Button');
var loader = document.getElementById('loader');

function calculateRoutes() {
  window.setTimeout(()=>calculateSafeRoute(), 2000);
  btn.classList.add('hide');
  loader.classList.remove('hide');
}
function calculateSafeRoute() {
  loader.classList.add('hide');
  btn.classList.remove('hide');
  generateAvoidAreas();
  console.log(sourceLocation);
  console.log(sourceLocation.lat());
  console.log(sourceLocation.lng());
  var routingParameters = {
    // The routing mode:
    mode: "fastest;car",
    // The start point of the route:
    waypoint0: "geo!" + sourceLocation.lat() + "," + sourceLocation.lng(),
    // The end point of the route:
    waypoint1: "geo!" + destLocation.lat() + "," + destLocation.lng(),
    // To retrieve the shape of the route we choose the route
    // representation mode 'display'
    avoidareas: generateAvoidAreas(
      sourceLocation.lat(),
      sourceLocation.lng(),
      destLocation.lat(),
      destLocation.lng()
    ),
    representation: "display"
  };

  router.calculateRoute(routingParameters, onResult, function (error) {
    console.log(error.message);
    alert(error.message);
  });
}

function generateAvoidAreas(x1, y1, x2, y2) {
  let toReturn = "";
  firesNum = fires.length;
  for (var i = 0; i < firesNum; ++i) {
    var data = {
      center: { lat: fires[i].center[0], lng: fires[i].center[1] },
      radius: Math.sqrt(fires[i].area / (100 * Math.PI)) * 100
    };
    var dLat = data.radius / 111.32;
    var dLng = (data.radius * 360) / (40075.0 * Math.cos(data.center.lat));

    var topLeftLat = data.center.lat + dLat;
    var topLeftLng = data.center.lng - dLng;
    var bottomRightLat = data.center.lat - dLat;
    var bottomRightLng = data.center.lng + dLng;

    if (
      within(x1, y1, x2, y2, topLeftLat, topLeftLng) ||
      within(x1, y1, x2, y2, bottomRightLat, bottomRightLng)
    ) {
      toReturn += topLeftLat;
      toReturn += ",";
      toReturn += topLeftLng;
      toReturn += ";";
      toReturn += bottomRightLat;
      toReturn += ",";
      toReturn += bottomRightLng;

      toReturn += "!";
    }
  }
  if (toReturn.length > 0) {
    toReturn = toReturn.substr(0, toReturn.length - 1);
  }
  // console.log(toReturn);
  return toReturn;
}

function within(x1, y1, x2, y2, v1, v2) {
  minX = Math.min(x1, x2) - 1;
  maxX = Math.max(x1, x2) + 1;
  minY = Math.min(y1, y2) - 1;
  maxY = Math.max(y1, y2) + 1;

  if (v1 >= minX && v1 <= maxX) {
    if (v2 >= minY && v2 <= maxY) {
      return true;
    }
  }
  return false;
}
