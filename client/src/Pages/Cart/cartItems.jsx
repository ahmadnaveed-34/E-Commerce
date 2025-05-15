import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { GoTriangleDown } from "react-icons/go";
import Rating from "@mui/material/Rating";
import { IoCloseSharp } from "react-icons/io5";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import { Button } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa6";

const CartItems = (props) => {
  const [sizeanchorEl, setSizeAnchorEl] = useState(null);
  const [selectedSize, setCartItems] = useState(props.selected);
  const openSize = Boolean(sizeanchorEl);
  const [quantity, setQuantity] = useState();

  const [qtyanchorEl, setQtyAnchorEl] = useState(null);
  const [selectedQty, setSelectedQty] = useState(props.qty);
  const openQty = Boolean(qtyanchorEl);

  const [productMaxQty, setProductMaxQuantity] = useState();
  const [productSizes, setProductSizes] = useState([]);

  const numbers = Array.from(
    { length: 20 },
    () => Math.floor(Math.random() * 10) + 1
  );

  const context = useContext(MyContext);

  const handleClickSize = (event) => {
    setSizeAnchorEl(event.currentTarget);
  };
  const handleCloseSize = (value) => {
    setSizeAnchorEl(null);
    if (value !== null) {
      setCartItems(value);
    }
  };

  const handleClickQty = (event) => {
    setQtyAnchorEl(event.currentTarget);
  };
  const handleCloseQty = (value) => {
    setQtyAnchorEl(null);
    if (value !== null) {
      setSelectedQty(value);

      const cartObj = {
        _id: props?.item?._id,
        qty: value,
        subTotal: props?.item?.price * value,
      };

      editData("/api/cart/update-qty", cartObj).then((res) => {
        if (res?.data?.error === false) {
          context.alertBox("success", res?.data?.message);
          context?.getCartItems();
        }
      });
    }
  };

  const updateCart = (selectedVal, qty, field) => {
    handleCloseSize(selectedVal);

    const cartObj = {
      _id: props?.item?._id,
      qty: qty,
      subTotal: props?.item?.price * qty,
      size: props?.item?.size !== "" ? selectedVal : "",
      weight: props?.item?.weight !== "" ? selectedVal : "",
      ram: props?.item?.ram !== "" ? selectedVal : "",
    };

    //if product size available
    if (field === "size") {
      fetchDataFromApi(`/api/product/${props?.item?.productId}`).then((res) => {
        const product = res?.product;

        const item = product?.size?.filter((size) =>
          size?.includes(selectedVal)
        );

        if (item?.length !== 0) {
          editData("/api/cart/update-qty", cartObj).then((res) => {
            if (res?.data?.error === false) {
              context.alertBox("success", res?.data?.message);
              context?.getCartItems();
            }
          });
        } else {
          context.alertBox(
            "error",
            `Product not available with the size of ${selectedVal}`
          );
        }
      });
    }

    //if product weight available
    if (field === "weight") {
      fetchDataFromApi(`/api/product/${props?.item?.productId}`).then((res) => {
        const product = res?.product;

        const item = product?.productWeight?.filter((weight) =>
          weight?.includes(selectedVal)
        );

        if (item?.length !== 0) {
          editData("/api/cart/update-qty", cartObj).then((res) => {
            if (res?.data?.error === false) {
              context.alertBox("success", res?.data?.message);
              context?.getCartItems();
            }
          });
        } else {
          context.alertBox(
            "error",
            `Product not available with the weight of ${selectedVal}`
          );
        }
      });
    }

    //if product ram available
    if (field === "ram") {
      fetchDataFromApi(`/api/product/${props?.item?.productId}`).then((res) => {
        const product = res?.product;

        const item = product?.productRam?.filter((ram) =>
          ram?.includes(selectedVal)
        );

        if (item?.length !== 0) {
          editData("/api/cart/update-qty", cartObj).then((res) => {
            if (res?.data?.error === false) {
              context.alertBox("success", res?.data?.message);
              context?.getCartItems();
            }
          });
        } else {
          context.alertBox(
            "error",
            `Product not available with the ram of ${selectedVal}`
          );
        }
      });
    }
  };

  useEffect(() => {
    // fetchDataFromApi(`/api/product/${props?.item?.productId}`).then((res) => {
    //   if (res?.error !== true) {
    //     setProductMaxQuantity(res?.product?.countInStock);
    //   }
    // });
    setQuantity(props?.item?.quantity);
    setProductMaxQuantity(props?.item?.countInStock);
  }, []);

  const removeItem = (id) => {
    deleteData(`/api/cart/delete-cart-item/${id}`).then((res) => {
      context.alertBox("success", "Product removed from cart");
      context?.getCartItems();
    });
  };

  const addQty = () => {
    if (productMaxQty > quantity) {
      setQuantity(quantity + 1);

      const cartObj = {
        _id: props?.item?._id,
        qty: quantity + 1,
        subTotal: props?.item?.price * quantity + 1,
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
    if (quantity !== 1 && quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(1);
    }

    if (quantity === 1) {
      return false;
    } else {
      const cartObj = {
        _id: props?.item?._id,
        qty: quantity - 1,
        subTotal: props?.item?.price * quantity + 1,
      };

      editData(`/api/cart/update-qty`, cartObj).then((res) => {
        context.alertBox("success", res?.data?.message);
        context?.getCartItems();
      });
    }
  };

  return (
    <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)]">
      <div className="img w-[30%] sm:w-[20%] lg:w-[15%] rounded-md overflow-hidden">
        <Link to={`/product/${props?.item?.productId}`} className="group">
          <img
            src={props?.item?.image}
            className="w-full group-hover:scale-105 transition-all"
            alt="img"
          />
        </Link>
      </div>

      <div className="info  w-[70%]  sm:w-[80%]  lg:w-[85%] relative">
        <IoCloseSharp
          className="cursor-pointer absolute top-[0px] right-[0px] text-[22px] link transition-all"
          onClick={() => removeItem(props?.item?._id)}
        />
        <span className="text-[13px]">{props?.item?.brand}</span>
        <h3 className="text-[13px] sm:text-[15px] w-[80%]">
          <Link to={`/product/${props?.item?.productId}`} className="link">
            {props?.item?.productTitle?.substr(
              0,
              context?.windowWidth < 992 ? 30 : 120
            )}
            {context?.windowWidth < 992 &&
              props?.item?.productTitle?.length > 30 &&
              "..."}

            {context?.windowWidth > 992 &&
              props?.item?.productTitle?.length > 120 &&
              "..."}
          </Link>
        </h3>

        <Rating
          name="size-small"
          value={props?.item?.rating}
          size="small"
          readOnly
        />

        {/* Variant Options */}
        {props?.item?.variantData?.options && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
            {Object.entries(props?.item?.variantData.options).map(([k, v]) => (
              <span
                key={k}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-300"
              >
                {k}: <strong className="text-gray-900">{v}</strong>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-2">
          <div className="relative">
            <div className="flex items-center justify-between overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)] gap-2">
              <Button
                className="!min-w-[25px] !w-[25px] !h-[25px] !bg-[#f1f1f1]  !rounded-none"
                onClick={minusQty}
              >
                <FaMinus className="text-[rgba(0,0,0,0.7)]" />
              </Button>
              <span>{quantity}</span>
              <Button
                className="!min-w-[25px] !w-[25px] !h-[25px] !bg-gray-800 !rounded-none"
                onClick={addQty}
              >
                <FaPlus className="text-white" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <span className="price text-[14px]  font-[600]">
            Rs.{props?.item?.price}
          </span>

          <span className="oldPrice line-through text-gray-500 text-[14px] font-[500]">
            Rs.{props?.item?.oldPrice}
          </span>

          {/* <span className="price text-primary text-[14px]  font-[600]">
            {props?.item?.discount}% OFF
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
