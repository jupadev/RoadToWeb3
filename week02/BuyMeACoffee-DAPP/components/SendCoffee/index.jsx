import React, { useState } from "react";

export const SendCoffee = ({ buyCoffee }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handlerNameChange = (event) => {
    setName(event.target.value);
  };

  const handlerMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleBuyCoffee = (e) => {
    e.preventDefault();
    const isLargeCoffee = e.currentTarget.id === buyLargeCoffee;
    buyCoffee(name, message, isLargeCoffee);
    setName("");
    setMessage("");
  };

  return (
    <form>
      <div>
        <label>Name</label>
        <br />
        <input
          id="name"
          type="text"
          placeholder="anon"
          onChange={handlerNameChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={name}
        />
      </div>
      <br />
      <div>
        <label>Send JhonnV a message</label>
        <br />
        <textarea
          rows={3}
          placeholder="Enjoy your coffee!"
          id="message"
          onChange={handlerMessageChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={message}
        ></textarea>
      </div>
      <div className="flex justify-center	">
        <button
          id="buyRegularCoffee"
          className="bg-green-200 hover:bg-green-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={handleBuyCoffee}
        >
          Send 1 Coffee for 0.001ETH
        </button>
        <button
          id="buyLargeCoffee"
          className="bg-green-400 hover:bg-green-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={handleBuyCoffee}
        >
          Send 1 LARGE Coffee for 0.003ETH
        </button>
      </div>
    </form>
  );
};
