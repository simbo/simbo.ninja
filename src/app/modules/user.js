'use strict';

var bcrypt = require('bcrypt'),
    Q = require('q'),
    uuid = require('uuid'),
    uuidValidate = require('uuid-validate');

var couch = require('app/modules/couch');

var db = couch.database('users');

function User(user) {
  user = user || {};
  this.uuid = user.hasOwnProperty('uuid') ? user.uuid : User.generateUuid();
  this.username = user.hasOwnProperty('username') ? user.username : null;
  this.passwordHash = user.hasOwnProperty('passwordHash') ? user.passwordHash : null;
}

User.prototype.toString = function() {
  return this.name;
};

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

User.prototype.setPassword = function(password) {
  return Q(password)
    .then(User.validatePassword)
    .then(User.hashPassword)
    .then(function(passwordHash) {
      this.passwordHash = passwordHash;
      return this;
    }.bind(this));
};

User.prototype.save = function() {
  return Q.Promise(function(resolve, reject) {
    db.save(this.uuid, this, function(err, resp) {
      if (err) reject(err);
      else resolve(this);
    }.bind(this));
  }.bind(this));
};

User.prototype.verifyPassword = function(password) {
  return Q.Promise(function(resolve, reject) {
    bcrypt.compare(password, this.passwordHash, function(err, res) {
      if (err) reject(err);
      else if (!res) reject(new Error('wrong password'));
      else resolve(this);
    }.bind(this));
  }.bind(this));
};

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

User.verifyUsernamePassword = function(username, password) {
  return User.getByUsername(username)
    .then(User.q.verifyPassword(password));
};

User.isValidUsername = function(username) {
  return typeof username === 'string' && (/^[a-z0-9_-]{1,32}$/i).test(username);
};

User.validateUsername = function(username) {
  if (!User.isValidUsername(username)) throw new Error('invalid username \'' + username + '\'');
  return username;
};

User.isValidPassword = function(password) {
  return typeof password === 'string' && password.length >= 10;
};

User.validatePassword = function(password) {
  if (!User.isValidPassword(password)) throw new Error('invalid password \'' + password + '\'');
  return password;
};

User.hashPassword = function(password) {
  return Q.Promise(function(resolve, reject) {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  });
};

User.isValidUuid = function(id) {
  return uuidValidate(id, 4);
};

User.validateUuid = function(id) {
  if (!User.isValidUuid(id)) throw new Error('invalid uuid \'' + id + '\'');
  return id;
};

User.generateUuid = function() {
  return uuid.v4();
};

User.q = [
  'setUsername',
  'setPassword',
  'save',
  'verifyPassword'
].reduce(function(methods, method) {
  methods[method] = function() {
    var args = Array.prototype.slice.call(arguments);
    return function(user) {
      return user[method].apply(user, args);
    };
  };
  return methods;
}, {});

module.exports = User;
