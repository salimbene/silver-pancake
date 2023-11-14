// const { secp256k1 } = require("ethereum-cryptography/secp256k1-compat");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const balances = {
  "0256872ff7bcbd44ae0bc7d78b4bdad936a35b4b684a217a2fff14bc133b17824e": 100,
  "02e1a132ed37e39b2efca1a918f25ef15da168fe51d4cfa3881f4af735b74428b8": 50,
  "030b5d8d2eabdc63dee07e90589a1343d4836ddccdc629b988d1bc3787310c841e": 75,
};

// node scripts/signMessage.js 50 9ba6107b45a6f746b494b586df4f076b41b6bc4a5f778f8edc19026e048751d2

const wallet = [
  {
    public:
      "0256872ff7bcbd44ae0bc7d78b4bdad936a35b4b684a217a2fff14bc133b17824e",
    private: "315bdcc6d78186b138697acf431327a1aa7d95fba1c6c45ec5cf3947e0c1e06f",
  },
  {
    public:
      "02e1a132ed37e39b2efca1a918f25ef15da168fe51d4cfa3881f4af735b74428b8",
    private: "1cafa479f29127f1372bba603090f316d7dbf20cc01bff373b1382dd5920a319",
  },
  {
    public:
      "030b5d8d2eabdc63dee07e90589a1343d4836ddccdc629b988d1bc3787310c841e",
    private: "9ba6107b45a6f746b494b586df4f076b41b6bc4a5f778f8edc19026e048751d2",
  },
];

const getETHAddress = (publicKey) => {
  // slice of the first byte of the Uint8Array publicKey
  const sliceKey = utf8ToBytes(publicKey).slice(1);
  // hash the rest of the public key => returns a Uint8Array keccak256 hash
  const hashKey = keccak256(sliceKey);
  // return last 20 bytes of the Uint8Array keccak256 hash
  return toHex(hashKey.slice(-20));
};

const hashMessage = (message) => {
  // convert message to bytes for hash algorithm
  const bytes = utf8ToBytes(message);
  // return hashed message
  return keccak256(bytes);
};

const { private, public } = wallet[0];
let signature;
// send hex

const hashMsg = hashMessage("hello");
signature = secp256k1.sign(hashMsg, private); // `{prehash: true}` option is available, message hash (not message) in ecdsa
const sigHex = signature.toCompactHex();
console.log({ sigHex });

// recover

let sig = secp256k1.Signature.fromCompact(sigHex);
const hashMsgEx = toHex(hashMsg);
sig = sig.addRecoveryBit(signature.recovery);
const publicKey = sig.recoverPublicKey(hashMsgEx).toRawBytes();
const recove = toHex(publicKey);

console.log("*********");
console.log({ recove, public });
console.log({
  "eth rec:": getETHAddress(recove),
  "eth pub": getETHAddress(public),
});
console.log("*********");
wallet.forEach((acc) => console.log(acc.public, getETHAddress(acc.public)));
// const privateKey = secp256k1.utils.randomPrivateKey();
// const publicKey = secp256k1.getPublicKey(privateKey);
// console.log("Private key: ", toHex(privateKey));
// console.log("Public key: ", toHex(publicKey));
// console.log("eths address: ", getETHAddress(publicKey));
