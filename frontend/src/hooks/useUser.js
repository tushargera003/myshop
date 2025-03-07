import { useEffect, useState } from "react";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response:", response); // Log the response object

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json(); // Parse the response body as JSON
        console.log("Data:", data); // Log the parsed data

        setUser(data); // Set the user state
      } catch (error) {
        console.error("Error fetching user details:", error); // Log any errors
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default useUser;