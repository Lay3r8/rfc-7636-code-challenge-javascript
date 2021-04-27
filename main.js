const SHA256 = require("js-sha256");

const base64EncodeURL = function(byteArray) {
  return btoa(Array.from(new Uint8Array(byteArray)).map(val => {
    return String.fromCharCode(val);
  }).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}

const base64UrlToByteArray = function(base64Url) {
  let len = base64Url.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = base64Url.charCodeAt(i);
  }
  return bytes.buffer;
}

const generate32BytesSequence = function(){
  let output = [];
  while(output.length < 32){
    let r = Math.floor(Math.random() * 100) + 1;
    if(output.indexOf(r) === -1) output.push(r);
  }
  return output;
}

/**
 * Generates a S256 code_challenge
 * Reference https://tools.ietf.org/html/rfc7636
 */
const generateCodeChallenge = function() {
  let output = 'error';

  // Generate random 32 bytes sequence
  let randomSequence = generate32BytesSequence();

  // fixme: this is used for testing, remove it after
  randomSequence = [116, 24, 223, 180, 151, 153, 224, 37, 79, 250, 96, 125, 216, 173, 187, 186, 22, 212, 37, 77, 105, 214, 191, 240, 91, 88, 5, 88, 83, 132, 141, 121];

  // Encode it as base64url to create the code_verifier
  let code_verifier = base64EncodeURL(randomSequence);

  // Hash the result with SHA256
  let sha256 = SHA256.sha256(code_verifier)
  console.log('code_verifier', code_verifier)

  // Encode this hash to base64url again to create the code_challenge
  let code_challenge = base64EncodeURL(Uint8Array.from(Buffer.from(sha256, 'hex')))

  return {code_challenge, code_verifier}
}
