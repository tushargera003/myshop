import { useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import useUser from "../hooks/useUser"; // Import the custom hook

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser(); // Fetch user details

  // Redirect if user is not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/"); // Redirect to home if not admin
    }
  }, [user, loading, navigate]);

  // Show loading state while fetching user data
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-900 text-white min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link to="/admin/dashboard" className="hover:text-yellow-400">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="hover:text-yellow-400">
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="hover:text-yellow-400">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="hover:text-yellow-400">
                Products
              </Link>
            </li>
            <li>
              <Link to="/admin/chatbot" className="hover:text-yellow-400">
                chatbot
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet /> {/* Yeh nested admin pages render karega */}
      </main>
    </div>
  );
};

export default AdminLayout;
