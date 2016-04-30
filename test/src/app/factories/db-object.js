'use strict';

const assert = require('assert');

const validator = require('validator');

const testSubject = 'app/factories/db-object';

const dbObjectFactory = require(testSubject);

describe(testSubject, () => {

  it('should set a uuid as property _id or keep existing', () => {
    let obj = dbObjectFactory();
    assert.equal(validator.isUUID(obj._id), true);
    obj = dbObjectFactory({_id: 1});
    assert.equal(obj._id, 1);
  });

  it('should return no function or meta properties when transforming to JSON', () => {
    const obj = dbObjectFactory({
      _id: 123,
      _rev: 456,
      foo: 'bar',
      baz: () => {}
    });
    assert.deepEqual(obj.toJSON(), {foo: 'bar'});
  });

  it('should convert to JSON string representation when transformed to string', () => {
    const obj = dbObjectFactory({foo: 'bar'});
    assert.equal(String(obj), JSON.stringify(obj));
  });

});
