import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { QtyBox } from "../QtyBox";
import Rating from "@mui/material/Rating";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { deleteData, editData, postData } from "../../utils/api";
import { FaCheckDouble } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";

export const ProductDetailsComponent = (props) => {
  const [productActionIndex, setProductActionIndex] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [selectedTabName, setSelectedTabName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tabError, setTabError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedInMyList, setIsAddedInMyList] = useState(false);

  const [regularPrice, setRegularPrice] = useState();
  const [discountedPrice, setDiscountedPrice] = useState();
  const [countInStock, setCountInStock] = useState();

  const [filteredVariants, setFilteredVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [productMaxQty, setProductMaxQty] = useState();
  const [cartItemPrice, setCartItemPrice] = useState();

  const [cartItemId, setCartItemId] = useState();

  useEffect(() => {
    setRegularPrice(props?.item?.variants?.[0]?.regularPrice);
    setDiscountedPrice(props?.item?.variants?.[0]?.discountedPrice);
    setCountInStock(props?.item?.variants?.[0]?.stock);
  }, []);

  const context = useContext(MyContext);

  // const handleClickActiveTab = (index, name) => {
  //   setProductActionIndex(index);
  //   setSelectedTabName(name);
  //   setRegularPrice(props?.item?.variants?.[index]?.regularPrice);
  //   setDiscountedPrice(props?.item?.variants?.[index]?.discountedPrice);
  //   setCountInStock(props?.item?.variants?.[index]?.stock);
  //   context?.setChangeProductPicIndex(index + props?.item?.images?.length);
  // };

  useEffect(() => {
    const myListItem = context?.myListData?.filter((item) =>
      item.productId.includes(props?.item?._id)
    );

    if (myListItem?.length !== 0) {
      setIsAddedInMyList(true);
    } else {
      setIsAddedInMyList(false);
    }
  }, [context?.myListData]);

  const addToCart = (product, userId, quantity) => {
    if (userId === undefined) {
      context?.alertBox("error", "you are not login please login first");
      return false;
    }

    if (filteredVariants?.length === 0 || filteredVariants?.length > 1) {
      return context?.alertBox(
        "error",
        "At least one valid product variant is required."
      );
    }

    if (filteredVariants[0]?.stock === 0) {
      return context?.alertBox("error", "Stock not available for this variant");
    }

    const productItem = {
      _id: product?._id,
      productTitle: product?.name,
      image: filteredVariants[0]?.image,
      rating: product?.rating,
      price: filteredVariants[0]?.discountedPrice,
      oldPrice: filteredVariants[0]?.regularPrice,
      quantity: 1,
      subTotal: parseInt(filteredVariants[0]?.discountedPrice * quantity),
      productId: product?._id,
      brand: product?.brand,
      countInStock: filteredVariants[0]?.stock,
      productVariantId: filteredVariants[0]?._id,
    };

    postData("/api/cart/add", productItem).then((res) => {
      if (res?.error === false) {
        context?.alertBox("success", res?.message);

        context?.getCartItems();
        setTimeout(() => {
          setIsLoading(false);
          setIsAdded(true);
        }, 500);
      } else {
        context?.alertBox("error", res?.message);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    });
  };

  const handleAddToMyList = (item) => {
    if (context?.userData === null) {
      context?.alertBox("error", "you are not login please login first");
      return false;
    } else {
      const obj = {
        productId: item?._id,
        userId: context?.userData?._id,
        productTitle: item?.name,
        image: item?.images[0],
        rating: item?.rating,
        price: item?.variants[0]?.discountedPrice,
        oldPrice: item?.variants[0]?.regularPrice,
        brand: item?.brand,
      };

      postData("/api/myList/add", obj).then((res) => {
        if (res?.error === false) {
          context?.alertBox("success", res?.message);
          setIsAddedInMyList(true);
          context?.getMyListData();
        } else {
          context?.alertBox("error", res?.message);
        }
      });
    }
  };

  const handleClickActiveTab = (key, value) => {
    const newSelected = { ...selectedVariants, [key]: value };

    // Filter variants that match all selected keys
    const filtered = props?.item?.variants?.filter((variant) =>
      Object.entries(newSelected).every(([k, v]) => variant[k] === v)
    );

    setSelectedVariants(newSelected);
    setFilteredVariants(filtered);

    setRegularPrice(filtered[0]?.regularPrice);
    setDiscountedPrice(filtered[0]?.discountedPrice);
    setCountInStock(filtered[0]?.stock);

    const variantIndex = props?.item?.variants?.findIndex((variant) =>
      Object.entries(newSelected).every(([k, v]) => variant[k] === v)
    );

    if (variantIndex !== -1) {
      context?.setChangeProductPicIndex(
        (props?.item?.images?.length || 0) + variantIndex
      );
    }
  };

  const addQty = () => {
    if (quantity < productMaxQty) {
      const newQty = quantity + 1;
      setQuantity(newQty);

      const cartObj = {
        _id: cartItemId,
        qty: newQty,
        subTotal: cartItemPrice * newQty,
      };

      editData("/api/cart/update-qty", cartObj).then((res) => {
        if (res?.data?.error === false) {
          context.alertBox("success", res?.data?.message);
          context?.getCartItems();
        }
      });
    } else {
      context.alertBox("error", "Selected quantity exceeds available stock.");
    }
  };

  const minusQty = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);

      const obj = {
        _id: cartItemId,
        qty: newQty,
        subTotal: cartItemPrice * newQty,
      };

      editData("/api/cart/update-qty", obj).then((res) => {
        context.alertBox("success", res?.data?.message);
        context?.getCartItems();
      });
    } else if (quantity === 1) {
      deleteData(`/api/cart/delete-cart-item/${cartItemId}`).then((res) => {
        setIsAdded(false);
        setQuantity(0);
        context.alertBox("success", "Item removed from cart");
        context?.getCartItems();
      });
    }
  };

  useEffect(() => {
    const item = context?.cartData?.find(
      (cartItem) => cartItem.productId === props?.item?._id
    );

    if (item) {
      setIsAdded(true);
      setCartItemId(item._id);
      setCartItemPrice(item.price);
      setProductMaxQty(item.countInStock);
      setQuantity(item.quantity);
    } else {
      setIsAdded(false);
      setQuantity(0);
    }
  }, [context?.cartData]);

  return (
    <>
      <h1 className="text-[18px] sm:text-[22px] font-[600] mb-2">
        {props?.item?.name}
      </h1>

      <div className="flex items-start sm:items-center flex-col sm:flex-row gap-3 justify-start">
        <span className="text-gray-400 text-[13px]">
          Brand:
          <span className="font-[500] text-black opacity-75 ml-1">
            {props?.item?.brand}
          </span>
        </span>

        <Rating
          name="size-small"
          value={props?.item?.rating}
          size="small"
          readOnly
        />
        <span
          className="text-[13px] cursor-pointer"
          onClick={props.gotoReviews}
        >
          Review ({props.reviewsCount})
        </span>
      </div>



      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
        <div className="flex items-center gap-4">
          <span className="oldPrice line-through text-gray-500 text-[20px] font-[500]">
            Rs.{regularPrice || 0}
          </span>
          <span className="price text-primary text-[20px] font-[600]">
            Rs.{discountedPrice || 0}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[14px]">
            In Stock:
            <span className="text-green-600 text-[14px] font-bold ml-1">
              {countInStock || 0} Items
            </span>
          </span>
        </div>
      </div>

      <p className="mt-3 pr-10 mb-5">{props?.item?.description}</p>

      {/* Dynamic Variant Rendering */}
      <div className="space-y-3">
        {[
          "size",
          "color",
          "material",
          "ram",
          "weight",
          "storage",
          "voltage",
          "flavour",
          "dimensions",
        ].map((key) => {
          const allVariants = props?.item?.variants || [];

          // Filter valid variants that match all other selected keys (except current key)
          const filteredForKey = allVariants.filter((v) =>
            Object.entries(selectedVariants).every(
              ([k, val]) => k === key || v[k] === val
            )
          );

          // Unique values for current key from filtered variants
          const validValues = [
            ...new Set(filteredForKey.map((v) => v[key]).filter(Boolean)),
          ];

          return (
            validValues.length > 0 && (
              <div key={key} className="flex items-center gap-2">
                <span className="uppercase text-sm">{key}:</span>
                {validValues.map((val, i) => {
                  // Determine if this exact value is selectable
                  const isDisabled = !allVariants.some((v) =>
                    Object.entries({ ...selectedVariants, [key]: val }).every(
                      ([k, vVal]) => v[k] === vVal
                    )
                  );

                  return (
                    <button
                      key={i}
                      disabled={isDisabled}
                      className={`px-2 py-1 rounded border 
                  ${
                    selectedVariants[key] === val
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }
                  ${
                    isDisabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
                      onClick={() =>
                        !isDisabled && handleClickActiveTab(key, val)
                      }
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            )
          );
        })}
      </div>

      {/* {(filteredVariants || []).map((v, i) => (
        <div key={i} className="mt-2 p-3 border rounded-md bg-gray-50">
          <p className="text-sm">
            Price: <strong>{v.discountedPrice}</strong>
          </p>
          <p className="text-sm">
            Stock: <strong>{v.stock}</strong>
          </p>
          <img
            src={v.image}
            alt=""
            className="w-[100px] h-[100px] object-contain mt-2"
          />
        </div>
      ))} */}

      <p className="text-[14px] mt-5 mb-2 text-[#000]">
        Free Shipping (Est. Delivery Time 2–3 Days)
      </p>

      <div className="flex items-center gap-4 py-4">
        {isAdded && (
          <div className="flex items-center justify-between overflow-hidden gap-4 rounded-full border border-[rgba(0,0,0,0.1)]">
            <Button
              className="!min-w-[35px] !w-[35px] !h-[30px] !bg-[#f1f1f1] !rounded-none"
              onClick={minusQty}
            >
              <FaMinus className="text-[rgba(0,0,0,0.7)]" />
            </Button>

            <span>{quantity}</span>
            <Button
              className="!min-w-[35px] !w-[35px] !h-[30px] !bg-gray-800 !rounded-none"
              onClick={addQty}
            >
              <FaPlus className="text-white" />
            </Button>
          </div>
        )}
        <Button
          className="btn-org flex gap-2 !min-w-[150px]"
          onClick={() =>
            addToCart(props?.item, context?.userData?._id, quantity)
          }
        >
          {isLoading ? (
            <CircularProgress />
          ) : isAdded ? (
            <>
              <FaCheckDouble /> Added
            </>
          ) : (
            <>
              <MdOutlineShoppingCart className="text-[22px]" /> Add to Cart
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <span
          className="flex items-center gap-2 text-[14px] sm:text-[15px] link cursor-pointer font-[500]"
          onClick={() => handleAddToMyList(props?.item)}
        >
          {isAddedInMyList ? (
            <IoMdHeart className="text-[18px] text-primary" />
          ) : (
            <FaRegHeart className="text-[18px] text-black" />
          )}
          Add to Wishlist
        </span>
      </div>
    </>
  );
};
