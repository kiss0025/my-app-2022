window.onload = function () {
  "use strict";
  var paths = document.getElementsByTagName("path");
  var visualizer = document.getElementById("visualizer");
  var mask = visualizer.getElementById("mask");
  var h = document.getElementsByTagName("h1")[0]; // 중간 db값
  var hSub = document.getElementsByTagName("h1")[1]; // db값 아래 사운드불량 표시
  var ngbtn = document.getElementById("btn-ng");
  var okbtn = document.getElementById("btn-ok");
  var AudioContext;
  var audioContent;
  var start = false;
  var permission = false;
  var path;
  var seconds = 0;
  var loud_volume_threshold = 70;
  var volume_A = 10; // 이하 불량치
  var volume_B = 30;
  var volume_C = 50;

  var soundAllowed = function (stream) {
    permission = true;
    var audioStream = audioContent.createMediaStreamSource(stream);
    var analyser = audioContent.createAnalyser();
    var fftSize = 1024;

    analyser.fftSize = fftSize;
    audioStream.connect(analyser);

    var bufferLength = analyser.frequencyBinCount;
    var frequencyArray = new Uint8Array(bufferLength);

    visualizer.setAttribute("viewBox", "0 0 255 255");

    for (var i = 0; i < 255; i++) {
      path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("stroke-dasharray", "4,1");
      mask.appendChild(path);
    }
    var doDraw = function () {
      requestAnimationFrame(doDraw);
      if (start) {
        analyser.getByteFrequencyData(frequencyArray);
        var adjustedLength;
        for (var i = 0; i < 255; i++) {
          adjustedLength =
            Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
          paths[i].setAttribute("d", "M " + i + ",255 l 0,-" + adjustedLength);
        }
      } else {
        for (var i = 0; i < 255; i++) {
          paths[i].setAttribute("d", "M " + i + ",255 l 0,-" + 0);
        }
      }
    };
    var showVolume = function () {
      setTimeout(showVolume, 500);
      if (start) {
        analyser.getByteFrequencyData(frequencyArray);
        var total = 0;
        for (var i = 0; i < 255; i++) {
          var x = frequencyArray[i];
          total += x * x;
        }
        var rms = Math.sqrt(total / bufferLength);
        var db = 20 * (Math.log(rms) / Math.log(10));
        db = Math.max(db, 0); // sanity check
        h.innerHTML = Math.floor(db) + " dB";

        /*if (db >= loud_volume_threshold) {
                    seconds += 0.5;
                    if (seconds >= 5) {
                        hSub.innerHTML = "You’ve been in loud environment for<span> " + Math.floor(seconds) + " </span>seconds." ;
                    }
                }*/
        if (db <= volume_B) {
          seconds += 0.5;
          if (seconds >= 3) {
            hSub.innerHTML =
              "사운드 불량<span> " + Math.floor(seconds) + " </span>seconds.";
            ngbtn.innerHTML = "불량";
            ngbtn.style.backgroundColor = "red";
          }
        } else {
          seconds = 0;
          hSub.innerHTML = "";
          ngbtn.innerHTML = "정상";
          ngbtn.style.backgroundColor = "green";
        }
      } else {
        h.innerHTML = "";
        hSub.innerHTML = "";
      }
    };

    doDraw();
    showVolume();
  };

  var soundNotAllowed = function (error) {
    h.innerHTML = "You must allow your microphone.";
    console.log(error);
  };

  document.getElementById("button").onclick = function () {
    if (start) {
      start = false;
      this.innerHTML = "<span class='fa fa-play'></span>Start Listen";
      this.className = "green-button";
      ngbtn.innerHTML = "";
      ngbtn.style.backgroundColor = "#222";
      h.innerHTML = "시작하려면 Start 버튼을 누르세요";
    } else {
      if (!permission) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(soundAllowed)
          .catch(soundNotAllowed);

        AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContent = new AudioContext();
      }
      start = true;
      this.innerHTML = "<span class='fa fa-stop'></span>Stop Listen";
      this.className = "red-button";
    }
  };
};
