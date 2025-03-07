import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the user came from the payment flow
  useEffect(() => {
    if (!location.state?.fromPayment) {
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
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="text-gray-600 mt-2 text-center">
        Thank you for your payment. Your order has been placed successfully.
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

export default PaymentSuccess;
