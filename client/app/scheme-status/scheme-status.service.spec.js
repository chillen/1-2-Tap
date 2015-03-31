'use strict';

describe('Service: schemeStatus', function () {

  // load the service's module
  beforeEach(module('12TapApp'));

  // instantiate service
  var schemeStatus;
  beforeEach(inject(function (_schemeStatus_) {
    schemeStatus = _schemeStatus_;
  }));

  it('should do something', function () {
    expect(!!schemeStatus).toBe(true);
  });

});
