"use strict";

/*global $*/

/**
 * MME exercise 6
 * author: Michael Duve
 * matnr: 798419
 */

var pathToApi = "/api/books";

$(document).ready(function() {

    var $body = $("body");

    var bookSource   = $("#book-list-template").html();
    var bookListTemplate = Handlebars.compile(bookSource);

    var notificationSource   = $("#notification-template").html();
    var notificationTemplate = Handlebars.compile(notificationSource);

    var editSource   = $("#book-form-template").html();
    var editTemplate = Handlebars.compile(editSource);

    scroll_if_anchor(window.location.hash);
    $body.on("click", "a[href^='#']", scroll_if_anchor);

    $(".navbar-nav").on("click", "li a", function() {
        var $listItem = $(this).parent();

        if ($listItem.hasClass("active")) {
            return false;
        }

        $(".navbar-nav .active").removeClass("active");
        $listItem.addClass("active");

    });

    $body.on("click", ".delete", function() {
        var id = $(this).data("delete-book");
        deleteBook(id, function(data) {
            $(".notification-container").html(notificationTemplate(data));
        });
    });

    $body.on("click", ".edit", function() {
        var id = $(this).data("edit-book");
        editBook(id, function(data) {
            console.log(data);
        });
    });

    $("#addbook").submit(function(e) {
        var data = {};
        $(this).serializeArray().map(function(x){
            if (x.value && x.value !== null && x.value !== "") {
                data[x.name] = x.value;
            }
        });
        if (data.state) {
            data.state = 1;
        }
        if (data.author) {
            data.author = data.author.split(",");
        }
        console.log(data);
        e.preventDefault();
        return false;
    });

    getAllBooks(function(books) {
        $(".book-list").html(bookListTemplate(books));
    });
});

function getAllBooks(_callback) {
    $.ajax({
        method: "GET",
        url: pathToApi,
        dataType: "json"
    }).success(function(data) {
        _callback(data);
    });
}

function deleteBook(id, _callback) {
    $.ajax({
        method: "DELETE",
        url: pathToApi + "/" + id,
        dataType: "json"
    }).success(function() {
        _callback(id);
    });
}

function editBook(id, _callback) {
    $.ajax({
        method: "GET",
        url: pathToApi + "/" + id,
        dataType: "json"
    }).success(function() {
        _callback(id);
    });
}

function scroll_if_anchor(href) {
    href = typeof(href) === "string" ? href : $(this).attr("href");
    if (!href || $(this).attr("data-parent") === "#accordion") {
        return;
    }
    var fromTop = 70,
        $target = $(href);

    // Older browsers without pushState might flicker here, as they momentarily
    // jump to the wrong position (IE < 10)
    if($target.length) {
        $('html, body').animate({ scrollTop: $target.offset().top - fromTop });
        if(history && "pushState" in history) {
            history.pushState({}, document.title, window.location.pathname + href);
            return false;
        }
    }
}