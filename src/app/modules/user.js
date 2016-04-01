'use strict';

/**
 * user
 * ====
 * exports user class
 */

var bcrypt = require('bcrypt'),
    Q = require('q'),
    uuid = require('uuid'),
    uuidValidate = require('uuid-validate');

var couch = require('app/modules/couch');

var db = couch.database('users');

/**
 * User
 * should only be instanciated without params to create a new user.
 * params are used by static methods to create existing users from db objects.
 * @param {Object} user  data to restore a user
 */
function User(user) {
  user = typeof user === 'object' ? user : {};
  this.uuid = user.hasOwnProperty('uuid') ? user.uuid : User.generateUuid();
  this.username = user.hasOwnProperty('username') ? user.username : null;
  this.passwordHash = user.hasOwnProperty('passwordHash') ? user.passwordHash : null;
  this.flags = user.hasOwnProperty('flags') ? user.flags : [];
}

/**
 * returns string representation of a user
 * @return {String} username
 */
User.prototype.toString = function() {
  return this.name;
};

/**
 * set username
 * @param  {String}  username new username value
 * @return {Promise}          this
 */
User.prototype.setUsername = function(username) {
  return Q(username)
    .then(User.validateUsername)
    .then(function(username) {
      return User.usernameNotTaken(username, this.uuid);
    }.bind(this))
    .then(function(name) {
      this.username = name;
      return this;
    }.bind(this));
};

/**
 * set password hash from given password
 * @param  {String}  password new password value
 * @return {Promise}          this
 */
User.prototype.setPassword = function(password) {
  return Q(password)
    .then(User.validatePassword)
    .then(User.hashPassword)
    .then(function(passwordHash) {
      this.passwordHash = passwordHash;
      return this;
    }.bind(this));
};

/**
 * add a flag
 * @param  {String}  flag new flag to add
 * @return {Promise}      this
 */
User.prototype.addFlag = function(flag) {
  return Q(this)
    .then(User.q.verifyFlag(flag, true))
    .then(function(user) {
      if (User.validateFlag(flag)) user.flags.push(flag);
      return user;
    });
};

/**
 * remove a flag
 * @param  {String}  flag existing flag to remove
 * @return {Promise}      this
 */
User.prototype.removeFlag = function(flag) {
  return Q(this)
    .then(User.q.verifyFlag(flag))
    .then(function(user) {
      user.flags.splice(user.flags.indexOf(flag), 1);
      return user;
    });
};

/**
 * remove all flags
 * @return {Promise} this
 */
User.prototype.removeAllFlags = function() {
  return Q(this)
    .then(function(user) {
      user.flags = [];
      return user;
    });
};

/**
 * save user to database
 * @return {Promise} this
 */
User.prototype.save = function() {
  return Q.Promise(function(resolve, reject) {
    db.save(this.uuid, this, function(err, resp) {
      if (err) reject(err);
      else resolve(this);
    }.bind(this));
  }.bind(this));
};

/**
 * test if user has a flag
 * @param  {String}  flag flag to test
 * @return {Boolean}      result
 */
User.prototype.hasFlag = function(flag) {
  return this.flags.indexOf(flag) >= 0;
};

/**
 * verify that user has a flag (or not, if invert is true)
 * @param  {String}  flag   flag to test
 * @param  {Boolean} invert if true, verifies that user does NOT has a flag
 * @return {Promise}        this
 */
User.prototype.verifyFlag = function(flag, invert) {
  return Q.Promise(function(resolve, reject) {
    if (!this.hasFlag(flag) && !invert) reject(new Error('user is not flagged with \'' + flag + '\''));
    else if (invert) reject(new Error('user is flagged with \'' + flag + '\''));
    else resolve(this);
  }.bind(this));
};

/**
 * verify that given password's hash matches password hash
 * @param  {String}  password password to test
 * @return {Promise}          this
 */
User.prototype.verifyPassword = function(password) {
  return Q.Promise(function(resolve, reject) {
    bcrypt.compare(password, this.passwordHash, function(err, res) {
      if (err) reject(err);
      else if (!res) reject(new Error('wrong password'));
      else resolve(this);
    }.bind(this));
  }.bind(this));
};

/**
 * find matching user in database by given id
 * @param  {String}  id uuid to lookup
 * @return {Promise}    user instance
 */
User.getByUuid = function(id) {
  return Q(id)
    .then(User.validateId)
    .then(function(id) {
      return Q.Promise(function(resolve, reject) {
        db.get(id, function(err, resp) {
          if (err) {
            if (err.reason === 'missing') reject(new Error('unknown user uuid \'' + id + '\''));
            else reject(err);
          } else resolve(new User(resp.json));
        });
      });
    });
};

/**
 * find matching user in database by given username
 * @param  {String}  username username to lookup
 * @return {Promise}          user instance
 */
User.getByUsername = function(username) {
  return Q(username)
    .then(User.validateUsername)
    .then(function(username) {
      return Q.Promise(function(resolve, reject) {
        db.view('users/byUsername', {
          key: username,
          limit: 1
        }, function(err, resp) {
          if (err) reject(err);
          else if (resp.json.rows.length < 1) reject(new Error('unknown username \'' + username + '\''));
          else resolve(new User(resp.json.rows[0].value));
        });
      });
    });
};

