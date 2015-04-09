/**
 * MME exercise 1
 * author: Michael Duve
 * matnr: 798419
 */

var togglePlaying,
    video;

function displayConsoleMessage() {
    "use strict";
    console.log("app is started");
}

function bindSelectors() {
    "use strict";
    togglePlaying = document.getElementById("toggle-playing");
    video = document.getElementById("video-oceans");
}

function togglePlayPause() {
    "use strict";
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function bindEvents() {
    "use strict";

    togglePlaying.addEventListener("click", function() {
        togglePlayPause();
    }, false);
}

window.onload = function() {
    "use strict";

    displayConsoleMessage();

    bindSelectors();
    bindEvents();

};