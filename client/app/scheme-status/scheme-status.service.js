'use strict';

angular.module('12TapApp')
  .service('schemeStatus', function (Auth) {

    var currentPhase = function() { return Auth.getCurrentUser().currentPhase; };
    var incPhase = function() { Auth.incrementPhase(); };

    return {
      incrementPhase: function() { return incPhase(); },
      currPhase: function(isit) { return currentPhase() == isit; }
    }
  });
