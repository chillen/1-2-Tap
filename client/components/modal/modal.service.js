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

    // Modified code from: http://stackoverflow.com/questions/10209655/store-console-logging-in-chrome-in-a-persistent-way
    // Log all material in persistent storage
    console.plog = function () {
      var key = Date.now();
      var value = JSON.stringify([].slice.call(arguments));
      localStorage.setItem(key, value);
    }

    // restore logs
    var restoreLogs = function() {
        swal({title: "LOGS", text: JSON.stringify(localStorage)});
        var timestamps = Object.keys(localStorage).sort();
        timestamps.forEach(function (ts) {
            var logArgs = JSON.parse(localStorage.getItem(ts));
            console.log.apply(console, logArgs);
        });
    };

    var clearLogs = function() {
      var timestamps = Object.keys(localStorage).sort();
      timestamps.forEach(function (ts) {
        localStorage.removeItem(ts);
      });
    }

    var services = ["Awesome Airlines", "Accidentally $160 on Prime Shopping", "Moving Music"];
    var colours  = ["modal-primary", "modal-success", "modal-info"];

    // Public API here
    return {

      getTextModal: function(user) {

        return function() {
          var passModal;
          var currentIndex = user.currentPhase % 3;
          var password = user.phase[currentIndex];
          var practice = user.currentPhase < 3;

          passModal = openModal({
            modal: {
              dismissable: false,
              title: 'Login to ' + services[currentIndex],
              getPassword: function() { return password; },
              getPractice: function() { return practice; },
              login: function() {
                console.plog("[" + Date.now() + "]", user.name, "FUNCTION: LOGIN TOP. ATTEMPTS REMAINING: " + user.getAttemptsRemaining() + ". PRACTICE? " + practice, user, this);
                if (this.typedPassword == "showlogs") {
                  restoreLogs();
                }
                if (this.typedPassword == "clearlogs") {
                  clearLogs();
                }
                if (this.typedPassword == password) {
                  swal("Good job!", "You put in the right pass! Awesome work!", "success");
                  passModal.close({});
                  Auth.incrementPhase();
                  console.plog("[" + Date.now() + "]", user.name, "[Clean] Logged in successfully " + (practice? "in":"out of") + " practice mode. Phase: " + user.currentPhase + " with " + user.getAttemptsRemaining() + " attempts remaining.", user);
                  user.resetAttempts();
                }
                // Wrong password, in practice mode
                else if (practice){
                  swal("Uh oh!", "Looks like that isn't the right pass. Try again!", "info");
                  this.typedPassword = "";
                }
                // Wrong password, NOT practice. Eek.
                else {
                  user.reduceAttempts();
                  if (user.getAttemptsRemaining() > 0) {
                    swal(
                      { title: "Oh no!",
                        text: "<p>It's okay, maybe with some practice you'll be a pro!</p><p> You've got <strong>"+user.getAttemptsRemaining()+" attempts remaining.</strong></p>",
                        html: true,
                        type: "error"
                      });
                    passModal.close({});
                  }
                  else {
                    swal(
                      { title: "Oh poop!",
                        text: "<p>Looks like you've run out of attempts! That's okay, try the next one!</p>",
                        html: true,
                        type: "error"
                      });
                    console.plog("[" + Date.now() + "]", user.name, "[Clean] Failed to login. Phase: " + user.currentPhase + " with " + user.getAttemptsRemaining() + " attempts remaining.", user);
                    Auth.incrementPhase();
                    user.resetAttempts();
                    passModal.close({});
                  }
                }
                console.plog("[" + Date.now() + "]", user.name, "FUNCTION: LOGIN BOTTOM. ATTEMPTS REMAINING: " + user.getAttemptsRemaining() + ". PRACTICE? " + practice, user, this);
              }
            },
            user: user,
          }, colours[currentIndex]);
        };

      },

      getTapModal: function(user) {

        return function() {
          var passModal;
          var curChar = 0;
          var currentIndex = user.currentPhase % 3;

          var fullPassShown = false;
          var practice = user.currentPhase < 3;

          passModal = openTapModal({
            user: user,
            modal: {
              dismissable: false,
              title: 'Login to ' + services[currentIndex],
              password: user.phase[currentIndex],

              getCurChar: function() { return curChar; },
              getPractice: function() { return practice; },

              // The bloop functions check if it's in practice mode, if it's the
              // right grid point, and if the full password has been shown
              // (if it has, it shouldn't bloop)
              shouldIBloop: function(i) {
                // current char of the password
                var char = user.phase[currentIndex].charAt(curChar);

                // If in practice && either i*2 or i*2+1 at the current pass character
                return practice && !fullPassShown && (char == (i*2).toString(16) || char == (i*2+1).toString(16));
              },

              shouldIBloopBloop: function(i) {
                // current char of the password
                var char = user.phase[currentIndex].charAt(curChar);

                // If it should bloop and the char == i*2+1, meaning it's a double
                // tap/click
                return this.shouldIBloop(i) && (char == (i*2+1).toString(16));
              },

              tryGrid: function(i, single) {
                console.plog("[" + Date.now() + "]", user.name, "FUNCTION: TRYGRID TOP. ATTEMPTS REMAINING: " + user.getAttemptsRemaining() + ". PRACTICE? " + practice + ". i " + i + ". SINGLE? " + single, user, this);

                // if the character tapped is correct based on the hex algorithm
                // Read the Readme
                // Correct! Good job.
                if (user.phase[currentIndex].charAt(curChar) == (single? i*2 : i*2+1).toString(16)) {
                  curChar++;

                  // They've put in the password correctly! Yay!
                  if (curChar >= user.phase[currentIndex].length) {
                    // If they're in practice mode and they've seen the password
                    // then they are done practicing, discard the modal.
                    if (practice && fullPassShown) {
                      swal("Good job!", "You got it! Awesome! Time to move on!", "success");
                      console.plog("[" + Date.now() + "]", user.name, "[Clean] Logged in successfully in practice mode. Phase: " + user.currentPhase + " with " + user.getAttemptsRemaining() + " attempts remaining.", user);
                      Auth.incrementPhase();
                      passModal.close({});
                    }
                    // Practice mode, and they haven't seen the full pass. This
                    // means they need to practice without being shown the bloops
                    // but with a retry button which will show their pass again
                    else if (practice) {
                      swal("Almost There!", "You've seen it, now it's time to try yourself! If you don't get it right away, that's okay! Press the retry button to view it again. Good luck!", "info");
                      fullPassShown = true;
                      curChar = 0;
                    }
                    // If they got here and they aren't in practice, they actually
                    // Logged in, so awesome! Increment the phase and give them a
                    // nice message
                    else {
                      swal("Logged in!", "You remembered! Good stuff!", "success");
                      console.plog("[" + Date.now() + "]", user.name, "[Clean] Logged in successfully out of practice mode. Phase: " + user.currentPhase + " with " + user.getAttemptsRemaining() + " attempts remaining.", user);
                      user.resetAttempts();
                      Auth.incrementPhase();
                      passModal.close({});
                    }
                  }
                }
                else {
                  // In practice mode, we won't kick you out of the modal, just
                  // give you an info box and reset to char 0.
                  if (practice) {
                    var grid = ["A", "B", "C", "D", "E", "F", "G", "H"];
                    var check = parseInt(user.phase[currentIndex].charAt(curChar), 16);
                    var shouldHaveTap = (check%2==0) ? "single" : "double";
                    var shouldHaveGrid = grid[Math.floor(check / 2)];
                    swal({title: "Close!", text: "... But not quite! Try again! (<strong>Hint:</strong> You should have <strong>" + shouldHaveTap + " tapped/clicked</strong> on grid spot <strong>" + shouldHaveGrid + "</strong>)", html: true, type: "warning"});
                    curChar = 0;
                  }
                  else {
                    user.reduceAttempts();
                    if (user.getAttemptsRemaining() > 0) {
                      swal(
                        { title: "Oh no!",
                          text: "<p>It's okay, maybe with some practice you'll be a pro!</p><p> You've got <strong>"+user.getAttemptsRemaining()+" attempts remaining.</strong></p>",
                          html: true,
                          type: "error"
                        });
                      passModal.close({});
                    }
                    else {
                      swal(
                        { title: "Oh poop!",
                          text: "<p>Looks like you've run out of attempts! That's okay, try the next one!</p>",
                          html: true,
                          type: "error"
                        });
                      console.plog("[" + Date.now() + "]", user.name, "[Clean] Failed to login. Phase: " + user.currentPhase + " with " + user.getAttemptsRemaining() + " attempts remaining.", user);
                      Auth.incrementPhase();
                      passModal.close({});
                    }
                  }
                }
                console.plog("[" + Date.now() + "]", user.name, "FUNCTION: TRYGRID BOTTOM. ATTEMPTS REMAINING: " + user.getAttemptsRemaining() + ". PRACTICE? " + practice + ". i " + i + ". SINGLE? " + single, user, this);
              },

              // This is the human password. A much easier to remember form of the pass
              humanPassword: function() {
                var hrPass = "";
                for (var i = 0; i < this.password.length; i++) {
                  var char = this.password.charAt(i);
                  var grid = ["A", "B", "C", "D", "E", "F", "G", "H"];
                  var check = parseInt(char, 16);
                  var single = check%2==0;
                  var hrChar = grid[Math.floor(check / 2)];

                  hrPass += hrChar + (single? "" : hrChar)+ " ";
                }
                return hrPass;
              },

              buttons: [{
                classes: 'btn-confirm',
                text: 'Retry (Start Again)',
                click: function(e) {
                  curChar = 0;
                  fullPassShown = false;
                  console.plog("[" + Date.now() + "]", user.name, "FUNCTION: TAP RETRY BOTTOM.", user, this);
                }
              }]
            }
          }, colours[currentIndex]);
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
