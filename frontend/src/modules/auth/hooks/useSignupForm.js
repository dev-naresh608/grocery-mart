import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../components";
import { register } from "../store/authThunk.js";

const INITIAL_FORM_DATA = {
  username: "",
  email: "",
  password: "",
  phone: "",
  driver_status: true,
  driver_aadhaar_number: "",
  driver_vehicle_number: "",
  driver_dob: "",
  store_owner_name: "",
  store_name: "",
  store_address: "",
  store_type: "",
};

export function useSignupForm() {
  const { closeModal, payload } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [isPassVisible, setIsPassVisible] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const roleParam = searchParams.get("role") || payload?.role;
  const validRoles = ["customer", "seller", "driver"];

  const currentRole = validRoles.includes(roleParam) ? roleParam : "customer";

  const setCurrentRole = (role) => {
    setSearchParams({ role }, { replace: true });
    setFormErrors({});
  };

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

  const buildPayload = () => {
    const base = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: currentRole,
    };

    if (currentRole === "seller") {
      return {
        ...base,
        store_owner_name: formData.username,
        store_name: formData.store_name,
        store_type: formData.store_type,
        store_address: formData.store_address,
      };
    }

    if (currentRole === "driver") {
      return {
        ...base,
        driver_status: formData.driver_status,
        driver_dob: formData.driver_dob,
        driver_vehicle_number: formData.driver_vehicle_number,
        driver_aadhaar_number: formData.driver_aadhaar_number,
      };
    }

    return base;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormErrors({});

    try {
      await dispatch(register(buildPayload())).unwrap();

      toast.success("Signup successful");
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
        toast.error(error?.message || "Signup failed");
      }
    }
  };

  return {
    formData,
    formErrors,
    currentRole,
    setCurrentRole,
    isPassVisible,
    isLoading,
    handleChange,
    handleShowPassword,
    handleSubmit,
  };
}
