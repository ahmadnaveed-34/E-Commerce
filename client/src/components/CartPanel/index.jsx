import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { deleteData } from "../../utils/api";

const CartPanel = (props) => {
  const context = useContext(MyContext);

  const removeItem = (id) => {
    deleteData(`/api/cart/delete-cart-item/${id}`).then((res) => {
      context.alertBox("success", "Item Removed ");
      context?.getCartItems();
    });
  };

  return (
    <>
      <div className="scroll w-full max-h-[60vh] overflow-y-scroll overflow-x-hidden py-3 px-4">
        {props?.data?.map((item, index) => {
          return (
            <div
              key={index}
              className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4"
            >
              {/* Product Image */}
              <div
                className="img w-[25%] overflow-hidden h-[80px] rounded-md"
                onClick={context.toggleCartPanel(false)}
              >
                <Link
                  to={`/product/${item?.productId}`}
                  className="block group"
                >
                  <img
                    src={item?.variantData?.image || item?.image}
                    alt="img"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all"
                  />
                </Link>
              </div>

              {/* Product Info */}
              <div className="info w-[75%] pr-5 relative pt-3">
                <h4
                  className="text-[12px] sm:text-[14px] font-[500]"
                  onClick={context.toggleCartPanel(false)}
                >
                  <Link
                    to={`/product/${item?.productId}`}
                    className="link transition-all"
                  >
                    {item?.productTitle?.length > 20
                      ? item?.productTitle?.substr(0, 20) + "..."
                      : item?.productTitle}
                  </Link>
                </h4>

                {/* ✅ Variant Options */}
                {item?.variantData?.options && (
                  <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-gray-600">
                    {Object.entries(item.variantData.options).map(
                      ([key, val]) => (
                        <span
                          key={key}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-300"
                        >
                          {key}:{" "}
                          <strong className="text-gray-900">{val}</strong>
                        </span>
                      )
                    )}
                  </div>
                )}

                {/* Quantity & Price */}
                <p className="flex items-center gap-5 mt-2 mb-2">
                  <span className="text-[13px] sm:text-[14px]">
                    Qty: <span>{item?.quantity}</span>
                  </span>
                  <span className="text-primary font-bold">
                    {item?.variantData?.discountedPrice?.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "PKR",
                      }
                    ) ||
                      item?.price?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "PKR",
                      })}
                  </span>
                </p>

                {/* Delete Button */}
                <MdOutlineDeleteOutline
                  className="absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all"
                  onClick={() => removeItem(item?._id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <br />

      <div className="bottomSec absolute bottom-[10px] left-[10px] w-full overflow-hidden pr-5">
        <div className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">
              {context?.cartData?.length} item
            </span>
            <span className="text-primary font-bold">
              {(context.cartData?.length !== 0
                ? context.cartData
                    ?.map((item) => parseInt(item.price) * item.quantity)
                    .reduce((total, value) => total + value, 0)
                : 0
              )?.toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
              })}
            </span>
          </div>
        </div>

        <div className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">Total (tax excl.)</span>
            <span className="text-primary font-bold">
              {(context.cartData?.length !== 0
                ? context.cartData
                    ?.map((item) => parseInt(item.price) * item.quantity)
                    .reduce((total, value) => total + value, 0)
                : 0
              )?.toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
              })}
            </span>
          </div>

          <br />

          <div className="flex items-center justify-between w-full gap-5">
            <Link
              to="/cart"
              className=" w-[50%] d-block"
              onClick={context.toggleCartPanel(false)}
            >
              <Button className="btn-org btn-lg w-full">View Cart</Button>
            </Link>
            <Link
              to="/checkout"
              className=" w-[50%] d-block"
              onClick={context.toggleCartPanel(false)}
            >
              <Button className="btn-org btn-border btn-lg w-full">
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPanel;
