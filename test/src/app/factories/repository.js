'use strict';

const assert = require('assert');

const objFactory = require('app/factories/db-object');

const testSubject = 'app/factories/repository';

const testDb = require('../../../modules/test-db'),
      qAssert = require('../../../modules/q-assert');

const repoFactory = require(testSubject);

describe(testSubject, () => {

  const repo = repoFactory('test');

  before((done) => {
    testDb.setup(done);
  });

  after((done) => {
    testDb.destroy(done);
  });

  describe('save', () => {

    it('should throw an error if object has no property _id', (done) => {
      repo.save({foo: 'bar'})
        .then((obj) => obj, (err) => qAssert(() => {
          assert.equal(err.message, 'id undefined');
        }))
        .nodeify(done);
    });

    it('should save an object to the database and return promised and populated object', (done) => {
      repo.save(objFactory({foo: 'bar', _id: 'foo'}))
        .then((obj) => qAssert(() => {
          assert.deepEqual(Object.keys(obj), ['foo', '_id', 'toString', 'toJSON', '_rev']);
        }))
        .nodeify(done);
    });

    it('should pass-through db errors', (done) => {
      repo.save(objFactory({foo: 'bar', _id: 'foo', _rev: 'foo'}))
        .then((obj) => obj, (err) => qAssert(() => {
          assert.equal(err.message, 'bad_request: Invalid rev format');
        }))
        .nodeify(done);
    });

  });

  describe('get', () => {

    it('should return a single object from the db', (done) => {
      repo.get('foo')
        .then((obj) => qAssert(() => {
          assert.deepEqual(Object.keys(obj), ['foo', '_id', '_rev']);
        }))
        .nodeify(done);
    });

    it('should error if object id was not found', (done) => {
      repo.get('bar')
        .then((obj) => obj, (err) => qAssert(() => {
          assert.equal(err.message, 'unknown id');
        }))
        .nodeify(done);
    });

  });

  describe('view', () => {

    it('should return an array of objects from a db view', (done) => {
      repo.view('byId')
        .then((results) => qAssert(() => {
          assert.equal(Array.isArray(results), true);
          assert.equal(results.length === 1, true);
        }))
        .nodeify(done);
    });

    it('should return an empty array view returns no objects', (done) => {
      repo.get('foo')
        .then((obj) => repo.remove(obj))
        .then((obj) => repo.view('byId'))
        .then((results) => qAssert(() => {
          assert.equal(Array.isArray(results), true);
          assert.equal(results.length === 0, true);
        }))
        .nodeify(done);
    });

    it('should pass-through db errors', (done) => {
      repo.view('byFoo')
        .then((obj) => obj, (err) => qAssert(() => {
          assert.equal(err.message, 'not_found: missing_named_view');
        }))
        .nodeify(done);
    });

  });

  describe('one', () => {

    it('should return a single object from a db view', (done) => {
      repo.save(objFactory({foo: 'bar', _id: 'foo'}))
        .then((obj) => repo.one('byId', 'foo'))
        .then((obj) => qAssert(() => {
          assert.deepEqual(Object.keys(obj), ['_id', '_rev', 'foo']);
        }))
        .nodeify(done);
    });

    it('should error if object key was not found', (done) => {
      repo.one('byId', 'bar')
        .then((obj) => obj, (err) => qAssert(() => {
          assert.equal(err.message, 'unknown key');
        }))
        .nodeify(done);
    });

  });

  describe('keyNotTaken', () => {

    it('should test if a key is already present in the view and return the promised key', (done) => {
      repo.keyNotTaken('byId', 'bar')
        .then((obj) => qAssert(() => {
          assert.equal(obj, 'bar');
        }))
        .nodeify(done);
    });

    it('should error if key is present', (done) => {
      repo.keyNotTaken('byId', 'foo')
        .then((obj) => obj, (err) => qAssert(() => {
          assert.equal(err.message, 'key taken');
        }))
        .nodeify(done);
    });

    it('should accept and excludeId to exclude an object from test', (done) => {
      repo.keyNotTaken('byId', 'foo', 'foo')
        .then((obj) => qAssert(() => {
          assert.equal(obj, 'foo');
        }))
        .nodeify(done);
    });

    it('should pass-through db errors', (done) => {
      repo.keyNotTaken('byFoo', 'foo')
        .then((obj) => obj, (err) => qAssert(() => {
          assert.equal(err.message, 'not_found: missing_named_view');
        }))
        .nodeify(done);
    });

  });

  describe('remove', () => {

    it('should remove an object from the database', (done) => {
      repo.get('foo')
        .then((obj) => repo.remove(obj))
        .nodeify(done);
    });

    it('should pass-through db errors', (done) => {
      repo.remove({_id: 'bar'})
        .then((obj) => obj, (err) => qAssert(() => {
          assert.equal(err.message, 'not_found: missing');
        }))
        .nodeify(done);
    });

  });

  describe('clear', () => {

    it('should remove all objects from the database', (done) => {
      repo.save(objFactory({a: 1}))
        .then(() => repo.save(objFactory({a: 2})))
        .then(() => repo.view('byId'))
        .then((results) => qAssert(() => {
          assert.equal(results.length, 2);
        }))
        .then(() => repo.clear())
        .then(() => repo.view('byId'))
        .then((results) => qAssert(() => {
          assert.equal(results.length, 0);
        }))
        .nodeify(done);
    });

  });

});
