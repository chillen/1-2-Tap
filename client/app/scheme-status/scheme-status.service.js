'use strict';

angular.module('12TapApp')
  .service('schemeStatus', function (Auth) {

    var control = function() { return Auth.getCurrentUser().control; };
    var phase1 = function() { return Auth.getCurrentUser().phase1; };


    return {
      gimmeBloop: function() { return phase1(); }
    }
  });
