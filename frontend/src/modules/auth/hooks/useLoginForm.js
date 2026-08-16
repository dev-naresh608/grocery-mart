import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../store/authThunk.js";
import { useModal } from "../../../components";

export function useLoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isPassVisible, setIsPassVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => {
      if (!prev[name]) return prev;

      const updated = { ...prev };
      delete updated[name];

      return updated;
    });
  };

  const handleShowPassword = () => {
    setIsPassVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormErrors({});

    if (!formData.email || !formData.password) {
      toast.warning("Please enter email and password");
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();

      toast.success("Login successful");
      closeModal();
      navigate("/dashboard");
    } catch (error) {
      if (error?.errors?.length) {
        const errors = {};

        error.errors.forEach(({ field, message }) => {
          errors[field] = message;
        });

        setFormErrors(errors);
      } else {
        toast.error(error?.message || "Login failed");
      }
    }
  };

  return {
    formData,
    formErrors,
    isPassVisible,
    isLoading,
    handleChange,
    handleShowPassword,
    handleSubmit,
  };
}