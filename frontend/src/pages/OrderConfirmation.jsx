// OrderConfirmation.jsx
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the user came from the checkout page
  useEffect(() => {
    if (!location.state?.fromCheckout) {
      navigate("/"); // Redirect to home if accessed directly
    }
  }, [location.state, navigate]);

  return (
    <div className="container mx-auto flex flex-col items-center p-6">
      <img
        src="/images/success.jpeg"
        alt="Success"
        className="w-32 h-32 mb-4"
      />
      <h1 className="text-3xl font-bold text-green-600">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-600 mt-2 text-center">
        Thank you for shopping with us. Your order has been placed and will be
        delivered soon. Please keep cash ready for payment upon delivery.
      </p>
      <Link
        to="/products"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;
