const utf8 = require('utf8');
const base64 = require('base-64');

function encode(value) {
  return base64.encode(utf8.encode(value));
}

function decode(value) {
  return utf8.decode(base64.decode(value));
}

module.exports = {encode, decode};
