function createURL(start, end, boundingBoxes) {
    let url =
      "https://route.api.here.com/routing/7.2/calculateroute.json?app_id=VY7ILsfYMoqc6hLR0Lge&app_code=qRtpwWTqT38qVlNbdpCpZA&waypoint0=geo!";
  
    url += start.lat;
    url += ",";
    url += start.long;
    url += "&waypoint1=geo!";
    url += end.lat;
    url += ",";
    url += end.long;
    url += "&mode=fastest;car;traffic:disabled";
  
    boundBoxesLength = boundingBoxes.length;
    if (boundBoxesLength > 0) {
      url += "&avoidareas=";
    }
    for (var i = 0; i < boundBoxesLength; ++i) {
      box = boundingBoxes[i];
      topLeft = box.topLeft;
      bottomRight = box.bottomRight;
  
      url += topLeft.lat;
      url += ",";
      url += topLeft.long;
      url += ";";
      url += bottomRight.lat;
      url += ",";
      url += bottomRight.long;
      if (i != boundBoxesLength - 1) url += "!";
    }
    url += "&representation=display";
  
    console.log(url);
    return url;
  }
  
  //Example
  let url = createURL(
    { lat: 40.359105, long: -74.155617 }, //Start
    { lat: 40.568533, long: -74.329997 }, //End
    [
      {
        topLeft: { lat: 40.362906, long: -74.157323 }, //Bounding Boxes
        bottomRight: { lat: 40.360225, long: -74.153514 }
      },
      {
        topLeft: { lat: 40.381731, long: -74.155327 },
        bottomRight: { lat: 40.3701, long: -74.135028 }
      }
    ]
  );
  
  fetch(url, {
    method: "GET"
  })
    .then(res => res.json())
    .then(res => console.log(res));
  