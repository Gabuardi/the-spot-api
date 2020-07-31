import utf8 from 'utf8';
import base64 from 'base-64';

function encode(value) {
  return base64.encode(utf8.encode(value));
}

function decode(value) {
  utf8.decode(base64.encode(value));
}

export {encode, decode}
