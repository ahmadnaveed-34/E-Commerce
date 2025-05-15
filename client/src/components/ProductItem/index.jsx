import React, { useContext, useEffect, useState } from "react";
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MdZoomOutMap } from "react-icons/md";
import { MyContext } from "../../App";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { deleteData, editData, postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { MdClose } from "react-icons/md";
import { IoMdClose, IoMdHeart } from "react-icons/io";

const ProductItem = (props) => {
  const [quantity, setQuantity] = useState();
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedInMyList, setIsAddedInMyList] = useState(false);
  const [cartItem, setCartItem] = useState([]);

  const [activeTab, setActiveTab] = useState(null);
  const [isShowTabs, setIsShowTabs] = useState(false);
  const [selectedTabName, setSelectedTabName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productMaxQty, setProductMaxQuantity] = useState();
  const [cartItemPrice, setCartItemPrice] = useState();
  const [cartItemId, setCartItemId] = useState();

  const context = useContext(MyContext);

  // const addToCart = (product, userId, quantity) => {
  //   if (context?.userData === null) {
  //     context?.alertBox("error", "You are not login please login first");
  //     return false;
  //   }
  //   const productItem = {
  //     _id: product?._id,
  //     name: product?.name,
  //     image: product?.images[0],
  //     rating: product?.rating,
  //     price: product?.price,
  //     oldPrice: product?.oldPrice,
  //     discount: product?.discount,
  //     quantity: quantity,
  //     subTotal: parseInt(product?.price * quantity),
  //     productId: product?._id,
  //     countInStock: product?.countInStock,
  //     brand: product?.brand,
  //     size: props?.item?.size?.length !== 0 ? selectedTabName : "",
  //     weight: props?.item?.productWeight?.length !== 0 ? selectedTabName : "",
  //     ram: props?.item?.productRam?.length !== 0 ? selectedTabName : "",
  //   };

  //   setIsLoading(true);

  //   if (
  //     props?.item?.size?.length !== 0 ||
  //     props?.item?.productRam?.length !== 0 ||
  //     props?.item?.productWeight?.length !== 0
  //   ) {
  //     setIsShowTabs(true);
  //   } else {
  //     setIsAdded(true);

  //     setIsShowTabs(false);
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 500);
  //     context?.addToCart(productItem, userId, quantity);
  //   }

  //   if (activeTab !== null) {
  //     context?.addToCart(productItem, userId, quantity);
  //     setIsAdded(true);
  //     setIsShowTabs(false);
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 500);
  //   }
  // };

  // const handleClickActiveTab = (index, name) => {
  //   setActiveTab(index);
  //   setSelectedTabName(name);
  // };

  useEffect(() => {
    const cartItem = context?.cartData?.find(
      (cart) => cart.productId === props?.item?._id
    );

    const myListItem = context?.myListData?.find(
      (item) => item.productId === props?.item?._id
    );

    const matchedItem = context?.cartData?.find(
      (c) => c.productId === props?.item?._id
    );
    if (matchedItem) {
      setProductMaxQuantity(matchedItem.countInStock);
      setCartItemPrice(matchedItem?.price);
      setCartItemId(matchedItem?._id);
    }

    if (cartItem) {
      setCartItem(cartItem);
      setIsAdded(true);
      setQuantity(cartItem?.quantity || 1);
    } else {
      setIsAdded(false);
      setQuantity(1);
    }

    setIsAddedInMyList(!!myListItem);
  }, [context?.cartData, context?.myListData]);

  const minusQty = () => {
    if (quantity !== 1 && quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(1);
    }

    if (quantity === 1) {
      deleteData(`/api/cart/delete-cart-item/${cartItem?._id}`).then((res) => {
        setIsAdded(false);
        context.alertBox("success", "Item Removed ");
        context?.getCartItems();
        setIsShowTabs(false);
        setActiveTab(null);
      });
    } else {
      const obj = {
        _id: cartItem?._id,
        qty: quantity - 1,
        subTotal: props?.item?.price * (quantity - 1),
      };

      editData(`/api/cart/update-qty`, obj).then((res) => {
        context.alertBox("success", res?.data?.message);
        context?.getCartItems();
      });
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

  const handleAddToMyList = (item) => {
    if (context?.userData === null) {
      context?.alertBox("error", "You are not login please login first");
      return false;
    } else {
      const obj = {
        productId: item?._id,
        userId: context?.userData?._id,
        productTitle: item?.name,
        image: item?.images[0],
        rating: item?.rating,
        price: item?.variantCombinations?.[0]?.discountedPrice || 0,
        oldPrice: item?.variantCombinations?.[0]?.regularPrice || 0,

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

  const handleShowVariantBox = () => {
    context?.setShowVariantModal(true);
    context?.setProductVarinatData(props?.item?.variantCombinations);
    context?.setModelProductData(props?.item);
  };

  return (
    <>
      <div className="productItem shadow-lg rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)]">
        <div className="group imgWrapper w-full overflow-hidden rounded-md relative">
          <Link to={`/product/${props?.item?._id}`}>
            <div className="img h-[200px] overflow-hidden">
              <img
                src={props?.item?.images?.[0]}
                className="w-full"
                alt="img"
              />
              {props?.item?.images?.[1] && (
                <img
                  src={props?.item?.images?.[1]}
                  className="w-full transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                  alt="img"
                />
              )}
            </div>
          </Link>

          {/* Badge showing price from first variant */}
          {props?.item?.variantCombinations?.[0] && (
            <span className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-[12px] font-medium rounded shadow-sm z-20">
              Rs. {props?.item?.variantCombinations?.[0]?.discountedPrice}
            </span>
          )}

          {/* Action Buttons */}
          <div className="actions absolute top-[-20px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
            <Button
              className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-primary hover:text-white"
              onClick={() => {
                context.handleOpenProductDetailsModal(true, props?.item);
                context?.setProductVarinatData(
                  props?.item?.variantCombinations
                );
              }}
            >
              <MdZoomOutMap className="text-[18px]" />
            </Button>
            <Button
              className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-primary hover:text-white"
              onClick={() => handleAddToMyList(props?.item)}
            >
              {isAddedInMyList ? (
                <IoMdHeart className="text-[18px] text-primary" />
              ) : (
                <FaRegHeart className="text-[18px]" />
              )}
            </Button>
          </div>
        </div>

        {/* Info Section */}
        <div className="info p-3 py-5 relative pb-[50px] h-[190px]">
          <h6 className="text-[13px] font-[400]">{props?.item?.brand}</h6>
          <h3 className="text-[12px] lg:text-[13px] font-[500] mb-1 text-black">
            <Link to={`/product/${props?.item?._id}`}>
              {props?.item?.name?.length > 30
                ? props?.item?.name.slice(0, 29) + "..."
                : props?.item?.name}
            </Link>
          </h3>

          <Rating
            name="size-small"
            defaultValue={props?.item?.rating || 0}
            size="small"
            readOnly
          />

          {/* Prices from first variant */}
          <div className="flex items-center justify-between">
            {props?.item?.variantCombinations?.[0] && (
              <>
                <span className="line-through text-gray-500 text-[12px] font-medium">
                  Rs. {props?.item?.variantCombinations[0]?.regularPrice}
                </span>
                <span className="text-primary text-[13px] font-semibold">
                  Rs. {props?.item?.variantCombinations[0]?.discountedPrice}
                </span>
              </>
            )}
          </div>

          {/* Add to cart / quantity control */}
          <div className="absolute bottom-[15px] left-0 pl-3 pr-3 w-full">
            {!isAdded ? (
              <Button
                className="btn-org addToCartBtn btn-border flex w-full btn-sm gap-1 text-[14px]"
                size="small"
                onClick={handleShowVariantBox}
              >
                <MdOutlineShoppingCart className="text-[18px]" />
                Add to Cart
              </Button>
            ) : isLoading ? (
              <Button
                className="btn-org btn-border flex w-full btn-sm gap-2"
                size="small"
              >
                <CircularProgress size={18} />
              </Button>
            ) : (
              <div className="flex items-center justify-between overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)]">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
