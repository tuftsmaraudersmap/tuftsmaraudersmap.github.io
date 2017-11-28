var map;
var infowindow;

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onstart = function() {
    recognizing = true;
  };
  recognition.onerror = function(event) {
    console.log(event);
    if (event.error == 'no-speech') {
        console.log('no-speech')
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
        console.log('no-mirophone')
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        console.log(event.timeStamp);
        console.log(start_timestamp);
        console.log('info-denied');
      } else {
        console.log('info_denied-notallowed');
      }
      ignore_onend = true;
    }
  };
  recognition.onend = function() {
    console.log("ending")
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      return;
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += "";
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    //console.log(interim_transcript);
    if (interim_transcript.includes("mischief managed") ) {
        window.location.replace("./index.html");
    }
    if (final_transcript || interim_transcript) {
    }
  };
}


function upgrade() {
    alert('Please use a recent version of the Google Chrome browser with this webpage.\n\nOther browsers do not support the speech API used in this site')
    startRecord.disabled = true;
    stopRecord.disabled=true;
    header.innerHTML = "Your browser does not support the speech API! :("
}


var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

console.log('loaded')
final_transcript = '';
recognition.lang = 'en-US';
recognition.start();
ignore_onend = false;
start_timestamp = Math.floor(Date.now());

var start_recognize = setInterval(function(){
    if (!recognizing) {
        console.log('loaded')
        final_transcript = '';
        recognition.lang = 'en-US';
        recognition.start();
        ignore_onend = false;
        start_timestamp = Math.floor(Date.now());
    }
}, 1000)



////////////////////////// Map Script Items /////////////////////////////////

