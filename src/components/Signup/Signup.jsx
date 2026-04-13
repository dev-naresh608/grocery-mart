import React, { useState, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { UserContext } from "../../contexts/context";

export default function Signup() {
  const { setUserData } = useContext(UserContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    id: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      id: uuid(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Signup Data:", formData);
    if (formData) {
      toast.success("account created successfully");
      setUserData(formData);
      const oldUserData = JSON.parse(
        localStorage.getItem("localUserData"),
      ) || [
      ];
       const newData = [...oldUserData, formData];
        localStorage.setItem("localUserData", JSON.stringify(newData));
        setUserData(newData);
      setTimeout(() => {
          navigate("/login");
      }, 1500);
    } else {
      toast.warning("enter data");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center pb-5">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <input
            required
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button className="w-full bg-green-500 text-white py-2 rounded-lg">
            Create Account
          </button>
          <p className="text-black">
            Already Have an account ?
            <Link to="/login" className="text-blue-800">
              {" "}
              Login
            </Link>
          </p>
        </form>
        <ToastContainer autoClose={1000} pauseOnHover={false}></ToastContainer>
      </div>
    </div>
  );
}
