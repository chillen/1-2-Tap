'use strict';

angular.module('12TapApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, Modal) {

    var maxAttempts = 3;
    var attemptsRemaining = maxAttempts;

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.currPhase = function (isit) { return Auth.getCurrentUser().currentPhase == isit; };
    $scope.incrementPhase = function() { Auth.incrementPhase; attemptsRemaining = maxAttempts; };
    $scope.resetAttempts = function() { attemptsRemaining = maxAttempts; }
    $scope.getAttemptsRemaining = function() { return attemptsRemaining; };
    $scope.reduceAttempts = function() { attemptsRemaining--; };

    $scope.loadPasswordModal = function(user) {

      user.getAttemptsRemaining = $scope.getAttemptsRemaining;
      user.resetAttempts = $scope.resetAttempts;
      user.reduceAttempts = $scope.reduceAttempts;

      if (user.control) {
        Modal.getTextModal(user)();
      }
      else {
        Modal.getTapModal(user)();
      }
    }

  });
