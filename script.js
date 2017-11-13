var map;
function script() {
	var secLat = 42.405892;
    var secLng = -71.116562;

    
    moveOn1();

    function moveOn1() {
    	var map;
    	cent = new google.maps.LatLng(secLat, secLng);
		var initOptions = {
	            zoom: 15,
	            center: cent,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
		map = new google.maps.Map(document.getElementById("map"), initOptions);
	}


    // API Key: d0835923-7f86-490f-a542-1f4ae031a374
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