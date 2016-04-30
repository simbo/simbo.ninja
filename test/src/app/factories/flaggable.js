'use strict';

const assert = require('assert');

const testSubject = 'app/factories/flaggable';

const flaggableFactory = require(testSubject);

describe(testSubject, () => {

  it('should return an object with empty flags collection', () => {
    const obj = flaggableFactory();
    assert.deepEqual(obj.flags, []);
  });

  describe('addFlag', () => {
    it('should add a flag and return promised object', (done) => {
      const obj = flaggableFactory();
      obj.addFlag('foo')
        .then((obj) => {
          assert.deepEqual(obj.flags, ['foo']);
          done();
        }, done);
    });
  });

  describe('removeFlag', () => {
    it('should remove a flag and return promised object', (done) => {
      const obj = flaggableFactory();
      obj.addFlag('foo')
        .then((obj) => {
          assert.deepEqual(obj.flags, ['foo']);
          return obj;
        })
        .then((obj) => obj.removeFlag('foo'))
        .then((obj) => {
          assert.deepEqual(obj.flags, []);
          done();
        }, done);
    });
  });

  describe('hasFlag', () => {
    it('should test if a flag is in collection and return a boolean result', (done) => {
      const obj = flaggableFactory();
      assert.equal(obj.hasFlag('foo'), false);
      obj.addFlag('foo')
        .then((obj) => {
          assert.equal(obj.hasFlag('foo'), true);
          done();
        }, done);
    });
  });

  describe('verifyFlag', () => {
    it('should test if a flag is in collection and return promised object', (done) => {
      const obj = flaggableFactory();
      obj.addFlag('foo')
        .then((obj) => obj.verifyFlag('foo'))
        .then((obj) => {
          assert.deepEqual(obj.flags, ['foo']);
          return obj;
        })
        .then((obj) => obj.verifyFlag('bar'))
        .then((obj) => {
          done();
        }, (err) => {
          assert.equal(err.message, 'flag not present');
          done();
        });
    });
  });

});
