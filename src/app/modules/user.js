'use strict';

/**
 * user
 * ====
 * exports user class
 */

const bcrypt = require('bcrypt'),
      q = require('q'),
      uuid = require('uuid'),
      validator = require('validator');

const couch = require('app/modules/couch');

const db = couch.database('users');

class User {

  /**
   * User constructor
   * should only be instanciated without params to create a new user.
   * params are used by static methods to create existing users from db objects.
   * @param {Object} user  data to restore a user
   */
  constructor(user) {
    user = typeof user === 'object' ? user : {};
    this.uuid = user.hasOwnProperty('uuid') ? user.uuid : User.generateUuid();
    this.username = user.hasOwnProperty('username') ? user.username : null;
    this.email = user.hasOwnProperty('email') ? user.email : null;
    this.passwordHash = user.hasOwnProperty('passwordHash') ? user.passwordHash : null;
    this.flags = user.hasOwnProperty('flags') ? user.flags : [];
  }

  /**
   * returns string representation of a user
   * @return {String} username
   */
  toString() {
    return this.name;
  }

  /**
   * set username
   * @param  {String}  username new username value
   * @return {Promise}          this
   */
  setUsername(username) {
    return q(username)
      .then(User.validateUsername)
      .then((username) => User.usernameNotTaken(username, this.uuid))
      .then((name) => {
        this.username = name;
        return this;
      });
  }

  /**
   * set email address
   * @param  {String}  email new email value
   * @return {Promise}       this
   */
  setEmail(email) {
    return q(email)
      .then(User.validateEmail)
      .then((email) => User.emailNotTaken(email, this.uuid))
      .then((email) => {
        this.email = email;
        return this;
      });
  }

  /**
   * set password hash from given password
   * @param  {String}  password new password value
   * @return {Promise}          this
   */
  setPassword(password) {
    return q(password)
      .then(User.validatePassword)
      .then(User.hashPassword)
      .then((passwordHash) => {
        this.passwordHash = passwordHash;
        return this;
      });
  }

  /**
   * add a flag
   * @param  {String}  flag new flag to add
   * @return {Promise}      this
   */
  addFlag(flag) {
    return q(this)
      .then(User.q.verifyFlag(flag, true))
      .then((user) => {
        if (User.validateFlag(flag)) user.flags.push(flag);
        return user;
      });
  }

  /**
   * remove a flag
   * @param  {String}  flag existing flag to remove
   * @return {Promise}      this
   */
  removeFlag(flag) {
    return q(this)
      .then(User.q.verifyFlag(flag))
      .then((user) => {
        user.flags.splice(user.flags.indexOf(flag), 1);
        return user;
      });
  }

  /**
   * remove all flags
   * @return {Promise} this
   */
  removeAllFlags() {
    return q(this)
      .then((user) => {
        user.flags = [];
        return user;
      });
  }

