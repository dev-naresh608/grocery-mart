import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { defaultPP } from "@/assets";
import { addProductApi } from "../services/product.api.service";

function AddProduct() {
  const [productImg, setProductImg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const initialFormData = {
    product_name: "",
    product_weight: "",
    product_weight_type: "none",
    product_cost_price: "",
    product_selling_price: "",
    product_offer_price: "",
    product_description: "",
    isProductInStock: true,
    isOfferAvailable: false,
    store_id: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // ================= HANDLE IMAGE =================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload image only");
      return;
    }

    setSelectedFile(file);
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      setProductImg(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "product_cost_price" ||
        name === "product_selling_price" ||
        name === "product_offer_price" ||
        name === "product_weight"
          ? value.replace(",", ".")
          : value,
    }));
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setFormData(initialFormData);
    setProductImg(null);
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================= VALIDATIONS =================
    if (!productImg) {
      toast.error("Enter product image");
      return;
    }
  
    if (Number(formData.product_cost_price) <= 0) {
      toast.error("Invalid product price");
      return;
    }
    if (Number(formData.product_selling_price) <= 0) {
      toast.error("Invalid selling price");
      return;
    }

    if (Number(formData.product_cost_price) > Number(formData.product_selling_price) ){
      toast.error("Selling price must greater than cost price");
      return;
    }

    
    if (formData.product_offer_price && Number(formData.product_offer_price) < 0) {
      toast.error("Invalid product offer price");
      return;
    }

    try {
      setIsUploading(true);
      // ================= PRODUCT DATA =================
      const productData = {
        ...formData,

        store_id: currentUser?.store_id || currentUser?._id,

        product_name: formData.product_name.trim(),

        product_description: formData.product_description.trim(),

        product_cost_price: Number(formData.product_cost_price),
        product_selling_price: Number(formData.product_selling_price),

        product_offer_price: Number(formData.product_offer_price),

        product_weight: Number(formData.product_weight),

        isOfferAvailable: false,
      };

      // ================= ADD PRODUCT IN DATABASE =================

      const formDataToSend = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        key !== "product_img_url" && formDataToSend.append(key, value);
      });

      formDataToSend.append("product_img", selectedFile);

      const data = await addProductApi(formDataToSend);
      if (!data || !data.success) {
        toast.error(data?.message || "Failed to add product");
      } else {
        toast.success(data.message || "Product added successfully");
        resetForm();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-w-[300px] max-w-[500px]">
      <form
        onSubmit={handleSubmit}
        className="font-semibold text-sm w-full p-3 rounded-md space-y-3 border border-gray-300"
      >
        <div>
          <button
            type="button"
            onClick={() => navigate("/product-list")}
            className="flex items-center gap-1 text-gray-700 hover:text-green-800 font-semibold duration-100"
          >
            <ArrowLeftIcon size={18} strokeWidth={2.5} />
            <span className="text-sm">Back to Orders</span>
          </button>
        </div>
        <p>Please add products related to the: {currentUser.store_type}</p>

        {/* ================= PRODUCT IMAGE ================= */}
        <div>
          <p>Product Image</p>

          <div className="w-max relative group">
            <div className="text-sm text-gray-500 overflow-hidden">
              <div className="border border-dashed active:scale-95 border-gray-400 h-20 w-24 flex flex-col items-center justify-center bg-gray-200 relative overflow-hidden">
                {productImg === null ? (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    {/* UPLOAD SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="27px"
                      viewBox="0 -960 960 960"
                      width="27px"
                      fill="#666666"
                    >
                      <path d="M260-180q-82.92 0-141.46-57.53Q60-295.06 60-378.15q0-74.54 47.96-131.12t118.96-67.04Q246.15-666 317.12-723q70.96-57 162.88-57 108.64 0 184.32 75.68Q740-628.64 740-520v20h12.31q63.23 4.92 105.46 50.85Q900-403.23 900-340q0 66.92-46.15 113.46Q807.69-180 740.77-180H522.31Q492-180 471-201q-21-21-21-51.31v-219.08l-74 72.77-42.15-41.76L480-586.54l146.15 146.16L584-398.62l-74-72.77v219.08q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85H740q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20.77q-56.85 0-98.04 41Q120-438 120-380t41 99q41 41 99 41h100v60H260Zm220-270Z" />
                    </svg>

                    <span>upload</span>

                    <input
                      type="file"
                      accept="image/*"
                      name="product_img"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                ) : (
                  <>
                    <img
                      src={productImg || defaultPP}
                      alt="preview"
                      className="w-full h-full object-contain z-[50]"
                    />

                    {/* DELETE IMAGE */}
                    <div className="absolute z-[60] top-0 right-0">
                      <button
                        type="button"
                        className="outline-none"
                        onClick={() => {
                          setProductImg(null);
                        }}
                      >
                        {/* DELETE SVG */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="22px"
                          viewBox="0 -960 960 960"
                          width="22px"
                          fill="#EA3323"
                        >
                          <path d="M304.62-160q-26.85 0-45.74-18.88Q240-197.77 240-224.62V-720h-40v-40h160v-30.77h240V-760h160v40h-40v495.38q0 27.62-18.5 46.12Q683-160 655.38-160H304.62ZM680-720H280v495.38q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h350.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93V-720ZM392.31-280h40v-360h-40v360Zm135.38 0h40v-360h-40v360ZM280-720v520-520Z" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= PRODUCT NAME ================= */}
        <div>
          <p>Product Name</p>

          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
            placeholder="Type here..."
            className="bg-transparent h-8 w-full outline-none border border-gray-600 rounded-md py-1 px-2"
          />
        </div>

        {/* ================= PRODUCT WEIGHT ================= */}
        <div className="flex items-center gap-5">
          <div className="w-full">
            <p>Product Weight</p>

            <input
              type="text"
              inputMode="decimal"
              name="product_weight"
              value={formData.product_weight}
              onChange={handleChange}
              required
              placeholder="Type here..."
              className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2"
            />
          </div>

          <div className="w-full">
            <p>Weight Type</p>

            <select
              name="product_weight_type"
              value={formData.product_weight_type}
              onChange={handleChange}
              className="bg-transparent outline-none border border-gray-400 rounded-md py-1 px-2 w-full"
            >
              <option value="none">Select Weight Type</option>

              <option value="g">Gm</option>

              <option value="kg">Kg</option>

              <option value="ml">Ml</option>

              <option value="ltr">Ltr</option>

              <option value="none">N/A</option>
            </select>
          </div>
        </div>

        {/* ================= PRODUCT PRICING ================= */}
        <div className="flex items-center gap-3">
          <div className="w-full">
            <p>Product Cost Price ($)</p>

            <input
              type="number"
              name="product_cost_price"
              value={formData.product_cost_price}
              onChange={handleChange}
              required
              placeholder="0"
              className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2"
            />
          </div>

          <div className="w-full">
            <p>Product Selling Price ($)</p>

            <input
              type="number"
              name="product_selling_price"
              value={formData.product_selling_price}
              onChange={handleChange}
              required
              placeholder="0"
              className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2"
            />
          </div>

          <div className="w-full">
            <p>Offer Price ($)</p>

            <input
              type="number"
              name="product_offer_price"
              value={formData.product_offer_price}
              onChange={handleChange}
              placeholder="0"
              className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2"
            />
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div>
          <p>Product Description</p>

          <textarea
            rows={3}
            name="product_description"
            value={formData.product_description}
            onChange={handleChange}
            required
            placeholder="Type here..."
            className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2"
          />
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isUploading}
            className={`active:scale-95 px-5 w-[60%] m-auto py-1.5 rounded-md hover:shadow-lg text-white font-medium flex items-center justify-center gap-2 duration-150 ${
              isUploading ? "bg-green-700 cursor-not-allowed opacity-80" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              "Add Product"
            )}
          </button>

          <button
            type="button"
            disabled={isUploading}
            onClick={resetForm}
            className={`active:scale-95 px-5 w-[60%] m-auto py-1.5 text-white rounded-md hover:shadow-lg font-medium duration-150 ${
              isUploading ? "bg-red-700 opacity-60 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Reset Data
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
