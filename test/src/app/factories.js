'use strict';

const assert = require('assert'),
      path = require('path');

const allFactories = [
  'db-object',
  'flaggable',
  'repository',
  'user'
].reduce((factories, factoryName) => {
  const mod = require(path.join('app/factories', factoryName));
  factories[factoryName] = (obj) => {
    const args = [];
    for (let i = 0; i < mod.length - 1; i++) args.push(null);
    if (obj) args.push(obj);
    return mod.apply(null, args);
  };
  return factories;
}, {});

describe('app/factories/*', () => {

  Object.keys(allFactories).forEach((factoryName) => {
    const objFactory = allFactories[factoryName];

    it(`'${factoryName}' should return a plain object with properties`, () => {
      const obj = objFactory();
      assert.equal(typeof obj, 'object');
      assert.equal(Object.keys(obj).length > 0, true);
    });

    it(`'${factoryName}' should transform a given object in place and return it`, () => {
      const obj = {
        myCustomFoo: 'bar'
      };
      const obj2 = objFactory(obj);
      obj2.myCustomFoo = 'baz';
      assert.equal(obj.myCustomFoo, 'baz');
      assert.deepEqual(obj2, obj);
    });

  });

});
