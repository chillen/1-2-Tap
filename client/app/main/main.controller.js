'use strict';

angular.module('12TapApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, schemeStatus, Modal) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.currPhase = schemeStatus.currPhase;
    $scope.incrementPhase = Auth.incrementPhase;

    $scope.loadPasswordModal = function(user) {
      console.log(user.control);
      if (user.control) {
        // if in practice mode
        if (user.currentPhase < 3)
          Modal.getTextModalPractice(user)();
        else
          Modal.getTextModal(user)();
      }
      else {
        // if in practice mode
        if (user.currentPhase < 3)
          Modal.getTapModalPractice(user)();
        else
          Modal.getTapModal(user)();
      }
    }

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
