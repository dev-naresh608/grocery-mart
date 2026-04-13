import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../../contexts/context";

export default function Login() {
  const navigate = useNavigate();

  const { userData, setCurrentUser, setIsLogin } =
    useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ! CHECK VALID USER
    const isValidUser =
      userData?.length > 0 &&
      userData.some(
        (user) =>
          user.email === formData.email && user.password === formData.password,
      );

    if (formData.username == "" && formData.password == "") {
      toast.warning("Please Enter data");
    } else {
      if (isValidUser) {
        // setCurrentUser(formData)
        const currentUser = userData.find(
          (user) =>
            user.email === formData.email &&
            user.password === formData.password,
        );
        setCurrentUser(currentUser);
        toast.success("Login successful");
        setTimeout(() => {
          setIsLogin(true);
          navigate("/");
        }, 1500);
      } else {
        toast.error("Invalid credentials");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center pb-5">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
            Login
          </button>
          <p className="text-black">
            Don't Have Account:
            <Link to="/signup" className="text-blue-700">
              {" "}
              Signup
            </Link>
          </p>
          <ToastContainer
            autoClose={1000}
            pauseOnHover={false}
          ></ToastContainer>
        </form>
      </div>
    </div>
  );
}
