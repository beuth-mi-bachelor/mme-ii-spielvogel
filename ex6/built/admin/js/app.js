/**
 * MME exercise 6
 * author: Michael Duve
 * matnr: 798419
 */


window.onload = (function ($) {
    "use strict";

    $.ajax({
        method: "GET",
        url: "test.js",
        dataType: "script"
    });

}(jQuery));