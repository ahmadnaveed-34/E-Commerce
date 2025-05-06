import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import UploadBox from "../../Components/UploadBox";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoMdClose } from "react-icons/io";
import { Button } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { deleteImages, fetchDataFromApi, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import { MdInfoOutline } from "react-icons/md";
import axios from "axios";

const label = { inputProps: { "aria-label": "Switch demo" } };

const AddProduct = () => {
  const [variants, setVariants] = useState([]);

  const [formFields, setFormFields] = useState({
    name: "",
    description: "",
    images: [],
    brand: "",
    category: "",
    catName: "",
    catId: "",
    subCatId: "",
    subCat: "",
    rating: "",
    isFeatured: false,
    productRam: [],
    size: [],
    productWeight: [],
    bannerTitleName: "",
    bannerimages: [],
    isDisplayOnHomeBanner: false,
  });

  const [productCat, setProductCat] = React.useState("");
  const [productSubCat, setProductSubCat] = React.useState("");
  const [productFeatured, setProductFeatured] = React.useState("");
  const [productRams, setProductRams] = React.useState([]);
  const [productRamsData, setProductRamsData] = React.useState([]);
  const [productWeight, setProductWeight] = React.useState([]);
  const [productWeightData, setProductWeightData] = React.useState([]);
  const [productSize, setProductSize] = React.useState([]);
  const [productSizeData, setProductSizeData] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [productThirdLavelCat, setProductThirdLavelCat] = useState("");

  const [previews, setPreviews] = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [variantImagePreviews, setVariantImagesPreviews] = useState([]);

  const [checkedSwitch, setCheckedSwitch] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  const history = useNavigate();

  const context = useContext(MyContext);

  useEffect(() => {
    fetchDataFromApi("/api/product/productRAMS/get").then((res) => {
      if (res?.error === false) {
        setProductRamsData(res?.data);
      }
    });

    fetchDataFromApi("/api/product/productWeight/get").then((res) => {
      if (res?.error === false) {
        setProductWeightData(res?.data);
      }
    });

    fetchDataFromApi("/api/product/productSize/get").then((res) => {
      if (res?.error === false) {
        setProductSizeData(res?.data);
      }
    });
  }, []);

  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
    formFields.catId = event.target.value;
    formFields.category = event.target.value;
  };

  const selectCatByName = (name) => {
    formFields.catName = name;
  };

  const handleChangeProductSubCat = (event) => {
    setProductSubCat(event.target.value);
    formFields.subCatId = event.target.value;
  };

  const selectSubCatByName = (name) => {
    formFields.subCat = name;
  };

  const handleChangeProductThirdLavelCat = (event) => {
    setProductThirdLavelCat(event.target.value);
    formFields.thirdsubCatId = event.target.value;
  };

  const selectSubCatByThirdLavel = (name) => {
    formFields.thirdsubCat = name;
  };

  const handleChangeProductFeatured = (event) => {
    setProductFeatured(event.target.value);
    formFields.isFeatured = event.target.value;
  };

  const handleChangeProductRams = (event) => {
    const {
      target: { value },
    } = event;
    setProductRams(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    formFields.productRam = value;
  };

  const handleChangeProductWeight = (event) => {
    const {
      target: { value },
    } = event;
    setProductWeight(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    formFields.productWeight = value;
  };

  const handleChangeProductSize = (event) => {
    const {
      target: { value },
    } = event;
    setProductSize(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    formFields.size = value;
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const onChangeRating = (e) => {
    setFormFields((formFields) => ({
      ...formFields,
      rating: e.target.value,
    }));
  };

  const setPreviewsFun = (previewsArr) => {
    const imgArr = previews;
    for (let i = 0; i < previewsArr.length; i++) {
      imgArr.push(previewsArr[i]);
    }

    setPreviews([]);
    setTimeout(() => {
      setPreviews(imgArr);
      formFields.images = imgArr;
    }, 10);
  };

  const setVariantPreviewsFun = (previewsArr, index) => {
    const imageUrl = previewsArr[0]; // assuming one image per variant

    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], image: imageUrl };
      return updated;
    });
  };

  const setBannerImagesFun = (previewsArr) => {
    const imgArr = bannerPreviews;
    for (let i = 0; i < previewsArr.length; i++) {
      imgArr.push(previewsArr[i]);
    }

    setBannerPreviews([]);
    setTimeout(() => {
      setBannerPreviews(imgArr);
      formFields.bannerimages = imgArr;
    }, 10);
  };

  const removeImg = (image, index) => {
    var imageArr = [];
    imageArr = previews;
    deleteImages(`/api/category/deteleImage?img=${image}`).then((res) => {
      imageArr.splice(index, 1);

      setPreviews([]);
      setTimeout(() => {
        setPreviews(imageArr);
        formFields.images = imageArr;
      }, 100);
    });
  };

  const removeBannerImg = (image, index) => {
    var imageArr = [];
    imageArr = bannerPreviews;
    deleteImages(`/api/category/deteleImage?img=${image}`).then((res) => {
      imageArr.splice(index, 1);

      setBannerPreviews([]);
      setTimeout(() => {
        setBannerPreviews(imageArr);
        formFields.bannerimages = imageArr;
      }, 100);
    });
  };

  const removeVariantImage = (index) => {
    const img = variants[index].image;

    if (!img) return;

    deleteImages(`/api/category/deteleImage?img=${img}`).then((res) => {
      const updatedVariants = [...variants];
      updatedVariants[index].image = "";
      setVariants(updatedVariants);
    });
  };

  const handleChangeSwitch = (event) => {
    setCheckedSwitch(event.target.checked);
    formFields.isDisplayOnHomeBanner = event.target.checked;
  };

  const handleSubmitg = (e) => {
    e.preventDefault(0);

    if (formFields.name === "") {
      context.alertBox("error", "Please enter product name");
      return false;
    }

    if (formFields.description === "") {
      context.alertBox("error", "Please enter product description");
      return false;
    }

    if (formFields?.catId === "") {
      context.alertBox("error", "Please select product category");
      return false;
    }

    if (formFields?.brand === "") {
      context.alertBox("error", "Please enter product brand");
      return false;
    }

    if (formFields?.rating === "") {
      context.alertBox("error", "Please enter  product rating");
      return false;
    }

    if (variants?.length < 1) {
      context.alertBox("error", "Please sdd add at least one product variant.");
      return false;
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Please select product images");
      return false;
    }

    setIsLoading(true);

    const cleanedVariants = variants.filter(
      (v) => v.stock && v.image && v.regularPrice && v.discountedPrice
    );

    const finalPayload = {
      ...formFields,
      variants: cleanedVariants,
    };

    const params = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post("http://localhost:8000/api/product/create", finalPayload, params)
      .then((res) => {
        if (res?.data?.error === false) {
          context.alertBox("success", res.data.message);
          setTimeout(() => {
            setIsLoading(false);
            context.setIsOpenFullScreenPanel({ open: false });
            history("/products");
          }, 1000);
        } else {
          setIsLoading(false);
          context.alertBox(
            "error",
            res?.data?.message || "Something went wrong"
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        context.alertBox(
          "error",
          err?.response?.data?.message || "Server error"
        );
      });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const addVariant = () => {
    const lastVariant = variants[variants.length - 1];

    // Prevent adding another if last one is incomplete
    if (
      lastVariant &&
      (!lastVariant.stock ||
        !lastVariant.image ||
        !lastVariant.regularPrice ||
        !lastVariant.discountedPrice)
    ) {
      return context.alertBox(
        "error",
        "Please complete all required fields: Stock, Regular Price, Discounted Price, and Image."
      );
    }

    setVariants([
      ...variants,
      {
        size: "",
        color: "",
        ram: "",
        storage: "",
        material: "",
        weight: "",
        flavour: "",
        dimensions: "",
        voltage: "",
        regularPrice: "",
        discountedPrice: "",
        stock: "",
        image: "",
      },
    ]);
  };

  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  const toggleVariantForm = () => {
    if (!showVariants && variants.length === 0) {
      addVariant();
    }
    setShowVariants(!showVariants);
  };

  return (
    <section className="p-3 md:p-4 bg-gradient-to-b from-white to-gray-50 shadow rounded-lg">
      <form className="space-y-5" onSubmit={handleSubmitg}>
        <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-3">
          {/* Product Info */}
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 border-b pb-1">
              Product Information
            </h2>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
                placeholder="Enter product name"
                className="w-full h-[34px] border border-gray-300 rounded-md px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Product Description
              </label>
              <textarea
                name="description"
                value={formFields.description}
                onChange={onChangeInput}
                placeholder="Write product details..."
                className="w-full h-[80px] border border-gray-300 rounded-md px-2 py-1 text-xs resize-none focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Category
                </label>
                <Select
                  size="small"
                  className="w-full"
                  value={productCat}
                  onChange={handleChangeProductCat}
                >
                  {context?.catData?.map((cat, i) => (
                    <MenuItem
                      key={i}
                      value={cat._id}
                      onClick={() => selectCatByName(cat.name)}
                    >
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Sub Category
                </label>
                <Select
                  size="small"
                  className="w-full"
                  value={productSubCat}
                  onChange={handleChangeProductSubCat}
                >
                  {context?.catData?.flatMap((cat) =>
                    cat.children?.map((sub, idx) => (
                      <MenuItem
                        key={idx}
                        value={sub._id}
                        onClick={() => selectSubCatByName(sub.name)}
                      >
                        {sub.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Is Featured?
                </label>
                <Select
                  size="small"
                  className="w-full"
                  value={productFeatured}
                  onChange={handleChangeProductFeatured}
                >
                  <MenuItem value={true}>True</MenuItem>
                  <MenuItem value={false}>False</MenuItem>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formFields.brand}
                  onChange={onChangeInput}
                  placeholder="e.g. Nike"
                  className="w-full h-[34px] border border-gray-300 rounded-md px-2 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Rating</label>
              <Rating
                name="half-rating"
                defaultValue={1}
                onChange={onChangeRating}
                size="small"
              />
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm space-y-2">
            <h2 className="text-sm font-semibold text-gray-700">
              Product Images
            </h2>
            <p className="text-xs text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 border border-blue-200 rounded">
              <MdInfoOutline className="text-base" />
              Use <strong>1512×1920</strong> or <strong>540×720</strong> or{" "}
              <strong>1130×1500</strong>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {previews.map((img, i) => (
                <div key={i} className="relative">
                  <span
                    onClick={() => removeImg(img, i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <IoMdClose />
                  </span>
                  <div className="h-[150px] w-[100%] bg-gray-100 border border-dashed rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src={img}
                      alt={`img-${i}`}
                      className="object-contain h-full"
                    />
                  </div>
                </div>
              ))}
              <UploadBox
                multiple
                name="images"
                url="/api/product/uploadImages"
                setPreviewsFun={setPreviewsFun}
              />
            </div>
          </div>

          {/* Variant Toggle Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Product Variants
            </h2>
            <button
              type="button"
              onClick={toggleVariantForm}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-3 py-1 rounded flex items-center gap-1"
            >
              {showVariants ? "Hide" : "Add"} Variants
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 transition-transform ${
                  showVariants ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Variants */}
          {showVariants && (
            <div className="space-y-4">
              {variants.map((variant, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 md:p-5 rounded-xl shadow space-y-3 border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Variant {idx + 1}
                    </h3>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="w-9 h-9 text-xl flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 shadow transition duration-200"
                        title="Remove Variant"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {[
                      ["size", "Size"],
                      ["color", "Color"],
                      ["ram", "RAM"],
                      ["storage", "Storage"],
                      ["material", "Material"],
                      ["weight", "Weight"],
                      ["flavour", "Flavour"],
                      ["dimensions", "Dimensions"],
                      ["voltage", "Voltage"],
                      ["regularPrice", "Regular Price *"],
                      ["discountedPrice", "Discounted Price *"],
                      ["stock", "Stock *"],
                    ].map(([field, label]) => (
                      <div key={field}>
                        <label
                          htmlFor={`${field}-${idx}`}
                          className="block text-[11px] text-gray-600 mb-1"
                        >
                          {label}
                        </label>
                        <input
                          type={
                            [
                              "regularPrice",
                              "discountedPrice",
                              "stock",
                            ].includes(field)
                              ? "number"
                              : "text"
                          }
                          id={`${field}-${idx}`}
                          name={field}
                          placeholder={label}
                          value={variant[field]}
                          onChange={(e) => handleChange(e, idx)}
                          className="w-full h-[34px] border border-gray-300 rounded-md px-2 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    {variant.image && (
                      <div className="relative w-[100px] h-[100px] shrink-0">
                        <span
                          onClick={() => removeVariantImage(idx)}
                          className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 text-[10px] rounded-full flex items-center justify-center cursor-pointer"
                        >
                          <IoMdClose />
                        </span>
                        <div className="w-full h-full border border-dashed rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={variant.image}
                            alt={`img-${idx}`}
                            className="object-contain h-full"
                          />
                        </div>
                      </div>
                    )}

                    <div className="w-[100px] h-[100px] shrink-0 border border-dashed rounded-md bg-white hover:bg-gray-100 transition flex items-center justify-center overflow-hidden">
                      <div className="flex flex-col items-center justify-center text-[10px] text-gray-600 leading-tight text-center">
                        <UploadBox
                          name="images"
                          url="/api/product/uploadImages"
                          setPreviewsFun={(arr) =>
                            setVariantPreviewsFun(arr, idx)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-right">
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Variant
                </button>
              </div>
            </div>
          )}

          {/* Banner Section */}
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-gray-700">
                Banner Images
              </h2>
              <Switch
                {...label}
                onChange={handleChangeSwitch}
                checked={checkedSwitch}
                disabled={bannerPreviews?.length === 0}
              />
            </div>

            <p className="text-xs text-blue-600">
              Recommended: <strong>1080 × 660</strong>
            </p>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {bannerPreviews.map((img, i) => (
                <div key={i} className="relative">
                  <span
                    onClick={() => removeBannerImg(img, i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <IoMdClose />
                  </span>
                  <div className="h-[150px] bg-gray-100 border border-dashed rounded-md flex items-center justify-center overflow-hidden">
                    <img src={img} className="object-contain h-full" />
                  </div>
                </div>
              ))}
              <UploadBox
                multiple
                name="bannerimages"
                url="/api/product/uploadBannerImages"
                setPreviewsFun={setBannerImagesFun}
              />
            </div>

            <label className="block text-xs font-medium text-gray-700 mt-1">
              Banner Title
            </label>
            <input
              type="text"
              className="w-full h-[34px] border border-gray-300 rounded-md px-2 text-xs focus:ring-1 focus:ring-blue-500"
              name="bannerTitleName"
              value={formFields.bannerTitleName}
              onChange={onChangeInput}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            className="btn-blue btn-md w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <>
                <FaCloudUploadAlt className="text-base" />
                Publish and View
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddProduct;
