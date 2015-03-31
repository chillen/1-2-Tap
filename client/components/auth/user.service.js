'use strict';

angular.module('12TapApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      incrementPhase: {
        method: 'PUT',
        params: {
          controller:'incphase'
        }
      }
	  });
  });
