'use strict';

var bcrypt = require('bcrypt'),
    Q = require('q'),
    uuid = require('uuid'),
    uuidValidate = require('uuid-validate');

var couch = require('app/modules/couch');

var db = couch.database('users');

function User(options) {

  var self = this,
      user;

  options = typeof options === 'string' ? {username: options} : options;

  user = {
    uuid: options.uuid || null,
    username: options.username || null,
    passwordHash: options.passwordHash || null
  };

  self.getId = function() {
    return user.uuid;
  };

  self.getUsername = function() {
    return user.username;
  };

  self.setUsername = function(username) {
    return Q.Promise(function(resolve, reject) {
      if (User.isValidUsername(username)) reject(new Error('invalid username'));
      else resolve(username);
    })
      .then(function(name) {
        user.username = name;
        return self;
      });
  };

  self.getPasswordHash = function() {
    return user.passwordHash;
  };

  self.setPassword = function(password) {
    return Q.Promise(function(resolve, reject) {
      if (!User.isValidPassword(password)) reject(new Error('invalid password'));
      else resolve(password);
    })
      .then(User.hashPassword)
      .then(function(passwordHash) {
        user.passwordHash = passwordHash;
        return self;
      });
  };

  self.toPlainObject = function() {
    return user;
  };

  self.toJSON = self.toPlainObject;

  self.toString = function() {
    return user.username;
  };

  self.save = function() {
    return Q.Promise(function(resolve, reject) {
      if (!User.isValidUsername(user.username)) reject(new Error('invalid username'));
      else {
        db.save(user.uuid, user, function(err, resp) {
          if (err) reject(err);
          else resolve(self);
        });
      }
    });
  };

  self.comparePassword = function(password) {
    return Q.Promise(function(resolve, reject) {
      bcrypt.compare(password, user.passwordHash, function(err, res) {
        if (err) reject(err);
        else if (!res) reject(new Error('wrong password'));
        else resolve(self);
      });
    });
  };

  if (!User.isValidId(user.uuid)) user.uuid = User.generateId();

}

User.getById = function(id) {
  return Q.Promise(function(resolve, reject) {
    if (!User.isValidId(id)) reject(new Error('invalid user id'));
    else {
      db.get(id, function(err, resp) {
        if (err) reject(new Error('unknown user id'));
        else resolve(new User(resp.json));
      });
    }
  });
};

User.getByUsername = function(username) {
  return Q.Promise(function(resolve, reject) {
    if (!User.isValidUsername(username)) reject(new Error('invalid username'));
    else {
      db.view('users/byUsername', {
        key: username,
        limit: 1
      }, function(err, resp) {
        if (err || resp.json.rows.length < 1) reject(new Error('unknown username'));
        else resolve(new User(resp.json.rows[0].value));
      });
    }
  });
};

User.validate = function(username, password) {
  return User.getByUsername(username)
    .then(function(user) {
      return user.comparePassword(password);
    });
};

User.hashPassword = function(password) {
  return Q.Promise(function(resolve, reject) {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  });
};

User.isValidUsername = function(username) {
  return typeof username === 'string' && (/^[a-z0-9_-]{1,32}$/i).test(username);
};

User.isValidPassword = function(password) {
  return typeof password === 'string' && password.length >= 10;
};

User.generateId = function() {
  return uuid.v4();
};

User.isValidId = function(id) {
  return uuidValidate(id, 4);
};

module.exports = User;
