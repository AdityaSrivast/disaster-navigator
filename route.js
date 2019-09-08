//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey

function initMap() {
    // @param  {H.Map} map;
    var platform = new H.service.Platform({
        apikey: "L0aJyWiq8hYm9uE5Pr_gqU2ZFNXaenQdKHTVxTY91sI"
    });
    var defaultLayers = platform.createDefaultLayers();

    //Step 2: initialize a map - this map is centered over Europe
    var myLatLng = { lat: -25.363, lng: 131.044 };

    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 10
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
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

    var routingParameters = {
        // The routing mode:
        mode: "fastest;car",
        // The start point of the route:
        waypoint0: "geo!40.359105,-74.155617",
        // The end point of the route:
        waypoint1: "geo!40.568533,-74.329997",
        // To retrieve the shape of the route we choose the route
        // representation mode 'display'
        avoidareas:
            "40.362906,-74.157323;40.360225,-74.153514!40.381731,-74.155327;40.3701,-74.135028",
        representation: "display"
    };

    var onResult = function (result) {
        // console.log(result);
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
                pathCoordinates.push({ lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) });
            });

            // map.panTo(parseFloat(parts[0]))

            var paths = new google.maps.Polyline({
                path: pathCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            paths.setMap(map);

        }
    };

    //AUTOCOMPLETE
    var source = document.getElementById('source');
    var dest = document.getElementById('dest');
    // console.log(source);

    // window.onload = function() {
    ev = document.createEvent('Event');
    ev.initEvent('change', true, false);
    source.dispatchEvent(ev);
    // }

    function autofill(input) {
        console.log('inside');
        console.log(input);
        var autocomplete = new google.maps.places.Autocomplete(input);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', map);

        // Set the data fields to return when the user selects a place.
        autocomplete.setFields(
            ['address_components', 'geometry', 'icon', 'name']);

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function () {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  // Why 17? Because it looks good.
            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindowContent.children['place-icon'].src = place.icon;
            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = address;
            infowindow.open(map, marker);
        });

    }

    // Get an instance of the routing service:
    var router = platform.getRoutingService();

    // Call calculateRoute() with the routing parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):

    router.calculateRoute(routingParameters, onResult, function (error) {
        console.log(error.message);
        alert(error.message);
    });
}
