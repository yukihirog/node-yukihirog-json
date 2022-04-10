/**
 * @requires fs
 * @see {@link https://nodejs.org/api/fs.html}
 */
const fs = require('fs');

/**
 * Get options for fs.readFile/writeFile.
 * Default, encoding is set to 'utf8'.
 * @param {string|Object} options string=encoding or object={ encoding, flag, signal }
 * @returns {Object} options.
 * @see {@link https://nodejs.org/api/fs.html#fsreadfilepath-options-callback}
 * @private
 */
function getOptions(options) {
  return typeof options === 'string' ? options : Object.assign({ encoding: 'utf8' }, options);
};

/**
 * Check target object is undefine or null.
 * @param {Object} obj check target.
 * @returns {boolean} true = target object is undefine or null.
 * @private
 */
function isEmpty(obj) {
  return obj === undefined || obj === null;
};

/**
 * @type {Object}
 */
const yukihirogJson = {};

/**
 * Read JSON from file and parse it to Object.
 * @param {string} filePath path to file for fs.readFile.
 * @param {string|Object} [options] options for fs.readFile.
 * @param {Function} [callback] callback function. get an argument is result={ path, data, json }
 * @see {@link https://nodejs.org/api/fs.html#fsreadfilepath-options-callback}
 * @returns {Promise} result={ path, data, json }
 */
yukihirogJson.read = (filePath, options, callback) => {
  return new Promise((resolve, reject) => {
    if (typeof options === 'function' && isEmpty(callback)) {
      callback = options;
      options = undefined;
    }

    fs.readFile(filePath, getOptions(options), (err, json) => {
      if (err) reject(err);

      let data;
      try {
        data = JSON.parse(json);
      } catch(err) {
        reject(err);
      }

      const result = { path: filePath, data: data, json: json };

      if (typeof callback === 'function') callback(result);

      resolve(result);
    });
  });
};

/**
 * Read JSON from array.
 * @param {Array} array array contained string=path or object={ path, options?, callback? }.
 * @param {string|Object} [options] options.
 * @param {Function} [callback] callback function for each file. with result={ path, data, json }
 * @see read
 * @returns {Promise} promise create from Promise.all. results=[result, ...]
 */
yukihirogJson.readAll = function(array, options, callback) {
  if (typeof options === 'function' && isEmpty(callback)) {
    callback = options;
    options = undefined;
  }

  return Promise.all(array.map((item) => {
    if (typeof item === 'string') {
      return this.read(
        item,
        options,
        callback
      );
    } else {
      return this.read(
        item.path,
        item.options !== undefined ? item.options : options,
        item.callback !== undefined ? item.callback : callback
      );
    }
  }));
};

/**
 * Read from array and merge data with Object.assign.
 * @param {Array} array array contained string=path or object={ path, options?, callback? }.
 * @param {string|Object} [options] options.
 * @param {Function} [callback] callback function for each file. with result={ path, data, json }
 * @see readAll
 * @returns {Promise} promise create from Promise.all. result={ path: [path, ...], data: data, json: [json, ...] }
 */
yukihirogJson.readMerge = function(array, options, callback) {
  return new Promise((resolve, reject) => {
    this.readAll(array, options, callback)
      .then((results) => {
        const result = {
          path: [],
          data: {},
          json: []
        };

        results.forEach((item) => {
          result.path.push(item.path);
          result.json.push(item.json);
          result.data = Object.assign(result.data, item.data);
        })

        resolve(result);
      })
      .catch(err => reject(err))
    ;
  });
};

/**
 * Convert object to JSON and write it to file.
 * @param {string} filePath path to file for fs.writeFile.
 * @param {Object} data object for fs.writeFile.
 * @param {string|Object} [options] options for fs.writeFile.
 * @param {Function} [callback] callback function. get an argument is result={ path, data, json }
 * @see {@link https://nodejs.org/api/fs.html#fswritefilefile-data-options-callback}
 * @returns {Promise} result={ path, data, json }
 */
yukihirogJson.write = (filePath, data, options, callback) => {
  return new Promise((resolve, reject) => {
    let json;

    try {
      json = JSON.stringify(data);
    } catch(err) {
      reject(err);
    }

    if (typeof options === 'function' && isEmpty(callback)) {
      callback = options;
      options = undefined;
    }

    fs.writeFile(filePath, json, getOptions(options), (err) => {
      if (err) reject(err);

      const result = { path: filePath, data: data, json: json };

      if (typeof callback === 'function') callback(result);

      resolve(result);
    });
  })
};

/**
 * Write to file from array.
 * @param {Array} array array containes object={ path, data, options?, callback? }.
 * @param {string|Object} [options] options.
 * @param {Function} [callback] callback function for each file. with result={ path, data, json }
 * @see write
 * @returns {Promise} promise create from Promise.all. results=[result, ...]
 */
yukihirogJson.writeAll = function(array, options, callback) {
  if (typeof options === 'function' && isEmpty(callback)) {
    callback = options;
    options = undefined;
  }

  return Promise.all(array.map((item) => {
    return this.write(
      item.path,
      item.data,
      item.options !== undefined ? item.options : options,
      item.callback !== undefined ? item.callback : callback
    );
  }));
};

/**
 * Read JSON from file and parse it to Object. (Synchronously)
 * @param {string} filePath path to file for fs.readFile.
 * @param {string|Object} [options] options for fs.readFile.
 * @see {@link https://nodejs.org/api/fs.html#fsreadfilepath-options-callback}
 * @returns {Object} parsed data
 */
yukihirogJson.readSync = (filePath, options) => {
  return JSON.parse(fs.readFileSync(filePath, getOptions(options)));
};

/**
 * Read JSON from array. (Synchronously)
 * @param {Array} array array contained string=path or object={ path, options?, callback? }.
 * @param {string|Object} [options] options for fs.readFile.
 * @see readSync
 * @returns {Array} an array contains parsed data
 */
yukihirogJson.readAllSync = function(array, options) {
  return array.map((item) => {
    if (typeof item === 'string') {
      return this.readSync(
        item,
        options
      );
    } else {
      return this.readSync(
        item.path,
        item.options !== undefined ? item.options : options
      );
    }
  });
};

/**
 * Read from array and merge data with Object.assign. (Synchronously)
 * @param {Array} array array contained string=path or object={ path, options?, callback? }.
 * @param {string|Object} [options] options for fs.readFile.
 * @see readAllSync
 * @returns {Object} merged data
 */
yukihirogJson.readMergeSync = function(array, options) {
  return Object.assign(...this.readAllSync(array, options));
};

/**
 * Convert object to JSON and write it to file.
 * @param {string} filePath path to file for fs.writeFileSync.
 * @param {Object} data object for fs.writeFileSync.
 * @param {string|Object} [options] options for fs.writeFileSync.
 * @see {@link https://nodejs.org/api/fs.html#fswritefilesyncfile-data-options}
 */
yukihirogJson.writeSync = (filePath, data, options) => {
  return fs.writeFileSync(filePath, JSON.stringify(data), getOptions(options));
};

/**
 * Write to file from array.
 * @param {Array} array array containes object={ path, data, options? }.
 * @param {string|Object} [options] options.
 * @see writeSync
 */
yukihirogJson.writeAllSync = function(array, options) {
  array.forEach((item) => {
    this.writeSync(
      item.path,
      item.data,
      item.options !== undefined ? item.options : options
    );
  });
};

module.exports = yukihirogJson