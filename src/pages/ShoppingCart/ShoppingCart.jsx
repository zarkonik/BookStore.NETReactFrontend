import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import "./shopping_cart.css";
import picture1 from "./slika1.png";
import picture2 from "./slika2.png";
import { useGlobalContext } from "../context/context";
import { queryAllByAltText } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const { cart } = useGlobalContext();
  const [price, setPrice] = useState(0);
  let quantityArray = new Array(cart.length);
  for (let i = 0; i < cart.length; i++) {
    quantityArray[i] = 1;
  }

  let totalPrices = new Array(cart.length);
  for (let i = 0; i < cart.length; i++) {
    totalPrices[i] = quantityArray[i] * cart[i].price;
  }
  let sumPrices = 0;
  totalPrices.forEach((price) => (sumPrices += price));

  const [quantities, setQuantities] = useState(quantityArray);
  const [totalPricesItems, setTotalPricesItems] = useState(totalPrices);
  const [totalSum, setTotalSum] = useState(sumPrices);

  const navigate = useNavigate();

  const priceRef = useRef(null);
  const plusRef = useRef(null);
  const numberOfItem = useRef(null);
  const totalPrice = useRef(null);

  const handlePlusMinusClick = (plus, bookId) => {
    const newQuantity = [...quantities]; //spread operator, izdvaja element po element u novi niz
    if (plus) newQuantity[bookId] += 1;
    else newQuantity[bookId] -= 1;
    setQuantities(newQuantity);

    const newTotalPriceItem = newQuantity[bookId] * cart[bookId].price;
    const newArrayOfTotalPrices = [...totalPricesItems];
    newArrayOfTotalPrices[bookId] = newTotalPriceItem;
    setTotalPricesItems(newArrayOfTotalPrices);

    let localSum = 0;
    for (let i = 0; i < newArrayOfTotalPrices.length; i++) {
      localSum += newArrayOfTotalPrices[i];
    }
    setTotalSum(localSum);
  };

  return (
    <>
      <div className="cart_icon">
        <FaShoppingCart />
        <div className="numOfCartItems">{cart.length}</div>
      </div>
      <div className="wholeContainer">
        <h1>Your Shopping cart</h1>

        <div className="headers">
          <div>Item</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Total</div>
        </div>

        <div className="allItems">
          {cart.map((book, index) => {
            return (
              <div className="oneItem" key={book.id}>
                <img src={book.picture} alt="picture" />
                <div className="properties">
                  <div>{book.title}</div>
                  <div>{book.description}</div>
                  <div>{book.author}</div>
                  <div>{book.genre}</div>
                </div>

                <div className="restOfProperties">
                  <div ref={priceRef}>${book.price}</div>
                  <div className="quantity">
                    <button onClick={() => handlePlusMinusClick(false, index)}>
                      -
                    </button>
                    <input
                      type="textbox"
                      value={quantities[index]}
                      ref={numberOfItem}
                    />
                    <button
                      ref={plusRef}
                      onClick={() => handlePlusMinusClick(true, index)}
                    >
                      +
                    </button>
                  </div>
                  <div ref={totalPrice}>${totalPricesItems[index]}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="afterItems">
          <button className="backToShopping" onClick={() => navigate("/")}>
            Back to shopping
          </button>
          <div className="totalSum">Total sum: {totalSum}</div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
