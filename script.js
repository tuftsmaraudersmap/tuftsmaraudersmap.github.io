var map;
function script() {
	var myLat = 42.405892;
    var myLng = -71.116562;

    
    moveOn1();

    function moveOn1() {
    	var map;
    	me = new google.maps.LatLng(myLat, myLng);
		var initOptions = {
	            zoom: 15,
	            center: me,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
		map = new google.maps.Map(document.getElementById("map"), initOptions);
	}

	/*// Get Class Data using HTTP "POST"
        var request = new XMLHttpRequest();
        request.open("POST", 'https://blueberry-custard-21959.herokuapp.com/sendLocation', true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("login=SAL_CLAY&lat=" + myLat + "&lng=" + myLng);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                rawJSON = request.responseText;
                var people = JSON.parse(rawJSON).people;
                var landmarks = JSON.parse(rawJSON).landmarks;
                renderMap(people, landmarks);
            }else{
                document.getElementById("map").innerHTML = "Loading...";
            }
        }*/
}