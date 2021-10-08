document.getElementById("joinBtn").onclick = function() {joinRoom()};

function joinRoom() {
  var RId=document.getElementById("linkTxt").value
  window.open("/"+RId,"_self"); 
}