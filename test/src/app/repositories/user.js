'use strict';

const assert = require('assert');

const testSubject = 'app/repositories/user';

const userRepo = require(testSubject);

describe(testSubject, () => {

  it('should return the user repository', () => {
    assert(typeof userRepo, 'object');
  });

});
