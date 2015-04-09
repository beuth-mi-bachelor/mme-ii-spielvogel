/**
 * MME exercise 1
 * author: Michael Duve
 * matnr: 798419
 */

var togglePlaying,
    stop,
    video,
    fullscreen,
    displayCurrentTime,
    displayFullTime,
    progress,
    manualTimeChange = false,
    videoLength = 0;

    function displayConsoleMessage() {
    "use strict";
    console.log("app is started");
}

function bindSelectors() {
    "use strict";
    togglePlaying = document.getElementById("toggle-playing");
    stop = document.getElementById("stop");
    fullscreen = document.getElementById("fullscreen");
    displayCurrentTime = document.getElementById("time-current");
    displayFullTime = document.getElementById("time-full");
    progress =  document.getElementById("progressbar");
    video = document.getElementById("video-oceans");
}

function toggleVideoPlayPause() {
    "use strict";
    if (video.paused) {
        togglePlaying.className = "fa fa-pause";
        video.play();
    } else {
        togglePlaying.className = "fa fa-play";
        video.pause();
    }
}

function stopVideo() {
    "use strict";
    video.pause();
    video.currentTime = 0;
    togglePlaying.className = "fa fa-play";
}

function goToFullscreen(element) {
    "use strict";
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function convertSecondsToTimeString(seconds) {
    "use strict";
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

function updateVideoProgess(time) {
    "use strict";
    progress.value = Math.floor(time);
}

function bindEvents() {
    "use strict";

    togglePlaying.addEventListener("click", function() {
        toggleVideoPlayPause();
    }, false);

    video.addEventListener("ended", function() {
        togglePlaying.className = "fa fa-play";
    }, false);

    stop.addEventListener("click", function() {
        stopVideo();
    }, false);

    fullscreen.addEventListener("click", function() {
        goToFullscreen(video);
    }, false);

    progress.addEventListener("input", function() {
        manualTimeChange = true;
        video.currentTime = Math.floor(this.value);
    }, false);

    video.addEventListener("timeupdate", function() {
        displayCurrentTime.innerHTML = convertSecondsToTimeString(this.currentTime);
        if (!manualTimeChange) {
            updateVideoProgess(this.currentTime);
        }
        manualTimeChange = false;
    }, false);

    video.addEventListener("loadeddata", function() {
        displayCurrentTime.innerHTML = convertSecondsToTimeString(0);
        displayFullTime.innerHTML = convertSecondsToTimeString(this.duration);
        progress.max = Math.floor(this.duration);
        videoLength = Math.floor(this.duration);
        updateVideoProgess(0);
    }, false);

}

window.onload = function() {
    "use strict";

    displayConsoleMessage();

    bindSelectors();
    bindEvents();

};