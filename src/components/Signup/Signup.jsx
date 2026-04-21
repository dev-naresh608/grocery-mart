import React, { useState, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { ChevronDown } from "lucide-react";

import { UserContext } from "../../contexts/context";

export default function Signup() {
  const { setUserData } = useContext(UserContext);
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
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
    if (formData) {
      const oldUserData =
        JSON.parse(localStorage.getItem("localUserData")) || [];
      const currentEmail = formData.email;
      const isMailExist = () => {
        return oldUserData.some((user) => user.email === currentEmail);
      };
      if (isMailExist()) {
        toast.info("This email is  already exist");
        return;
      }
      setUserData(formData);

      const newData = [...oldUserData, formData];
      localStorage.setItem("localUserData", JSON.stringify(newData));
      setUserData(newData);
      toast.success("account created successfully");
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
         {
          isSeller &&  <input
            required
            type="phone"
            name="phone"
            placeholder="Enter phone number..."
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

         }
          <div>
            <div className="flex items-center w-max px-2 rounded-2xl bg-gray-200 text-black">
              <span className="font-semibold">Role :</span>
              <select
                className=" px-2 text-center bg-transparent font-semibold text-md py-1  outline-none"
                defaultValue="customer"
                name="role"
                onChange={handleChange}
                onClick={() => {
                  if (formData.role !== "customer") {
                    setIsSeller(true);
                  } else {
                    setIsSeller(false);
                  }
                }}
              >
                <option value="seller">Seller</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          </div>

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
