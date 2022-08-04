import React, { useState } from "react";

export const ChangeAddressForm = ({ changeOwnership }) => {
  const [newAddress, setNewAddress] = useState("");

  const handlerNewAddress = (event) => {
    setNewAddress(event.target.value);
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    changeOwnership(newAddress);
  };

  return (
    <form className="flex items-end my-8">
      <div className="basis-7/12">
        <label>New Address</label>
        <br />
        <input
          id="name"
          type="text"
          placeholder="Change ownership"
          onChange={handlerNewAddress}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={newAddress}
          required
        />
      </div>
      <div className="basis-5/12">
        <button
          id="buyRegularCoffee"
          className="bg-green-200 hover:bg-green-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={handleOnChange}
        >
          Change Ownership
        </button>
      </div>
    </form>
  );
};
