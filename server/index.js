const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");

const balances = {
  "0256872ff7bcbd44ae0bc7d78b4bdad936a35b4b684a217a2fff14bc133b17824e": 100,
  "02e1a132ed37e39b2efca1a918f25ef15da168fe51d4cfa3881f4af735b74428b8": 50,
  "030b5d8d2eabdc63dee07e90589a1343d4836ddccdc629b988d1bc3787310c841e": 75,
};

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

const recoverPublicKey = (hashMsg, signature) => {
  const { sigHex, recovery } = signature;
  let sigFromEx = secp256k1.Signature.fromCompact(sigHex);
  sigFromEx = sigFromEx.addRecoveryBit(recovery);
  const hashMsgEx = toHex(hashMsg);
  const publicKey = sigFromEx.recoverPublicKey(hashMsgEx).toRawBytes();
  return toHex(publicKey);
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const publicKey = Object.keys(balances).find(
    (p) => getETHAddress(p) === address
  );
  const balance = balances[publicKey] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, amount, recipient, signature } = req.body;

  const hashMsg = hashMessage(`${amount}`);
  const recovered = recoverPublicKey(hashMsg, signature);
  const senderPublicKey = Object.keys(balances).find((p) => p === recovered);

  if (!senderPublicKey)
    return res.status(400).send({ message: "Invalid sender!" });

  const recipientPublicKey = Object.keys(balances).find(
    (p) => getETHAddress(p) === recipient
  );

  if (!recipientPublicKey)
    return res.status(400).send({ message: "Invalid recipient!" });

  setInitialBalance(senderPublicKey);
  setInitialBalance(recipientPublicKey);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderPublicKey] -= amount;
    balances[recipientPublicKey] += amount;
    res.send({ balance: balances[senderPublicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
