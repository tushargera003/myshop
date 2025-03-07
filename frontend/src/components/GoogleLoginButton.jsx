const GoogleLoginButton = () => {
  return (
    <a
      href="http://localhost:5000/api/auth/google"
      className="w-full bg-red-500 text-white p-2 rounded flex justify-center items-center mt-4"
    >
      Login with Google
    </a>
  );
};

export default GoogleLoginButton;
