"use strict";

/*global $,angular*/

/**
 * MME exercise 6
 * author: Michael Duve
 * matnr: 798419
 */

var apiUrl = 'http://localhost:1337/api/books/';

$(document).ready(function() {

    $(".nav.navbar-nav").on("click", "li a", function(e) {
        $(this).parent().parent().find("li.active").removeClass("active");
        $(this).parent().addClass("active");
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).attr("href");
        toggleNav(href);
    });

    $('.panel-collapse').on('show.bs.collapse', function () {
        var id = $(this).attr("id");
        var currentItem = $("a[href=#"+id+"]");
        if (currentItem) {
            currentItem.parent().addClass("active");
        }
    }).on('hide.bs.collapse', function () {
        var id = $(this).attr("id");
        var currentItem = $("a[href=#"+id+"]");
        if (currentItem) {
            currentItem.parent().removeClass("active");
        }
    });

});

angular.module('libraryApp', [])

    .controller('BookController', function($scope, $http) {

        $scope.getAll = function(toggle) {
            $http.get(apiUrl + "?rpp=0").then(function(resp) {
                $scope.books = resp.data;
                if (toggle) {
                    toggleNav("#collapseList");
                }
            }, function(err) {
                errorHandler(err);
            });
        };

        $scope.deleteBook = function(id, toggle) {
            $http.delete(apiUrl+id).then(function() {
                if (toggle) {
                    toggleNav("#collapseList");
                }
                $scope.getAll();
            }, function(err) {
                errorHandler(err);
            });
        };

        $scope.editBook = function(id) {
            $http.get(apiUrl+id).then(function(resp) {
                $scope.editBookData = resp.data;
                toggleNav("#collapseEdit");
                $scope.hideAllNotifications();
            }, function(err) {
                errorHandler(err);
            });
        };

        $scope.addBook = function(addBookData) {

            $http.post(apiUrl, addBookData).then(function() {
                toggleNav("#collapseList");
                $scope.hideAllNotifications();
                $scope.getAll();
            }, function(err) {
                errorHandler(err);
            });

        };

        $scope.updateBook = function(item) {

            $http.put(apiUrl+item._id, item).then(function() {
                toggleNav("#collapseList");
                $scope.hideAllNotifications();
                $scope.getAll();
            }, function(err) {
                errorHandler(err);
            });

        };

        $scope.myFilter = function (item) {
            if (!$scope.search) {
                return true;
            }
            var nameFound = false;
            var descriptionFound = false;

            if (item.name) {
                nameFound = (item.name.indexOf($scope.search) > -1);
            }
            if (item.description) {
                descriptionFound = (item.description.indexOf($scope.search) > -1);
            }

            return nameFound || descriptionFound;
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
            } else {
                console.error(err);
            }
        }

    });

function toggleNav(item) {
    $('.panel-collapse:not('+item+')').collapse("hide");
    $(item).collapse("show");
}

