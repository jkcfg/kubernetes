const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const chars = alphabet.split('');

function encode(bytes) {
  const triples = Math.floor(bytes.length / 3);
  const tripleLen = triples * 3;
  let encoded = '';
  for (let i = 0; i < tripleLen; i += 3) {
    const bits = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    const c1 = chars[bits >> 18];
    const c2 = chars[(bits >> 12) & 0x3f];
    const c3 = chars[(bits >> 6) & 0x3f];
    const c4 = chars[bits & 0x3f];
    encoded = `${encoded}${c1}${c2}${c3}${c4}`;
  }
  switch (bytes.length - tripleLen) {
  case 1: {
    // left with 8 bits; pad to 12 bits to get two six-bit characters
    const last = bytes[bytes.length - 1];
    const c1 = chars[last >> 2];
    const c2 = chars[(last & 0x03) << 4];
    encoded = `${encoded}${c1}${c2}==`;
    break;
  }
  case 2: {
    // left with 16 bits; pad to 18 bits to get three six-bit characters
    const last2 = (bytes[bytes.length - 2] << 10) | (bytes[bytes.length - 1] << 2);
    const c1 = chars[last2 >> 12];
    const c2 = chars[(last2 >> 6) & 0x3f];
    const c3 = chars[last2 & 0x3f];
    encoded = `${encoded}${c1}${c2}${c3}=`;
    break;
  }
  default:
    break;
  }
  return encoded;
}

// Encode a native string (UTF16) of ASCII characters as an array of UTF8 bytes.
function ascii2bytes(str) {
  const result = new Array(str.length);
  for (let i = 0; i < str.length; i += 1) {
    result[i] = str.charCodeAt(i);
  }
  return result;
}

export { encode, ascii2bytes };
