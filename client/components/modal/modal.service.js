'use strict';

angular.module('12TapApp')
  .factory('Modal', function ($rootScope, $modal, tapgrid, Auth) {
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
          var passModal;
          var curChar = 0;
          var currentIndex = user.currentPhase % 3;
          var fullPassShown = false; // Have they been shown the entire password?
          var maxAttempts = 3;
          var attemptsRemaining;

          passModal = openTapModal({
            modal: {
              dismissable: false,
              title: 'Login to ' + services[currentIndex],
              password: user.phase[currentIndex],
              practice: user.currentPhase < 3,
              curChar: curChar,

              shouldIBloop: function(i) {
                // current char of the password
                var char = user.phase[currentIndex].charAt(this.curChar);

                // If in practice && either i*2 or i*2+1 at the current pass character
                return this.practice && (char == (i*2).toString(16) || char == (i*2+1).toString(16));
              },

              shouldIBloopBloop: function(i) {
                // current char of the password
                var char = user.phase[currentIndex].charAt(this.curChar);

                // If it should bloop and the char == i*2+1, meaning it's a double
                // tap/click
                return this.shouldIBloop(i) && (char == (i*2+1).toString(16));
              },

              tryGrid: function(i, single) {
                // if the character tapped is correct based on the hex algorithm
                // Read the Readme
                // Correct! Good job.
                if (user.phase[currentIndex].charAt(this.curChar) == (single? i*2 : i*2+1).toString(16)) {
                  this.curChar++;
                  // Beyond the end of the password? Sweet!
                  if (this.curChar >= user.phase[currentIndex].length) {
                    swal("Good job!", "You logged in! That's awesome!", "success");
                    Auth.incrementPhase();
                    passModal.close({});
                  }

                }
                else {
                  swal("Oh no!", "It's okay, maybe with some practice you'll be a pro!", "error");
                  passModal.close({});
                }
              },

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

// Nice shim to allow for both single and double clicks on the same element,
// provided by Rob at http://stackoverflow.com/questions/20444409/handling-ng-click-and-ng-dblclick-on-the-same-element-with-angularjs
angular.module('12TapApp')
  .directive('sglclick', ['$parse', function($parse) {
       return {
           restrict: 'A',
           link: function(scope, element, attr) {
             var fn = $parse(attr['sglclick']);
             var delay = 300, clicks = 0, timer = null;
             element.on('click', function (event) {
               clicks++;  //count clicks
               if(clicks === 1) {
                 timer = setTimeout(function() {
                   scope.$apply(function () {
                       fn(scope, { $event: event });
                   });
                   clicks = 0;             //after action performed, reset counter
                 }, delay);
                 } else {
                   clearTimeout(timer);    //prevent single-click action
                   clicks = 0;             //after action performed, reset counter
                 }
             });
           }
       };
   }]);