  /**
   * save user to database
   * @return {Promise} this
   */
  save() {
    return q.Promise((resolve, reject) => {
      db.save(this.uuid, this, (err) => {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  /**
   * test if user has a flag
   * @param  {String}  flag flag to test
   * @return {Boolean}      result
   */
  hasFlag(flag) {
    return this.flags.indexOf(flag) >= 0;
  }

  /**
   * verify that user has a flag (or not, if invert is true)
   * @param  {String}  flag   flag to test
   * @param  {Boolean} invert if true, verifies that user does NOT has a flag
   * @return {Promise}        this
   */
  verifyFlag(flag, invert) {
    return q.Promise((resolve, reject) => {
      if (!this.hasFlag(flag) && !invert) reject(new Error(`user is not flagged with '${flag}'`));
      else if (invert) reject(new Error(`user is flagged with '${flag}'`));
      else resolve(this);
    });
  }

  /**
   * verify that given password's hash matches password hash
   * @param  {String}  password password to test
   * @return {Promise}          this
   */
  verifyPassword(password) {
    return q.Promise((resolve, reject) => {
      bcrypt.compare(password, this.passwordHash, (err, res) => {
        if (err) reject(err);
        else if (!res) reject(new Error('wrong password'));
        else resolve(this);
      });
    });
  }

  /**
   * find matching user in database by given id
   * @param  {String}  id uuid to lookup
   * @return {Promise}    user instance
   */
  static getByUuid(id) {
    return q(id)
      .then(User.validateId)
      .then((id) => {
        return q.Promise((resolve, reject) => {
          db.get(id, (err, resp) => {
            if (err) {
              if (err.reason === 'missing') reject(new Error(`unknown user uuid '${id}'`));
              else reject(err);
            } else resolve(new User(resp.json));
          });
        });
      });
  }

  /**
   * find matching user in database by given username
   * @param  {String}  username username to lookup
   * @return {Promise}          user instance
   */
  static getByUsername(username) {
    return q(username)
      .then(User.validateUsername)
      .then((username) => {
        return q.Promise((resolve, reject) => {
          db.view('users/byUsername', {
            key: username,
            limit: 1
          }, (err, resp) => {
            if (err) reject(err);
            else if (resp.json.rows.length < 1) reject(new Error(`unknown username '${username}'`));
            else resolve(new User(resp.json.rows[0].value));
          });
        });
      });
  }

  /**
   * test if a username is NOT already taken by any user; optionally exclude a
   * specific user by uuid
   * @param  {String}  username  username to test
   * @param  {String}  excludeId uuid to exclude
   * @return {Promise}           username
   */
  static usernameNotTaken(username, excludeId) {
    return q(username)
      .then(User.validateUsername)
      .then((username) => {
        return q.Promise((resolve, reject) => {
          db.view('users/byUsername', {
            key: username,
            limit: 1
          }, (err, resp) => {
            if (err) reject(err);
            else if (resp.json.rows.length < 1 || excludeId && resp.json.rows[0].value.uuid === excludeId) resolve(username);
            else reject(new Error('username already taken'));
          });
        });
      });
  }

  /**
   * find matching user in database by given email
   * @param  {String}  email email to lookup
   * @return {Promise}       user instance
   */
  static getByEmail(email) {
    return q(email)
      .then(User.validateEmail)
      .then((email) => {
        return q.Promise((resolve, reject) => {
          db.view('users/byEmail', {
            key: email,
            limit: 1
          }, (err, resp) => {
            if (err) reject(err);
            else if (resp.json.rows.length < 1) reject(new Error(`unknown email '${email}'`));
            else resolve(new User(resp.json.rows[0].value));
          });
        });
      });
  }

  /**
   * test if a email is NOT already taken by any user; optionally exclude a
   * specific user by uuid
   * @param  {String}  email     email to test
   * @param  {String}  excludeId uuid to exclude
   * @return {Promise}           email
   */
  static emailNotTaken(email, excludeId) {
    return q(email)
      .then(User.validateEmail)
      .then((email) => {
        return q.Promise((resolve, reject) => {
          db.view('users/byEmail', {
            key: email,
            limit: 1
          }, (err, resp) => {
            if (err) reject(err);
            else if (resp.json.rows.length < 1 || excludeId && resp.json.rows[0].value.uuid === excludeId) resolve(email);
            else reject(new Error('email already taken'));
          });
        });
      });
  }

  /**
   * get all users from database; optionally define a view and options
   * @param  {String}  view        order by id, username or flag (default: id)
   * @param  {Object}  viewOptions view options
   * @return {Promise}             array of user instances
   */
  static getAll(view, viewOptions) {
    const views = {
      id: 'byId',
      username: 'byUsername',
      flag: 'byFlag'
    };
    viewOptions = viewOptions || {};
    view = `users/${ views.hasOwnProperty(view) ? views[view] : views.username }`;
    return q.Promise((resolve, reject) => {
      db.view(view, viewOptions, (err, resp) => {
        if (err) reject(err);
        else resolve(resp.json.rows.map((row) => new User(row.value)));
      });
    });
  }

  /**
   * verify that a user with given username has the given password
   * @param  {String}  username username to test
   * @param  {String}  password password to test
   * @return {Promise}          user instance
   */
  static verifyUsernamePassword(username, password) {
    return User.getByUsername(username)
      .then(User.q.verifyPassword(password));
  }

  /**
   * test if given username is a valid username
   * @param  {String}  username username to test
   * @return {Boolean}          result
   */
  static isValidUsername(username) {
    return typeof username === 'string' && (/^[a-z0-9_-]{1,32}$/i).test(username);
  }

  /**
   * validate given username by isValidUsername
   * @param  {String}  username username to validate
   * @return {Promise}          username
   */
  static validateUsername(username) {
    return q.Promise((resolve, reject) => {
      if (!User.isValidUsername(username)) reject(new Error(`invalid username '${username}'`));
      else resolve(username);
    });
  }

  /**
   * test if given email is a valid email address
   * @param  {String}  email email to test
   * @return {Boolean}       result
   */
  static isValidEmail(email) {
    return validator.isEmail(email);
  }

  /**
   * validate given email by isValidEmail
   * @param  {String}  email email to validate
   * @return {Promise}       email
   */
  static validateEmail(email) {
    return q.Promise((resolve, reject) => {
      if (!User.isValidEmail(email)) reject(new Error(`invalid email '${email}'`));
      else resolve(email);
    });
  }

  /**
   * test it given password is a valid password
   * @param  {String}  password password to test
   * @return {Boolean}          result
   */
  static isValidPassword(password) {
    return typeof password === 'string' && password.length >= 10;
  }

  /**
   * validate given password by isValidPassword
   * @param  {String}  password password to validate
   * @return {Promise}          password
   */
  static validatePassword(password) {
    return q.Promise((resolve, reject) => {
      if (!User.isValidPassword(password)) reject(new Error(`invalid password '${password}'`));
      else resolve(password);
    });
  }

  /**
   * generate hash of a given password
   * @param  {String}  password password to hash
   * @return {Promise}          hash
   */
  static hashPassword(password) {
    return q.Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });
  }

  /**
   * test if given id is a valid uuid
   * @param  {String}  id id to test
   * @return {Boolean}    result
   */
  static isValidUuid(id) {
    return validator.isUUID(id, 4);
  }

  /**
   * validate given id by isValidUuid
   * @param  {String}  id id to validate
   * @return {Promise}    id
   */
  static validateUuid(id) {
    return q.Promise((resolve, reject) => {
      if (!User.isValidUuid(id)) reject(new Error(`invalid uuid '${id}'`));
      else resolve(id);
    });
  }

  /**
   * generate a uuid
   * @return {String} uuid
   */
  static generateUuid() {
    return uuid.v4();
  }

  /**
   * test if given flag is a valid flag
   * @param  {String}  flag flag to test
   * @return {Boolean}      result
   */
  static isValidFlag(flag) {
    return (/^[a-z0-9_-]+$/).test(flag);
  }

  /**
   * validate given flag by isValidFlag
   * @param  {String}  flag flag to validate
   * @return {Promise}      flag
   */
  static validateFlag(flag) {
    return q.Promise((resolve, reject) => {
      if (!User.isValidFlag(flag)) reject(new Error(`invalid flag '${flag}'`));
      else resolve(flag);
    });
  }

}

/**
 * create promise fullfilment handlers for class methods for easier chaining
 * @type {Object}
 */
User.q = [
  'setUsername',
  'setEmail',
  'setPassword',
  'addFlag',
  'removeFlag',
  'removeAllFlags',
  'save',
  'verifyFlag',
  'verifyPassword'
].reduce((methods, method) => {
  methods[method] = function() {
    const args = Array.prototype.slice.call(arguments);
    return (obj) => obj[method].apply(obj, args);
  };
  return methods;
}, {});

/**
 * export User class
 * @type {Function}
 */
module.exports = User;
