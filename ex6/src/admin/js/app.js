"use strict";

/*global $,angular*/

/**
 * MME exercise 6
 * author: Michael Duve
 * matnr: 798419
 */

angular.module('libraryApp', [])

    .controller('BookController', function($scope, $http, $sce) {

        $scope.getAll = function() {
            $http.get('http://localhost:1337/api/books/').then(function(resp) {
                console.log($scope.editBook);
                $scope.books = resp.data;
            }, function(err) {
                errorHandler(err);
            });
        };

        $scope.deleteBook = function(id) {
            $http.delete('http://localhost:1337/api/books/'+id).then(function(resp) {
                console.log("deleted " + id);
                $scope.getAll();
            }, function(err) {
                errorHandler(err);
            });
        };

        $scope.editBook = function(id) {
            $http.get('http://localhost:1337/api/books/'+id).then(function(resp) {
                $scope.editBookData = resp.data;
                $(".collapse.in").collapse('toggle');
                $('#collapseEdit').collapse('toggle');
            }, function(err) {
                errorHandler(err);
            });
        };

        $scope.updateBook = function(item) {

            var authors = [];

            for (var i in item.author) {
                if (item.author.hasOwnProperty(i)) {
                    authors.push(item.author[i].name);
                }
            }

            item.author = authors;

            $http.put('http://localhost:1337/api/books/'+item._id, item).then(function(resp) {
                $(".collapse.in").collapse('toggle');
                $('#collapseList').collapse('toggle');
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

    });

function errorHandler(err) {
    console.error(err);
}