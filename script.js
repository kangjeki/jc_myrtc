var remoteVideo = document.querySelector('#remoteVideo');
var localVideo  = document.querySelector('#localVideo');

// Generate random room name if needed
// if (!location.hash) {
//   location.hash = "aaaa";
// }

const getSrc    = window.location.search;
const roomHash1  = getSrc.replace('?', '');
const roomHash  = roomHash1.replace('&i=1', '');
console.log(roomHash);
// TODO: Replace with your own channel ID
const drone = new ScaleDrone('sAYsnmDrO0rYAPVG');
// Room name needs to be prefixed with 'observable-'
const roomName = 'observable-' + roomHash;
const configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }]
};
let room;
let pc;

document.querySelector('#link').innerHTML = window.location;

function onSuccess(e) {
  remoteVideo.play();
  let dv = document.createElement('div'),
      tx = document.createTextNode("Connected");

  let iW = window.innerWidth,
      iH = window.innerHeight,
      wd = (iW - 100) / 2,
      hg = (iH - 30) / 2;

  dv.appendChild(tx);
  dv.style.cssText = `margin: 0; padding: 5px; width: 100px; text-align: center; position: fixed; z-index: 999; top: ${hg}px; left: ${wd}px; background: green; color: #fff;`;
  document.body.appendChild(dv);
  setTimeout(function() {
    dv.remove();
  }, 2000);

  
};
function onError(er) {
  console.log(er);
};

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }

  room = drone.subscribe(roomName);
  room.on('open', error => {
    if (error) {
      onError(error);
    }
  });

  room.on('members', members => {
    const isOfferer = members.length == 2;
    console.log(isOfferer);
    startWebRTC(isOfferer);
  });
});

// Send signaling data via Scaledrone
function sendMessage(message) {
  drone.publish({
    room: roomName,
    message
  });
}

function startWebRTC(isOfferer) {
  let videoMode;

  this.fullScreenVideo = function() {
    if (remoteVideo.requestFullscreen) {
      remoteVideo.requestFullscreen();
    } else if (remoteVideo.mozRequestFullScreen) { /* Firefox */
      remoteVideo.mozRequestFullScreen();
    } else if (remoteVideo.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      remoteVideo.webkitRequestFullscreen();
    } else if (remoteVideo.msRequestFullscreen) { /* IE/Edge */
      remoteVideo.msRequestFullscreen();
    }
  }

  this.shareScreen = function() {
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      }).then(stream => {
        localVideo.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        videoMode = "screen";
        document.querySelector('#switchShare').innerHTML = "Share Camera";
      }, onError); 
  }

  this.shareCamera = function() {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      localVideo.srcObject = stream;
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      
      videoMode = "camera";
      document.querySelector('#switchShare').innerHTML = "Share Screen";
    }, onError);
  }

  this.switchShare = function() {
    if (videoMode == "screen") {
      shareCamera();
    }
    else if (videoMode == "camera") {
      shareScreen();
    }
  }

  pc = new RTCPeerConnection(configuration);

  pc.onicecandidate = event => {
    if (event.candidate) {
      sendMessage({'candidate': event.candidate});
    }
  };

  if (isOfferer) {
    pc.onnegotiationneeded = () => {
      pc.createOffer().then(localDescCreated).catch(onError);
    }
  }

  pc.ontrack = event => {
    const stream = event.streams[0];
    if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
      remoteVideo.srcObject = stream;
    }
  };

  room.on('data', (message, client) => {
    if (client.id === drone.clientId) {
      return;
    }

    if (message.sdp) {
      pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
        if (pc.remoteDescription.type === 'offer') {
          pc.createAnswer().then(localDescCreated).catch(onError);
        }
      }, onError);
    } else if (message.candidate) {
      pc.addIceCandidate(
        new RTCIceCandidate(message.candidate), onSuccess, onError
      );
    }
  });
  shareCamera();
}

function localDescCreated(desc) {
  pc.setLocalDescription(
    desc,
    () => sendMessage({'sdp': pc.localDescription}),
    onError
  );
}

function refresh() {
  let loc = window.location;
  window.location.href = loc;
}
