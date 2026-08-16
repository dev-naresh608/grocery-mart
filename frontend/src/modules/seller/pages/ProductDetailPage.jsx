import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toast } from "react-toastify";
import { useModal, MODAL_TYPES } from "../../../components";
import {
  getProductByIdApi,
  updateProductApi,
  handleDeleteProductApi,
  ProductHeaderDetail,
  ProductImageCard,
  ProductPricingCard,
  ProductSpecsCard,
  ProductDescriptionCard,
  ProductIdInfo,
} from "../index";

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    product_weight: "",
    product_weight_type: "none",
    product_cost_price: "",
    product_selling_price: "",
    product_offer_price: "",
    product_description: "",
    is_product_in_stock: true,
    is_offer_available: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductByIdApi(productId);

        if (!data.success) {
          return toast.error(data.message);
        }
        setProduct(data.product);
        setFormData({
          product_name: data.product.product_name || "",
          product_weight: data.product.product_weight || "",
          product_weight_type: data.product.product_weight_type || "none",
          product_cost_price: data.product.product_cost_price || "",
          product_selling_price: data.product.product_selling_price || "",
          product_offer_price: data.product.product_offer_price || "",
          product_description: data.product.product_description || "",
          is_product_in_stock: data.product.is_product_in_stock !== false,
          is_offer_available: data.product.is_offer_available === true,
        });
      } catch (error) {
        return toast.error(error.message);
      }
    };
    fetchProduct();
  }, [productId]);

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

  const handleCancel = () => {
    if (product) {
      setFormData({
        product_name: product.product_name || "",
        product_weight: product.product_weight || "",
        product_weight_type: product.product_weight_type || "none",
        product_cost_price: product.product_cost_price || "",
        product_selling_price: product.product_selling_price || "",
        product_offer_price: product.product_offer_price || "",
        product_description: product.product_description || "",
        is_product_in_stock: product.is_product_in_stock !== false,
        is_offer_available: product.is_offer_available === true,
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Form validation
    if (!formData.product_name.trim()) {
      return toast.error("Product name cannot be empty");
    }
    if (Number(formData.product_cost_price) <= 0) {
      return toast.error("Invalid cost price");
    }
    if (Number(formData.product_selling_price) <= 0) {
      return toast.error("Invalid selling price");
    }
    if (Number(formData.product_cost_price) > Number(formData.product_selling_price)) {
      return toast.error("Selling price must exceed cost price");
    }
    if (formData.is_offer_available) {
      if (Number(formData.product_offer_price) <= 0) {
        return toast.error("Invalid offer price");
      }
      if (Number(formData.product_offer_price) > Number(formData.product_selling_price)) {
        return toast.error("Offer price cannot exceed selling price");
      }
    }

    setSaving(true);
    try {
      const updates = {
        product_name: formData.product_name.trim(),
        product_weight: Number(formData.product_weight),
        product_weight_type: formData.product_weight_type,
        product_cost_price: Number(formData.product_cost_price),
        product_selling_price: Number(formData.product_selling_price),
        product_offer_price: Number(formData.product_offer_price),
        product_description: formData.product_description.trim(),
        is_product_in_stock: formData.is_product_in_stock,
        is_offer_available: formData.is_offer_available,
      };

      const data = await updateProductApi(productId, currentUser._id, updates);

      toast.success(data.message || "Product updated successfully");

      setProduct((prev) => ({
        ...prev,
        ...updates,
      }));
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    openModal(MODAL_TYPES.CONFIRM, {
      title: "Delete Product?",
      message: `Are you sure you want to delete "${product.product_name || "this product"}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          await handleDeleteProductApi(productId, currentUser, (updated) => dispatch(updateUser(updated)));
          toast.success("Product deleted successfully");
          navigate("/product-list");
        } catch (error) {
          toast.error(error.message || "Failed to delete product");
        }
      },
    });
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 font-semibold animate-pulse">
          Loading product details...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto px-4 py-2">
      {/* Header component */}
      <ProductHeaderDetail
        productName={isEditing ? formData.product_name : product.product_name}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        saving={saving}
        onSave={handleSave}
        onCancel={handleCancel}
        isInStock={isEditing ? formData.is_product_in_stock : product.is_product_in_stock}
        isOfferAvailable={isEditing ? formData.is_offer_available : product.is_offer_available}
        onDelete={handleDelete}
      />

      {/* Grid Layout (like OrderDetailPage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Product Specs & Image (colspan 8) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <ProductImageCard
                productUrl={product.product_url}
                productName={product.product_name}
              />
            </div>
            <div>
              <ProductSpecsCard
                isEditing={isEditing}
                formData={formData}
                onChange={handleChange}
                product={product}
              />
            </div>
          </div>
          <div>
            <ProductDescriptionCard
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
              product={product}
            />
          </div>
        </div>

        {/* Right Side: Pricing & IDs (colspan 4) */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            <ProductPricingCard
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
              product={product}
            />
          </div>
          <div>
            <ProductIdInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
