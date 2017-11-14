navigator.mediaDevices.getUserMedia({audio:true})
	.then(stream => {
		rec = new MediaRecorder(stream, {mimeType:"audio/webn;codec=flac"});
		rec.ondataavailable = e => {
			audioChunks.push(e.data);
			if (rec.state == "inactive"){
        let blob = new Blob(audioChunks,{type:'audio/webn;codecs=flac'});
        console.log(blob.type);
       	console.log(URL.createObjectURL(blob));

     	}
	}
	})
	.catch(e=>console.log(e));
  
startRecord.onclick = e => {
  startRecord.disabled = true;
  stopRecord.disabled=false;
  audioChunks = [];
  rec.start();
}
stopRecord.onclick = e => {
  startRecord.disabled = false;
  stopRecord.disabled=true;
  rec.stop();
}