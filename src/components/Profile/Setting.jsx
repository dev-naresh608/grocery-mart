import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/context";
import { defaultPP } from "../index";
import { toast, ToastContainer } from "react-toastify";

function Setting() {
  const { currentUser, userData, setCurrentUser, setUserData } =
    useContext(UserContext);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isOldPassIsMatch, setIsOldPassIsMatch] = useState(true);
  const [isNewpassConfirmPassSame, setIsNewpassConfirmPassSame] =
    useState(true);
  //change profile picture
  const handleImageUpload = (e) => {
   try{
     const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;

      let updatedUser = { ...currentUser, imageUrl: base64Image };
      let userExceptCurrentUser = userData.filter(
        (user) => user.id !== currentUser.id,
      );

      let newData = [...userExceptCurrentUser, updatedUser];
      localStorage.setItem("localUserData", JSON.stringify(newData));
      setUserData(userExceptCurrentUser);
      setCurrentUser(updatedUser);
    };
    reader.readAsDataURL(selectedFile);
   }catch(err){
    console.log('E: ',err)
   }
  };

  //delete profile picture
  const handleRemoveProfilePicture = (e) => {
    if (currentUser.hasOwnProperty("imageUrl")) {
      delete currentUser.imageUrl;
      // setCurrentUser
      let oldUserData = JSON.parse(localStorage.getItem("localUserData"));
      let userExceptCurrentUser = oldUserData.filter(
        (user) => user.id !== currentUser.id,
      );
      let newUserData = [...userExceptCurrentUser, currentUser];
      localStorage.setItem("localUserData", JSON.stringify(newUserData));
      setUserData(newUserData);
    } else {
      alert("this is the default picture you can't delete it");
    }
  };

  const onPasswordChange = (e) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //showing user pass is same or not via frontend ui
  useEffect(() => {
    if (formData.oldPassword > 0) {
      if (formData.oldPassword === currentUser.password) {
        setIsOldPassIsMatch(true);
      } else {
        setIsOldPassIsMatch(false);
      }
    }
    if (formData.newPassword === formData.confirmPassword) {
      setIsNewpassConfirmPassSame(true);
    } else {
      setIsNewpassConfirmPassSame(false);
    }
  });

  //pass change
  const onFormDataSubmit = (e) => {
    e.preventDefault();
    const isOldPassIsMatch = currentUser.password === formData.oldPassword;
    if (!isOldPassIsMatch) {
      toast.error("Old Password is Wrong");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("confirm pass is not same as new pass");
    } else if (formData.oldPassword === formData.newPassword) {
      alert("Don't Use Your old password as a new password");
    } else {
      let updatedUser = {
        ...currentUser,
        password: formData.newPassword,
      };

      let userExceptCurrentUser = userData.filter(
        (user) => user.id !== currentUser.id,
      );

      let newData = [...userExceptCurrentUser, updatedUser];
      localStorage.setItem("localUserData", JSON.stringify(newData));
      setUserData(userExceptCurrentUser);
      setCurrentUser(updatedUser);

      toast.success("pass changed");
      for (let key in formData) {
        formData[key] = "";
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-gray-500">Manage your account settings</p>
      </div>

      {/* Profile Photo */}
      <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-4">
        <ToastContainer
          autoClose={500}
          pauseOnHover={false}
          position="top-right"
        ></ToastContainer>
        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200">
          <img
            src={
              currentUser.hasOwnProperty("imageUrl")
                ? currentUser.imageUrl
                : defaultPP
            }
            alt="pp"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <label className="text-sm text-indigo-600 cursor-pointer hover:underline">
            Change Photo
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          <label className="mx-2 text-sm text-red-600 cursor-pointer hover:underline">
            Remove Image
            <button className="hidden" onClick={handleRemoveProfilePicture} />
          </label>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG supported</p>
        </div>
      </div>

      {/* User Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Username</p>
          <h3 className="font-medium capitalize">{currentUser.username}</h3>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Email</p>
          <h3 className="font-medium">{currentUser.email}</h3>
        </div>
      </div>

      {/* Change Password */}
      <form
        onSubmit={onFormDataSubmit}
        className="bg-gray-100 p-4 rounded-xl space-y-3"
      >
        <h3 className="font-semibold">Change Password</h3>
        <input
          type="password"
          placeholder="Old Password"
          className={`w-full border bg-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${isOldPassIsMatch ? "focus:ring-indigo-400" : "focus:ring-red-400"}`}
          onChange={onPasswordChange}
          value={formData.oldPassword}
          name="oldPassword"
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full border bg-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={onPasswordChange}
          name="newPassword"
          value={formData.newPassword}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className={`w-full border bg-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${isNewpassConfirmPassSame ? "focus:ring-indigo-400" : "focus:ring-red-400"}`}
          onChange={onPasswordChange}
          name="confirmPassword"
          value={formData.confirmPassword}
        />

        <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
          Update Password
        </button>
      </form>
    </div>
  );
}

export default Setting;
