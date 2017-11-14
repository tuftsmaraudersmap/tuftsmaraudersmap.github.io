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
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = final_transcript;
    if (interim_transcript == "I solemnly swear that I'm upto no good" || 
    	interim_transcript == "I solemnly swear that I'm up to no good") {
    	window.location.replace("mapDisplay.html");

    }
    if (final_transcript || interim_transcript) {
    }
  };
}

function upgrade() {
	alert('browser needs to be upgraded')
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}





startRecord.onclick = e => {
  startRecord.disabled = true;
  stopRecord.disabled=false;
  final_transcript = '';
  recognition.lang = 'en-US';
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_timestamp = event.timeStamp;
}


stopRecord.onclick = e => {
  startRecord.disabled = false;
  stopRecord.disabled=true;
  if (recognizing) {
    recognition.stop();
  	return;
  }
}