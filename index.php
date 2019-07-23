<!DOCTYPE html>
<html>
<head>
  <script type='text/javascript' src='js/scaledrone.min.js'></script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
  <style>
    body {
      margin: 0; padding: 0;
      background: #00142b;
    }
    a {
      margin: 0; padding: 0;
      text-decoration: none;
    }
    #container {
      margin: 0; padding: 10px;
    }
    #localVideo {
      margin: 0; padding: 0;
      width: 25%;
      position: absolute;
      z-index: 99;
      right: 10px;
      bottom: 10px;
    }
    #remoteVideo {
      margin: 0; padding: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0; right: 0; left: 0; bottom: 0;
    }
    #link {
      margin: 0; padding: 0;
      color: #fff;
      font-size: 15px;
      font-family: arial;
    }
    #btn_group {
      margin: 0; padding: 0;
      position: absolute;
      left: 20px;
      bottom: 20px;
      z-index: 99;
    }
    .btn_opt {
      margin: 0; padding: 10px;
      background: #067e03;
      color: #fff;
      border: 0.5px #fff solid;
      border-radius: 5px;
    }
    #homepage {
      margin: auto;
      text-align: center;
    }
    #homepage input {
      padding: 0 5px;
      height: 30px;
      width: 300px;
      border: 0.5px #1c9706 solid;
      border-radius: 5px;
    }
    #homepage button {
      height: 30px;
      border: 2px #1c9706 solid;
      background: #1c9706;
      border-radius: 5px;
      color: #fff;
      padding: 0 10px; 
    }
    p {
      color: #fff;
    }
  </style>
</head>
<body>
  <div id="container">
    
    <?php if ( strlen($_SERVER["QUERY_STRING"]) === 0 ) { ?>
      <div id="homepage">
        <p>
          Simple WebRTC
        </p>
        <input type="text" id="in_link" placeholder="Buat/Gabung Ruang">
        <button onclick="window.location.href = window.location + '?' + document.querySelector('#in_link').value;">Masuk</button>
        <br><br><br>
        <p>
          Simple WebRTC Demo <br>
          by: JC_Program
        </p>
      </div>
    <?php } else if ( strlen($_SERVER["QUERY_STRING"]) !== 0 ) { ?>
      <div id="streaming">
        <video id="localVideo" autoplay></video>
        <video id="remoteVideo" autoplay controls></video> 
        <?php 
          $lnk = explode("?", $_SERVER["REQUEST_URI"]);
          $uri = $_SERVER["REQUEST_SCHEME"] . "://". $_SERVER["HTTP_HOST"]. $lnk[0]; 
        ?>
        <p style="margin: 0; padding: 0;">Join Link:<br><b id="link"></b></p>
        <div id="btn_group">
          <a href="<?=$uri;?>" class="btn_opt"><i class="fas fa-home"></i></a>
          <button class="btn_opt" id="switchShare" onclick="switchShare()">Share Screen</button>  
          <button class="btn_opt" onclick="fullScreenVideo()" style="background: #046986"><i class="fas fa-expand"></i></button>  
          <button class="btn_opt" onclick="refresh()" style="background: #96b002"><i class="fas fa-sync"></i></button>  
        </div>
        
        <script src="script.js"></script>  
      </div>
    <?php } ?>
  </div>
</body>
</html>
