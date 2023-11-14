const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

function hashMessage(message) {
  // convert message to bytes for hash algorithm
  const bytes = utf8ToBytes(message);
  // return hashed message
  return keccak256(bytes);
}

function recoverKey(message, signature, recoveryBit) {
  // hash message
  const hashMsg = hashMessage(message);
  // recover the public key by passing in the hash message, signature, and recovery bit
  return secp256k1.recoverKey(hashMsg, signature, recoveryBit);
}

// node scripts/signMessage.js 50 9ba6107b45a6f746b494b586df4f076b41b6bc4a5f778f8edc19026e048751d2
const signature = {
  r: 36691152806955910003274360488470766136656266395316605280087404244279825225745n,
  s: 25775843654993118241418850103739194190473898130155752009759534141754021856163n,
  recovery: 0,
};

console.log(recoverKey("50,signature,0"));