function script(initLat, initLng, z) {
    var verified = getCookie("verified");
    if (verified == "false") {
        window.location.replace("./index.html");
    }

    cent = new google.maps.LatLng(initLat, initLng);
	var initOptions = {
        zoom: z,
    	center: cent,
    	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map"), initOptions);
    infowindow = new google.maps.InfoWindow();

    loadProperties();
}

function loadProperties() {
    // API Key: d0835923-7f86-490f-a542-1f4ae031a374
    // Documentation for Thingworx REST API:   
    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
    var thingworxurl = 'https://academic-ni.cloud.thingworx.com/Thingworx/Things/'+ 'maraudersData_ME184'  
                        + '/Properties/'
                        +'?appKey=d0835923-7f86-490f-a542-1f4ae031a374';
    var x = new XMLHttpRequest();
    var retProp = '';
    x.open('GET', cors_api_url + thingworxurl);
    x.onload = x.onerror = function() {
        retProp = JSON.parse(x.responseText);
        loadPins(retProp);
    };
    x.setRequestHeader('accept', 'application/json');
    x.send();
}

function loadPins(Properties) {
    propList = Properties.rows[0];
//    console.log(propList);


    ///// Set up icons /////

    footsteps = {
        url: "./images/footsteps.png",
        //size: new google.maps.Size(200, 200),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12),
        scaledSize: new google.maps.Size(24, 24)
    };

    forkKnife = {
        url: "./images/forkKnife.png",
        //size: new google.maps.Size(512, 512),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12),
        scaledSize: new google.maps.Size(24, 24)

    };

    sports = {
        url: "./images/sports.png",
        //size: new google.maps.Size(512, 512),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12),
        scaledSize: new google.maps.Size(24, 24)
    };

    workstation = {
        url: "./images/workstation.png",
        //size: new google.maps.Size(1600, 1600),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12),
        scaledSize: new google.maps.Size(24, 24)
    };

    joey = {
        url: "./images/jeoy.png",
        //size: new google.maps.Size(200, 200),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12) ,
        scaledSize: new google.maps.Size(24, 24)   
    };

    andRoom = {
        url: "./images/classrooms.png",
        //size: new google.maps.Size(200, 200),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12) ,
        scaledSize: new google.maps.Size(24, 24)   
    };

    /// Food Menus ///
    //---> Dewick -- ToDo: pull info from carm, anderson 208, 

    dewickMen = JSON.parse(propList.Dewick_menu);
    formDewickMen = formatMenu("Dewick", dewickMen);
    setMarker(42.405337, -71.121225, "Dewick Daily Menu", formDewickMen, forkKnife);

    //---> Carm
    carmMen = JSON.parse(propList.Carm_menu);
    formCarmMen = formatMenu("Carmichael", carmMen);
    setMarker(42.409214, -71.122642, "Carmichael Daily Menu", formCarmMen, forkKnife);

    //////////// Anderson Rooms //////////////
    
    roomList = JSON.parse(propList.Anderson_Classrooms);
    formRoomList = formatRoomList(roomList);
    setMarker(42.406173, -71.116792, "Anderson Rooms Status List", formRoomList, andRoom);
    
    //////////// Blake /////////



    /////////// Sports /////////

    sportsList = JSON.parse(propList.sports_data);
    for (i = 0; i<sportsList.length; i++) {
        formSportsInfo = "<h3><b>" + sportsList[i].sport + "</b></h3>";
        setMarker(sportsList[i].location.lat, sportsList[i].location.lng, "Sports Event", formSportsInfo, sports);
    }
    
    ////////// Joey ///////////




    ////////// People //////////


    // API Key: d0835923-7f86-490f-a542-1f4ae031a374
    // Documentation for Thingworx REST API:   

    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
    var thingworxurl = 'https://academic-ni.cloud.thingworx.com/Thingworx/Things/'+ 'maraudersTest_ME184'  
                        + '/Properties/'
                        +'?appKey=d0835923-7f86-490f-a542-1f4ae031a374';
    var x = new XMLHttpRequest();
    var retPeop = '';
    x.open('GET', cors_api_url + thingworxurl);
    x.onload = x.onerror = function() {
        retPeop = JSON.parse(x.responseText);
        loadPeop(retPeop);
    };
    x.setRequestHeader('accept', 'application/json');
    x.send();
}

function loadPeop(retPeop) {
    peopList = retPeop.rows[0];

    var phoneList = [
        "Phone1",
        "Phone2",
        "Phone3",
        "Phone4",
        "Phone5",
        "Phone6",
        "Phone7",
        "Phone8",
        "Phone9",
        "Phone10"
    ];

    console.log(peopList);

    for (i = 0; i<phoneList.length; i++) {
        phone = phoneList[i];
        if (!peopList[phone]) {
            continue;
        }
        personInfo = JSON.parse(peopList[phone]);
        if (personInfo.house == "Ravenclaw") {
            info = "<h3><b>" + personInfo.name + "</h3></b>" +
                   "<img src='./images/ravenclaw.png' height=100>";
            setMarker(personInfo.location.lat, personInfo.location.lng, personInfo.name, info, footsteps);
        } else if (personInfo.house == "Gryffindor") {
            info = "<h3><b>" + personInfo.name + "</h3></b>" +
                   "<img src='./images/Gryffindor.png' height=100>";
            setMarker(personInfo.location.lat, personInfo.location.lng, personInfo.name, info, footsteps);
        } else if (personInfo.house == "Slytherin") {
            info = "<h3><b>" + personInfo.name + "</h3></b>" +
                   "<img src='./images/slytherin.png' height=100>";
            setMarker(personInfo.location.lat, personInfo.location.lng, personInfo.name, info, footsteps);
        } else if (personInfo.house == "Hufflepuff") {
            info = "<h3><b>" + personInfo.name + "</h3></b>" +
                   "<img src='./images/hugglepuff.png' height=100>";
            setMarker(personInfo.location.lat, personInfo.location.lng, personInfo.name, info, footsteps);
        } else {}
    }
}

//////////////// Utilities ////////////////

function setMarker(lat, lng, name, infoHTML, pic) {
    var location = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
        position: location,
        title: name,
        icon: pic,
        info: infoHTML
    });
    marker.setMap(map);
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(marker.info);
        infowindow.open(map, marker);
    });
}

function formatMenu(dHall, menu) {
    var toRet = "<h3><b>" + dHall + " Menu: </b></h3>" +
                "<p><b>Breakfast: </b>" + menu.Breakfast + "</p>" +
                "<p><b>Lunch: </b>" + menu.Lunch + "</p>" +
                "<p><b>Dinner: </b>" + menu.Dinner + "</p>";
    return toRet;
}

function formatRoomList(roomList) {
    toRet = "<h3><b>Anderson Rooms:</b></h3>";

    for (i = 0; i<roomList.length; i++) {
        if (roomList[i].Occupied) {
            toRet += "<p><b><font color='red'>" + roomList[i].Name + "</font></b></p>";
        } else {
            toRet += "<p><b><font color='green'>" + roomList[i].Name + "</font></b></p>";
        }
    }

    return toRet;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var updateMap = setInterval(function(){
    /*var lat = map.getCenter().lat();
    var lng = map.getCenter().lng();
    var z = map.getZoom();
    script(lat, lng, z);
    */
    console.log("updating");
    loadProperties();
}, 20000)