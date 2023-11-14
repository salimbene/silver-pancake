import { useState } from "react";
import server from "./server";

import { utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

import wallets from "../wallet.json";

const hashMessage = (message) => {
  // convert message to bytes for hash algorithm
  const bytes = utf8ToBytes(message);
  // return hashed message
  return keccak256(bytes);
};

const signMessage = (message, privateKey) => {
  const signature = secp256k1.sign(message, privateKey);

  return { sigHex: signature.toCompactHex(), recovery: signature.recovery };
};

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const hashMsg = hashMessage(sendAmount);
    const account = wallets.find((e) => e.eth === address);

    if (!account) console.log("no private key found");
    const { private: privateKey } = account;
    const signature = signMessage(hashMsg, privateKey);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
