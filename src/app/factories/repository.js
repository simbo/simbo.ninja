'use strict';

const q = require('q'),
      uuid = require('uuid');

const couch = require('app/modules/database').couch,
      validator = require('app/modules/validator');

function repositoryFactory(dbName, repo) {

  const db = couch.database(dbName);

  repo = typeof repo === 'object' ? repo : {};

  Object.assign(repo, {

    save(obj) {
      return q.Promise((resolve, reject) => {
        if (!obj.hasOwnProperty('uuid')) obj.uuid = uuid.v4();
        db.save(obj.uuid, obj.toJSON(), (err) => {
          if (err) reject(err);
          else resolve(obj);
        });
      });
    },

    get(str) {
      return q(str)
        .then(validator.validate('uuid'))
        .then((id) => q.Promise((resolve, reject) => {
          db.get(id, (err, resp) => {
            if (err) {
              if (err.reason === 'missing') reject(new Error('unknown id'));
              else reject(err);
            } else {
              // delete resp.json._id;
              // delete resp.json._rev;
              resolve(resp.json);
            }
          });
        }));
    },

    view(viewName, viewOptions) {
      return q.Promise((resolve, reject) => db.view(`${db.name}/${viewName}`, viewOptions || {}, (err, resp) => {
        if (err) reject(err);
        else {
          resolve(resp.json.rows.reduce((rows, row) => {
            // delete row.value._id;
            // delete row.value._rev;
            return rows.concat([row.value]);
          }, []));
        }
      }));
    },

    one(viewName, key) {
      return q.Promise((resolve, reject) => repo.view(viewName, {key, limit: 1})
        .then((results) => {
          if (results.length === 0) reject(new Error('unknown key'));
          else resolve(results[0]);
        }, reject));
    },

    keyNotTaken(viewName, key, excludeId) {
      return q.Promise((resolve, reject) => {
        repo.one(viewName, key)
          .then((obj) => {
            if (excludeId && obj.uuid === obj) resolve(key);
            else reject(new Error('key taken'));
          }, (err) => {
            if (err.message === 'unknown key') resolve(key);
            else reject(err);
          });
      });
    }

  });

  return repo;

}

module.exports = repositoryFactory;
