'use strict';

angular.module('12TapApp')
  .factory('Modal', function ($rootScope, $modal, tapgrid) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    function openTapModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/tapgrid/tapgrid.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    var services = ["Awesome Airlines", "Accidentally $160 on Prime Shopping", "Moving Music"];
    var colours  = ["modal-primary", "modal-success", "modal-info"];

    // Public API here
    return {

      bloop: function() {
        console.log("Bloop");
      },

      getTextModal: function(user) {

        return function() {
          var passModal;
          var currentIndex = user.currentPhase % 3;

          passModal = openModal({
            modal: {
              dismissable: false,
              title: 'Login to ' + services[currentIndex],
              html: '<p>Your current password is: ' + user.phase[currentIndex] + '</p>',
              password: '<p>'+user.phase[currentIndex]+'</p>',
              buttons: [{
                classes: 'btn-confirm',
                text: 'Login',
                click: function(e) {
                  passModal.close(e);
                }
              }]
            },
            user: user,
          }, colours[currentIndex]);

          passModal.result.then(function(event) {
            console.log(":D");
          });
        };

      },

      getTapModal: function(user) {

        return function() {
          var passModal, curChar;
          var currentIndex = user.currentPhase % 3;

          // i is the i value, as described in the README
          // Single is a boolean which is true or false depending on if they
          // tingle clicked/tapped
          var tryGridPoint = function(i, single) {
            // if the character tapped is correct based on the hex algorithm
            // Read the Readme
            return (user.phase[currentIndex].charAt(curChar++) == (single? i*2 : i*2+1).toString(16));

          },

          passModal = openTapModal({
            modal: {
              dismissable: false,
              title: 'Login to ' + services[currentIndex],
              html: '<p>Your tap password is: ' + user.phase[currentIndex] + '</p>' ,
              password: user.phase[currentIndex],
              practice: user.currentPhase < 3,
              curChar: curChar,
              buttons: [{
                classes: 'btn-confirm',
                text: 'Login',
                click: function(e) {
                  passModal.close(e);
                }
              }]
            }
          }, colours[currentIndex]);

          passModal.result.then(function(event) {
            console.log(":D");
          });
        };

      }
    };
  });
