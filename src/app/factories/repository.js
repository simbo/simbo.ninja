'use strict';

const async = require('async'),
      q = require('q');

const couch = require('app/modules/database').couch;

module.exports = repositoryFactory;

function repositoryFactory(dbName, repo) {

  const db = couch.database(dbName);

  repo = typeof repo === 'object' ? repo : {};

  Object.assign(repo, {

    save(obj) {
      return q.Promise((resolve, reject) => {
        getObjectArguments(obj)
          .then((args) => {
            db.save.apply(db, args.concat([obj.toJSON(), (err, response) => {
              if (err) reject(err);
              else {
                obj._rev = response.rev;
                resolve(obj);
              }
            }]));
          }, reject);
      });
    },

    remove(obj) {
      return q.Promise((resolve, reject) => {
        getObjectArguments(obj)
          .then((args) => {
            db.remove.apply(db, args.concat([(err, response) => {
              if (err) reject(err);
              else resolve(response);
            }]));
          }, reject);
      });
    },

    clear() {
      return repo.view('byId')
        .then((results) => q.Promise((resolve, reject) => {
          async.each(results, (obj, cb) => {
            repo.remove(obj).nodeify(cb);
          }, (err) => {
            if (err) reject(err);
            else resolve(true);
          });
        }));
    },

    get(id) {
      return q.Promise((resolve, reject) => {
        db.get(id, (err, response) => {
          if (err) {
            if (err.reason === 'missing') reject(new Error('unknown id'));
            else reject(err);
          } else resolve(response.json);
        });
      });
    },

    view(viewName, viewOptions) {
      return q.Promise((resolve, reject) => {
        db.view(`${db.name}/${viewName}`, viewOptions || {}, (err, response) => {
          if (err) reject(err);
          else resolve(response.json.rows.reduce((rows, row) => rows.concat([row.value]), []));
        });
      });
    },

    one(viewName, key) {
      return repo.view(viewName, {key, limit: 1})
        .then((results) => q.Promise((resolve, reject) => {
          if (results.length === 0) reject(new Error('unknown key'));
          else resolve(results[0]);
        }));
    },

    keyNotTaken(viewName, key, excludeId) {
      return q.Promise((resolve, reject) => {
        repo.one(viewName, key)
          .then((obj) => {
            if (excludeId && obj._id === excludeId) resolve(key);
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

function getObjectArguments(obj) {
  return q.Promise((resolve, reject) => {
    if (!obj.hasOwnProperty('_id')) reject(new Error('id undefined'));
    const args = [obj._id];
    if (obj.hasOwnProperty('_rev')) args.push(obj._rev);
    resolve(args);
  });
}
