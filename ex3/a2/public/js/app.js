/**
 * MME exercise 1
 * author: Michael Duve
 * matnr: 798419
 */

var videoTest,
    togglePlaying,
    stop,
    video,
    fullscreen,
    displayCurrentTime,
    displayFullTime,
    progress,
    manualTimeChange = false,
    videoLength = 0;

var canvas,
    ctx,
    w,
    h,
    toGreyScale = false,
    toBlur = false,
    blurButton,
    greyscaleButton;

function displayConsoleMessage() {
    "use strict";
    console.log("app is started");
}

function bindSelectors() {
    "use strict";
    videoTest = document.getElementById("video-test");
    togglePlaying = document.getElementById("toggle-playing");
    stop = document.getElementById("stop");
    fullscreen = document.getElementById("fullscreen");
    displayCurrentTime = document.getElementById("time-current");
    displayFullTime = document.getElementById("time-full");
    progress = document.getElementById("progressbar");
    video = document.getElementById("video-oceans");
    canvas = document.getElementById('canvas-video');
    greyscaleButton = document.getElementById("greyscale");
    blurButton = document.getElementById("blur");
    ctx = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;
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
    video.currentTime = 0;
    video.pause();
    togglePlaying.className = "fa fa-play";
}

function fsExitHandler() {
    "use strict";
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        fullscreen.className = "fa fa-compress";
        fullscreen.removeEventListener("click", goToFullscreen, false);
        fullscreen.addEventListener("click", exitFullscreen, false);
    } else {
        fullscreen.className = "fa fa-expand";
        fullscreen.removeEventListener("click", exitFullscreen, false);
        fullscreen.addEventListener("click", goToFullscreen, false);
    }
}

function goToFullscreen() {
    "use strict";
    var element = videoTest;

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

function exitFullscreen() {
    "use strict";
    var element = videoTest;

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
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

function draw(v, c, w, h) {
    "use strict";
    ctx.drawImage(v, 0, 0, w, h);
    if (toGreyScale) {
        grayScale();
    }
    if (toBlur) {
        blur();
    }
    if (v.paused || v.ended) {
        return false;
    }
    setTimeout(draw, 20, v, c, w, h);
}

function grayScale() {
    "use strict";
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = imgData.data;
    for (var i = 0, n = pixels.length; i < n; i += 4) {
        var grayscale = pixels[i] * 0.3 + pixels[i + 1] * 0.59 + pixels[i + 2] * 0.11;
        pixels[i  ] = grayscale;
        pixels[i + 1] = grayscale;
        pixels[i + 2] = grayscale;
    }
    ctx.putImageData(imgData, 0, 0);
}

function blur() {
    "use strict";
    var buffer;
    buffer = canvas;
    ctx.globalAlpha = 0.3;
    var offset = 3;
    for (var i = 1; i <= 8; i++) {
        ctx.drawImage(buffer, offset, 0, buffer.width - offset, buffer.height, 0, 0, buffer.width - offset, buffer.height);
        ctx.drawImage(buffer, 0, offset, buffer.width, buffer.height - offset, 0, 0, buffer.width, buffer.height - offset);
    }
}

function switchButton(element, toggle) {
    "use strict";
    if (toggle) {
        element.className = "fa fa-check-circle";
    } else {
        element.className = "fa fa-circle";
    }
}

function bindEvents() {
    "use strict";

    togglePlaying.addEventListener("click", function () {
        toggleVideoPlayPause();
    }, false);

    video.addEventListener('ended', function () {
        togglePlaying.className = "fa fa-play";
    }, false);

    stop.addEventListener("click", function () {
        stopVideo();
    }, false);

    fullscreen.addEventListener("click", goToFullscreen, false);

    videoTest.addEventListener("fullscreenchange", fsExitHandler);
    videoTest.addEventListener("webkitfullscreenchange", fsExitHandler);
    videoTest.addEventListener("mozfullscreenchange", fsExitHandler);
    videoTest.addEventListener("MSFullscreenChange", fsExitHandler);

    progress.addEventListener("input", function () {
        manualTimeChange = true;
        video.currentTime = Math.floor(this.value);
    }, false);

    video.addEventListener("timeupdate", function () {
        displayCurrentTime.innerHTML = convertSecondsToTimeString(this.currentTime);
        if (!manualTimeChange) {
            updateVideoProgess(this.currentTime);
        } else {
            draw(this, ctx, w, h);
        }
        manualTimeChange = false;
    }, false);

    video.addEventListener("loadeddata", function () {
        displayCurrentTime.innerHTML = convertSecondsToTimeString(0);
        displayFullTime.innerHTML = convertSecondsToTimeString(this.duration);
        progress.max = Math.floor(this.duration);
        videoLength = Math.floor(this.duration);
        updateVideoProgess(0);
        draw(video, ctx, w, h);
    }, false);

    video.addEventListener('play', function () {
        draw(this, ctx, w, h);
    }, false);

    greyscaleButton.addEventListener('click', function () {
        toGreyScale = !toGreyScale;
        draw(video, ctx, w, h);
        switchButton(this, toGreyScale);
    }, false);

    blurButton.addEventListener('click', function () {
        toBlur = !toBlur;
        draw(video, ctx, w, h);
        switchButton(this, toBlur);
    }, false);

}

window.onload = function () {
    "use strict";

    displayConsoleMessage();

    bindSelectors();
    bindEvents();

};