const { secp256k1 } = require("ethereum-cryptography/secp256k1-compat");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

function hashMessage(message) {
  // convert message to bytes for hash algorithm
  const bytes = utf8ToBytes(message);
  // return hashed message
  return keccak256(bytes);
}

function signMessage(msg) {
  // hash the message
  const PRIVATE_KEY = process.argv[3];
  const hashMsg = hashMessage(msg);

  // sign the hash message with the private key and set recovered to true to get the recovered bit
  // recovered option has been removed because recovery bit is always returned now

  const signature = secp256k1.sign(hashMsg, PRIVATE_KEY);

  return signature.toString();
}

signMessage(process.argv[2]);

// node scripts/signMessage.js 50 9ba6107b45a6f746b494b586df4f076b41b6bc4a5f778f8edc19026e048751d2
// Signature {
//   r: 36691152806955910003274360488470766136656266395316605280087404244279825225745n,
//   s: 25775843654993118241418850103739194190473898130155752009759534141754021856163n,
//   recovery: 0
// }

// Private key:  315bdcc6d78186b138697acf431327a1aa7d95fba1c6c45ec5cf3947e0c1e06f
// Public key:  0256872ff7bcbd44ae0bc7d78b4bdad936a35b4b684a217a2fff14bc133b17824e
// Delfos-M1:/Users/salimbene/dev/ecdsa-node/server/ ‣ node scripts/generate.js
// Private key:  1cafa479f29127f1372bba603090f316d7dbf20cc01bff373b1382dd5920a319
// Public key:  02e1a132ed37e39b2efca1a918f25ef15da168fe51d4cfa3881f4af735b74428b8
// Delfos-M1:/Users/salimbene/dev/ecdsa-node/server/ ‣ node scripts/generate.js
// Private key:  9ba6107b45a6f746b494b586df4f076b41b6bc4a5f778f8edc19026e048751d2
// Public key:  030b5d8d2eabdc63dee07e90589a1343d4836ddccdc629b988d1bc3787310c841e
