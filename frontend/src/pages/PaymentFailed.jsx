import { Link } from "react-router-dom";

const PaymentFailed = () => {
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
      <img src="/images/failed.jpeg" alt="Failed" className="w-32 h-32 mb-4" />
      <h1 className="text-3xl font-bold text-red-600">Payment Failed!</h1>
      <p className="text-gray-600 mt-2 text-center">
        Your payment could not be processed. Please try again.
      </p>
      <Link
        to="/payment"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try Again
      </Link>
    </div>
  );
};

export default PaymentFailed;
