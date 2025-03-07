import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handlePayment = async () => {
    const res = await fetch("/api/payment/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount, email: "user@example.com" }), // Use total amount from cart
    });

    const { paytmParams } = await res.json();

    const form = document.createElement("form");
    form.method = "post";
    form.action = "https://securegw-stage.paytm.in/order/process";

    Object.keys(paytmParams).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = paytmParams[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Paytm Payment</h1>
      <p className="text-lg mb-4">Total Amount: ₹{totalAmount}</p>
      <button
        onClick={handlePayment}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
