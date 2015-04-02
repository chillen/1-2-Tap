'use strict';

angular.module('12TapApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, Modal) {

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.currPhase = function (isit) { return Auth.getCurrentUser().currentPhase == isit; };
    $scope.incrementPhase = Auth.incrementPhase;

    $scope.loadPasswordModal = function(user) {
      console.log(user.control);
      if (user.control) {
        Modal.getTextModal(user)();
      }
      else {
        Modal.getTapModal(user)();
      }
    }

  });
