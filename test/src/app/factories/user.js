'use strict';

const assert = require('assert');

const bcrypt = require('bcrypt');

const testSubject = 'app/factories/user';

const qAssert = require('../../../modules/q-assert');

const userFactory = require(testSubject);

describe(testSubject, () => {

  describe('toString', () => {

    it('should return the username', () => {
      assert.equal(userFactory({username: 'foo'}).toString(), 'foo');
    });

  });

  describe('setUsername', () => {

    it('should set the username and return the promised object', (done) => {
      userFactory().setUsername('foo')
        .then((obj) => {
          assert.equal(obj.username, 'foo');
        })
        .nodeify(done);
    });

  });

  describe('setEmail', () => {

    it('should set the email address and return the promised object', (done) => {
      userFactory().setEmail('foo@bar.com')
        .then((obj) => {
          assert.equal(obj.email, 'foo@bar.com');
        })
        .nodeify(done);
    });

  });

  describe('setPassword', () => {

    it('should set the password hash and return the promised object', (done) => {
      userFactory().setPassword('foo')
        .then((obj) => {
          bcrypt.compare('foo', obj.passwordHash, (err, res) => {
            if (err) done(err);
            assert.equal(res, true);
            done();
          });
        }, done);
    });

  });

  describe('verifyPassword', () => {

    it('should compare given string with password hash and return promised object', (done) => {
      userFactory().setPassword('foo')
        .then((obj) => obj.verifyPassword('foo'))
        .then((obj) => qAssert(() => {
          assert.deepEqual(Object.keys(obj.toJSON()), ['flags', 'passwordHash']);
        }))
        .nodeify(done);
    });

    it('should error if given password if not valid', (done) => {
      userFactory().setPassword('foo')
        .then((obj) => obj.verifyPassword('bar'))
        .then((obj) => obj, (err) => qAssert(() => {
          assert.equal(err.message, 'wrong password');
        }))
        .nodeify(done);
    });

  });


});
