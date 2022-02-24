const socket = io('/');
const peer = new Peer();
let myVideoStream;
let myId;
var videoGrid = document.getElementById('videoDiv');
var myvideo = document.createElement('video');
var RId = document.getElementById('RId');
var btnGroup = document.getElementById('mute-btn-group');
myvideo.muted = true;
const peerConnections = {}
navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true
}).then((stream)=>{
  myVideoStream = stream;
  addVideo(myvideo , stream);
  peer.on('call' , call=>{
    call.answer(stream);
      const vid = document.createElement('video');
    call.on('stream' , userStream=>{
      addVideo(vid , userStream);
    })
    call.on('error' , (err)=>{
      alert(err)
    })
    call.on("close", () => {
        console.log(vid);
        vid.remove();
    })
    peerConnections[call.peer] = call;
  })
}).catch(err=>{
    alert(err.message)
    console.log(err.message);
})
var displayMediaOptions = {
  video: {
      cursor: "always"
  },
  audio: false
};
navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
.then(function (stream) {
  myVideoStream = stream;
  addVideo(myvideo , stream);
  peer.on('call' , call=>{
    call.answer(stream);
      const vid = document.createElement('video');
    call.on('stream' , userStream=>{
      addVideo(vid , userStream);
    })
    call.on('error' , (err)=>{
      alert(err)
    })
    call.on("close", () => {
        console.log(vid);
        vid.remove();
    })
    peerConnections[call.peer] = call;
  })
}).catch(err=>{
  alert(err.message)
  console.log(err.message);
});
peer.on('open' , (id)=>{
  myId = id;
  socket.emit("newUser" , id , roomID);
  RId.innerHTML="Room ID: "+window.location.pathname.substring(1) + window.location.hash;
  var button = document.createElement("button")
  button.innerHTML = "Mute: " + id;
  button.onclick = function(){
      alert("Check if " + id + " is muted");
      var vid = document.getElementById(id);
      var att = vid.getAttribute('muted');
      att = att ? false : true;
      //vid.setAttribute('muted', vid.getAttribute('muted'), att);*/
      alert("___")
      alert(att);
  };
  btnGroup.append(button);
})
peer.on('error' , (err)=>{
  alert(err.type);
});
socket.on('userJoined' , id=>{
  console.log("new user joined"+id)
  const call  = peer.call(id , myVideoStream);
  const vid = document.createElement('video');
  vid.setAttribute('id', id);
  call.on('error' , (err)=>{
    alert(err);
  })
  call.on('stream' , userStream=>{
    addVideo(vid , userStream);
  })
  call.on('close' , ()=>{
    vid.remove();
    console.log("user disconect")
  })
  peerConnections[id] = call;
})
socket.on('userDisconnect' , id=>{
  if(peerConnections[id]){
    peerConnections[id].close();
  }
})
function addVideo(video , stream){
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video);
}

