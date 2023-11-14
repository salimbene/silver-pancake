import server from "./server";

import wallets from "../wallet.json";

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        ETH address
        <input
          placeholder="Type in eth address"
          value={address}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <p className="">
        Available addresses:
        {wallets.map((e, ind) => {
          return <p key={ind}>{e.eth}</p>;
        })}
      </p>
    </div>
  );
}

export default Wallet;
