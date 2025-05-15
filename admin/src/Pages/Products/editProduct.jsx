import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import UploadBox from "../../Components/UploadBox";
import axios from "axios";

import "react-lazy-load-image-component/src/effects/blur.css";
import { IoMdClose } from "react-icons/io";
import { Button } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { deleteImages, editData, fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { MdInfoOutline } from "react-icons/md";

import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Switch demo" } };

const EditProduct = () => {
  const [variants, setVariants] = useState([]);
  const [showVariants, setShowVariants] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    description: "",
    images: [],
    brand: "",
    price: "",
    oldPrice: "",
    category: "",
    catName: "",
    catId: "",
    subCatId: "",
    subCat: "",
    thirdsubCat: "",
    thirdsubCatId: "",
    stock: "",
    rating: "",
    isFeatured: false,
    discount: "",
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

  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [checkedSwitch, setCheckedSwitch] = useState(false);
  const [variantCombinations, setVariantCombinations] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const history = useNavigate();

  const context = useContext(MyContext);

  useEffect(() => {
    fetchDataFromApi(`/api/product/${context?.isOpenFullScreenPanel?.id}`).then(
      (res) => {
        const product = res?.product;

        if (product?.attributes && Array.isArray(product.attributes)) {
          setAttributes(product.attributes);
        }

        setFormFields({
          name: product?.name,
          description: product?.description,
          images: product?.images,
          brand: product?.brand,
          price: product?.price,
          oldPrice: product?.oldPrice,
          category: product?.category,
          catName: product?.catName,
          catId: product?.catId,
          subCatId: product?.subCatId,
          subCat: product?.subCat,
          thirdsubCat: product?.thirdsubCat,
          thirdsubCatId: product?.thirdsubCatId,
          stock: product?.stock,
          rating: product?.rating,
          isFeatured: product?.isFeatured,
          discount: product?.discount,
          productRam: product?.productRam,
          size: product?.size,
          productWeight: product?.productWeight,
          bannerTitleName: product?.bannerTitleName,
          bannerimages: product?.bannerimages,
          isDisplayOnHomeBanner: product?.isDisplayOnHomeBanner,
        });

        setProductCat(product?.catId);
        setProductSubCat(product?.subCatId);
        setProductFeatured(product?.isFeatured);
        setCheckedSwitch(product?.isDisplayOnHomeBanner);
        setPreviews(product?.images);
        setBannerPreviews(product?.bannerimages);

        if (
          product?.variantCombinations &&
          Array.isArray(product.variantCombinations)
        ) {
          const variants = product.variantCombinations;
          setVariantCombinations(variants);

          // 🧠 Extract unique attributes from options
          const attributeMap = {};

          variants.forEach((variant) => {
            const options = variant.options;
            if (options && typeof options === "object") {
              Object.entries(options).forEach(([key, value]) => {
                if (!attributeMap[key]) {
                  attributeMap[key] = new Set();
                }
                attributeMap[key].add(value);
              });
            }
          });

          // 🔁 Convert to array of { name, values }
          const attributeArray = Object.entries(attributeMap).map(
            ([name, values]) => ({
              name,
              values: Array.from(values),
            })
          );

          setAttributes(attributeArray); // ✅ This updates your attribute state
        }

        // ✅ Set variantCombinations correctly
        if (
          product?.variantCombinations &&
          Array.isArray(product.variantCombinations)
        ) {
          setVariantCombinations(product.variantCombinations);
        }
      }
    );
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

  const handleChangeProductFeatured = (event) => {
    setProductFeatured(event.target.value);
    formFields.isFeatured = event.target.value;
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

  const handleChangeSwitch = (event) => {
    setCheckedSwitch(event.target.checked);
    formFields.isDisplayOnHomeBanner = event.target.checked;
  };

  const handleSubmitg = (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!formFields.name?.trim()) {
      return context.alertBox("error", "Please enter product name");
    }
    if (!formFields.description?.trim()) {
      return context.alertBox("error", "Please enter product description");
    }
    if (!formFields.catId) {
      return context.alertBox("error", "Please select product category");
    }
    if (!formFields.brand?.trim()) {
      return context.alertBox("error", "Please enter product brand");
    }
    if (formFields.rating === "") {
      return context.alertBox("error", "Please enter product rating");
    }
    if (!Array.isArray(previews) || previews.length === 0) {
      return context.alertBox("error", "Please upload product images");
    }
    if (
      !Array.isArray(variantCombinations) ||
      variantCombinations.length === 0
    ) {
      return context.alertBox(
        "error",
        "Please add at least one product variant"
      );
    }

    // ✅ Clean and validate variant combinations
    const cleanedVariants = variantCombinations
      .filter(
        (v) =>
          v.options &&
          Object.keys(v.options).length > 0 &&
          v.regularPrice !== "" &&
          v.discountedPrice !== "" &&
          v.stock !== "" &&
          v.image
      )
      .map((v) => ({
        options: v.options,
        regularPrice: Number(v.regularPrice),
        discountedPrice: Number(v.discountedPrice),
        stock: Number(v.stock),
        image: typeof v.image === "string" ? v.image : v.image[0],
      }));

    if (cleanedVariants.length === 0) {
      return context.alertBox(
        "error",
        "Each variant must include options, prices, stock, and image."
      );
    }

    setIsLoading(true);

    // ✅ Final payload for update
    const finalPayload = {
      ...formFields,
      images: previews,
      bannerimages: bannerPreviews,
      variantCombinations: cleanedVariants,
      attributes, // ✅ Include new/edited attributes
    };

    const params = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    };

    // ✅ Send PUT request
    axios
      .put(
        `http://localhost:8000/api/product/updateProduct/${context?.isOpenFullScreenPanel?.id}`,
        finalPayload,
        params
      )
      .then((res) => {
        if (res?.data?.error === false) {
          context.alertBox("success", res?.data?.message);
          setTimeout(() => {
            setIsLoading(false);
            context.setIsOpenFullScreenPanel({ open: false });
            history("/products");
          }, 1000);
        } else {
          setIsLoading(false);
          context.alertBox("error", res?.data?.message);
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

  useEffect(() => {
    if (
      attributes.length === 0 ||
      attributes.some((attr) => attr.values.length === 0)
    ) {
      setVariantCombinations([]);
      return;
    }

    // Combine all possible options from current attributes
    const combine = (arr) =>
      arr.reduce(
        (acc, curr) =>
          acc.flatMap((a) =>
            curr.values.map((v) => ({ ...a, [curr.name]: v }))
          ),
        [{}]
      );

    const combos = combine(attributes);

    // 🧠 If existing combinations already match all combos, don't reset
    const alreadyHasAll = combos.every((combo) =>
      variantCombinations.some((existing) =>
        Object.entries(combo).every(([k, v]) => existing.options[k] === v)
      )
    );

    if (alreadyHasAll && variantCombinations.length >= combos.length) {
      return; // ✅ Don't reset if combinations already match
    }

    // 🧩 Build or fill combinations
    const enriched = combos.map((options) => {
      const existing = variantCombinations.find((c) =>
        Object.entries(options).every(([k, v]) => c.options[k] === v)
      );
      return (
        existing || {
          options,
          regularPrice: "",
          discountedPrice: "",
          stock: "",
          image: "",
        }
      );
    });

    setVariantCombinations(enriched);
  }, [attributes]);

  // Handlers
  const updateAttributeName = (index, value) => {
    const updated = [...attributes];
    updated[index].name = value;
    setAttributes(updated);
  };

  const updateAttributeValues = (index, value) => {
    const updated = [...attributes];
    updated[index].values = value.split(",").map((v) => v.trim());
    setAttributes(updated); // 👈 this triggers useEffect if 'attributes' is a dependency
  };

  const removeAttribute = (index) => {
    const updated = [...attributes];
    updated.splice(index, 1);
    setAttributes(updated);
    setVariantCombinations([]); // ⬅️ Force clear combinations so useEffect resets cleanly
  };

  const addAttribute = () => {
    setAttributes((prev) => [...prev, { name: "", values: [] }]);
  };

  const updateCombination = (index, field, value) => {
    const updated = [...variantCombinations];
    updated[index][field] = value;
    setVariantCombinations(updated);
  };

  const removeCombination = (index) => {
    const updated = [...variantCombinations];
    updated.splice(index, 1);
    setVariantCombinations(updated);
  };

  const resetAttributes = () => {
    fetchDataFromApi(`/api/product/${context?.isOpenFullScreenPanel?.id}`).then(
      (res) => {
        const product = res?.product;

        if (product?.attributes && Array.isArray(product.attributes)) {
          setAttributes(product.attributes);
        }

        if (
          product?.variantCombinations &&
          Array.isArray(product.variantCombinations)
        ) {
          const variants = product.variantCombinations;
          setVariantCombinations(variants);

          // 🧠 Extract unique attributes from options
          const attributeMap = {};

          variants.forEach((variant) => {
            const options = variant.options;
            if (options && typeof options === "object") {
              Object.entries(options).forEach(([key, value]) => {
                if (!attributeMap[key]) {
                  attributeMap[key] = new Set();
                }
                attributeMap[key].add(value);
              });
            }
          });

          // 🔁 Convert to array of { name, values }
          const attributeArray = Object.entries(attributeMap).map(
            ([name, values]) => ({
              name,
              values: Array.from(values),
            })
          );

          setAttributes(attributeArray); // ✅ This updates your attribute state
        }

        // ✅ Set variantCombinations correctly
        if (
          product?.variantCombinations &&
          Array.isArray(product.variantCombinations)
        ) {
          setVariantCombinations(product.variantCombinations);
        }
      }
    );
  };

  return (
    <section className="p-3 md:p-4 bg-gradient-to-b from-white to-gray-50 shadow rounded-lg">
      <form className="space-y-5" onSubmit={handleSubmitg}>
        <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-3">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 border-b pb-1">
              Product Information
            </h2>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
                placeholder="Enter product name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Product Description
              </label>
              <textarea
                name="description"
                value={formFields.description}
                onChange={onChangeInput}
                placeholder="Write product details..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:ring-1 focus:ring-blue-500 outline-none"
                rows={4}
              />
            </div>

            {/* Selects: Category, Subcategory, etc. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
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

              {/* Sub Category */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
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

              {/* Is Featured */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
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

              {/* Brand */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formFields.brand}
                  onChange={onChangeInput}
                  placeholder="e.g. Nike"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Rating</label>
              <Rating
                name="half-rating"
                value={formFields?.rating}
                onChange={onChangeRating}
                size="small"
              />
            </div>
          </div>

          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm space-y-2">
            <h2 className="text-sm font-semibold text-gray-700">
              Product Images
            </h2>
            <p className="text-xs max-w-[300px] text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 border border-blue-200 rounded">
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

          {/* Variant Manager */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-gray-700 border-b pb-2">
              Product Variant Manager
            </h2>

            {/* Attributes Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-5 mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Attributes (e.g., Size, Color)
                </h3>

                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-all duration-200"
                  onClick={resetAttributes}
                >
                  Reset Attributes
                </button>
              </div>

              {attributes.map((attr, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    className="w-1/3 border border-gray-300 px-3 py-2 rounded-md text-sm"
                    placeholder="Attribute Name"
                    value={attr.name}
                    onChange={(e) => updateAttributeName(i, e.target.value)}
                  />
                  <input
                    className="w-2/3 border border-gray-300 px-3 py-2 rounded-md text-sm"
                    placeholder="Values (comma separated)"
                    value={attr.values.join(", ")}
                    onChange={(e) => updateAttributeValues(i, e.target.value)}
                  />
                  <button
                    onClick={() => removeAttribute(i)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                type="button" // prevents form submission
                onClick={addAttribute}
                className="text-sm text-green-600 hover:underline"
              >
                + Add Attribute
              </button>
            </div>

            {/* Combinations Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-600">
                Variant Combinations
              </h3>

              {variantCombinations.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No combinations available
                </p>
              ) : (
                variantCombinations.map((combo, i) => (
                  <div
                    key={i}
                    className="border p-4 rounded-md bg-gray-50 space-y-3"
                  >
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(combo.options).map(([k, v]) => (
                        <span
                          key={k}
                          className="bg-gray-200 text-xs px-3 py-1 rounded-full"
                        >
                          {k}: {v}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="number"
                        placeholder="Regular Price"
                        value={combo.regularPrice}
                        onChange={(e) =>
                          updateCombination(i, "regularPrice", e.target.value)
                        }
                        className="border border-gray-300 px-3 py-2 rounded-md text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Discounted Price"
                        value={combo.discountedPrice}
                        onChange={(e) =>
                          updateCombination(
                            i,
                            "discountedPrice",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 px-3 py-2 rounded-md text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={combo.stock}
                        onChange={(e) =>
                          updateCombination(i, "stock", e.target.value)
                        }
                        className="border border-gray-300 px-3 py-2 rounded-md text-sm"
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="mt-2 space-y-2">
                      <UploadBox
                        single
                        name="images"
                        url="/api/product/uploadImages"
                        setPreviewsFun={(img) =>
                          updateCombination(i, "image", img)
                        }
                      />
                      {combo.image && (
                        <div className="w-20 h-20 border rounded-md overflow-hidden">
                          <img
                            src={combo.image}
                            alt="Variant"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCombination(i)}
                      className="text-red-500 text-sm"
                    >
                      Delete Variant
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* <button
                        type="button"
                        onClick={() => {
                          console.log("Attributes:", attributes);
                          console.log("Combinations:", variantCombinations);
                        }}
                        className="w-fit px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                      >
                        Save Variants
                      </button> */}
          </div>

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

export default EditProduct;
