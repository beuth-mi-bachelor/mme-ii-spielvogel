"use strict";

/*global $,angular*/

/**
 * MME exercise 6
 * author: Michael Duve
 * matnr: 798419
 */

var apiUrl = 'http://localhost:1337/api/books/';

$(document).ready(function() {
    $(".nav.navbar-nav").on("click", "li", function() {
        $("li.active").removeClass("active");
        $(this).addClass("active");
    });

    $('.panel-collapse').on('show.bs.collapse', function () {
        var id = $(this).attr("id");
        var currentItem = $("a[href=#"+id+"]").parent();
        currentItem.addClass("active");
    }).on('hide.bs.collapse', function () {
        var id = $(this).attr("id");
        var currentItem = $("a[href=#"+id+"]").parent();
        currentItem.removeClass("active");
    });

});

angular.module('libraryApp', [])

    .controller('BookController', function($scope, $http) {

        $scope.getAll = function() {
            $http.get(apiUrl).then(function(resp) {
                $scope.books = resp.data;
            }, function(err) {
                errorHandler(err);
            });
        };

        $scope.deleteBook = function(id, toggle) {
            $http.delete(apiUrl+id).then(function() {
                if (toggle) {
                    $('#collapseList').collapse("toggle");
                }
                $scope.getAll();
            }, function(err) {
                errorHandler(err);
            });
        };

        $scope.editBook = function(id) {
            $http.get(apiUrl+id).then(function(resp) {
                $scope.editBookData = resp.data;
                $('#collapseList').collapse("hide");
                $('#collapseEdit').collapse("toggle");
                $scope.hideAllNotifications();
            }, function(err) {
                errorHandler(err);
            });
        };

        $scope.addBook = function(addBookData) {

            $http.post(apiUrl, addBookData).then(function() {
                $('#collapseList').collapse("toggle");
                $scope.hideAllNotifications();
                $scope.getAll();
            }, function(err) {
                errorHandler(err);
            });

        };

        $scope.updateBook = function(item) {

            $http.put(apiUrl+item._id, item).then(function() {
                $('#collapseList').collapse("toggle");
                $scope.hideAllNotifications();
            }, function(err) {
                errorHandler(err);
            });

        };

        // HELPER
        $scope.showState = function(input) {
            return input === 1 ? 'online' : 'offline';
        };

        $scope.showChecked = function(input) {
            return input === 1 ? 'checked' : '';
        };

        $scope.hideNotification = function(id) {
            $scope.errObj.errors[id].show = false;
        };

        $scope.hideAllNotifications = function() {
            $scope.errObj = {};
        };

        function errorHandler(err) {
            $scope.errObj = {};
            if (err.status === 400) {
                $scope.errObj.msg = err.data.msg;
                $scope.errObj.errors = err.data.errors;
                for (var error in $scope.errObj.errors) {
                    if ($scope.errObj.errors.hasOwnProperty(error)) {
                        $scope.errObj.errors[error].show = true;
                    }
                }
                $scope.errObj.show = true;
                console.log( $scope.errObj);
            } else {
                console.error(err);
            }
        }

    });