/**
 * test if a username is NOT already taken by any user; optionally exclude a
 * specific user by uuid
 * @param  {String}  username  username to test
 * @param  {String}  excludeId uuid to exclude
 * @return {Promise}           username
 */
User.usernameNotTaken = function(username, excludeId) {
  return Q(username)
    .then(User.validateUsername)
    .then(function(username) {
      return Q.Promise(function(resolve, reject) {
        db.view('users/byUsername', {
          key: username,
          limit: 1
        }, function(err, resp) {
          if (err) reject(err);
          else if (resp.json.rows.length < 1 || excludeId && resp.json.rows[0].value.uuid === excludeId) resolve(username);
          else reject(new Error('username already taken'));
        });
      });
    });
};

/**
 * get all users from database; optionally define a view and options
 * @param  {String}  view        order by id, username or flag (default: id)
 * @param  {Object}  viewOptions view options
 * @return {Promise}             array of user instances
 */
User.getAll = function(view, viewOptions) {
  var views = {
    id: 'byId',
    username: 'byUsername',
    flag: 'byFlag'
  };
  viewOptions = viewOptions || {};
  view = 'users/' + (views.hasOwnProperty(view) ? views[view] : views.username);
  return Q.Promise(function(resolve, reject) {
    db.view(view, viewOptions, function(err, resp) {
      if (err) reject(err);
      else {
        resolve(resp.json.rows.map(function(row) {
          return new User(row.value);
        }));
      }
    });
  });
};

/**
 * verify that a user with given username has the given password
 * @param  {String}  username username to test
 * @param  {String}  password password to test
 * @return {Promise}          user instance
 */
User.verifyUsernamePassword = function(username, password) {
  return User.getByUsername(username)
    .then(User.q.verifyPassword(password));
};

/**
 * test if given username is a valid username
 * @param  {String}  username username to test
 * @return {Boolean}          result
 */
User.isValidUsername = function(username) {
  return typeof username === 'string' && (/^[a-z0-9_-]{1,32}$/i).test(username);
};

/**
 * validate given username by isValidUsername
 * @param  {String}  username username to validate
 * @return {Promise}          username
 */
User.validateUsername = function(username) {
  return Q.Promise(function(resolve, reject) {
    if (!User.isValidUsername(username)) reject(new Error('invalid username \'' + username + '\''));
    else resolve(username);
  });
};

/**
 * test it given password is a valid password
 * @param  {String}  password password to test
 * @return {Boolean}          result
 */
User.isValidPassword = function(password) {
  return typeof password === 'string' && password.length >= 10;
};

/**
 * validate given password by isValidPassword
 * @param  {String}  password password to validate
 * @return {Promise}          password
 */
User.validatePassword = function(password) {
  return Q.Promise(function(resolve, reject) {
    if (!User.isValidPassword(password)) reject(new Error('invalid password \'' + password + '\''));
    else resolve(password);
  });
};

/**
 * generate hash of a given password
 * @param  {String}  password password to hash
 * @return {Promise}          hash
 */
User.hashPassword = function(password) {
  return Q.Promise(function(resolve, reject) {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  });
};

/**
 * test if given id is a valid uuid
 * @param  {String}  id id to test
 * @return {Boolean}    result
 */
User.isValidUuid = function(id) {
  return uuidValidate(id, 4);
};

/**
 * validate given id by isValidUuid
 * @param  {String}  id id to validate
 * @return {Promise}    id
 */
User.validateUuid = function(id) {
  return Q.Promise(function(resolve, reject) {
    if (!User.isValidUuid(id)) reject(new Error('invalid uuid \'' + id + '\''));
    else resolve(id);
  });
};

/**
 * generate a uuid
 * @return {String} uuid
 */
User.generateUuid = function() {
  return uuid.v4();
};

/**
 * test if given flag is a valid flag
 * @param  {String}  flag flag to test
 * @return {Boolean}      result
 */
User.isValidFlag = function(flag) {
  return (/^[a-z0-9_-]+$/).test(flag);
};

/**
 * validate given flag by isValidFlag
 * @param  {String}  flag flag to validate
 * @return {Promise}      flag
 */
User.validateFlag = function(flag) {
  return Q.Promise(function(resolve, reject) {
    if (!User.isValidFlag(flag)) reject(new Error('invalid flag \'' + flag + '\''));
    else resolve(flag);
  });
};

/**
 * create promise fullfilment handlers for class methods for easier chaining
 * @type {Object}
 */
User.q = [
  'setUsername',
  'setPassword',
  'addFlag',
  'removeFlag',
  'removeAllFlags',
  'save',
  'verifyFlag',
  'verifyPassword'
].reduce(function(methods, method) {
  methods[method] = function() {
    var args = Array.prototype.slice.call(arguments);
    return function(obj) {
      return obj[method].apply(obj, args);
    };
  };
  return methods;
}, {});

/**
 * export User class
 * @type {Function}
 */
module.exports = User;
