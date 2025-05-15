import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { BsFillBagCheckFill } from "react-icons/bs";
import { MyContext } from "../../App";
import { FaPlus } from "react-icons/fa6";
import Radio from "@mui/material/Radio";
import { deleteData, postData } from "../../utils/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { loadStripe } from "@stripe/stripe-js";

const Checkout = () => {
  const [userData, setUserData] = useState(null);
  const [isChecked, setIsChecked] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState();
  const [isLoading, setIsloading] = useState(false);
  const context = useContext(MyContext);

  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );

  const history = useNavigate();
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
    setUserData(context?.userData);
    setSelectedAddress(context?.userData?.address_details[0]?._id);
  }, [context?.userData, userData]);

  useEffect(() => {
    setTotalAmount(
      context.cartData?.length !== 0
        ? context.cartData
            ?.map((item) => parseInt(item.price) * item.quantity)
            .reduce((total, value) => total + value, 0)
        : 0
    )?.toLocaleString("en-US", { style: "currency", currency: "PKR" });
  }, [context.cartData]);

  const editAddress = (id) => {
    context?.setOpenAddressPanel(true);
    context?.setAddressMode("edit");
    context?.setAddressId(id);
  };

  const handleChange = (e, index) => {
    if (e.target.checked) {
      setIsChecked(index);
      setSelectedAddress(e.target.value);
    }
  };

  const cashOnDelivery = () => {
    const user = context?.userData;
    if (context?.cartData?.length !== 0) {
      setIsloading(true);
      if (userData?.address_details?.length !== 0) {
        const payLoad = {
          userId: user?._id,
          products: context?.cartData,
          paymentId: "",
          payment_status: "CASH ON DELIVERY",
          delivery_address: selectedAddress,
          totalAmt: totalAmount,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        };

        postData(`/api/order/create`, payLoad).then((res) => {
          context.alertBox("success", res?.message);

          if (res?.error === false) {
            deleteData(`/api/cart/emptyCart/${user?._id}`).then((res) => {
              context?.getCartItems();
              setIsloading(false);
            });
          } else {
            context.alertBox("error", res?.message);
          }
          history("/order/success");
        });
      } else {
        context.alertBox("error", "Please add address");
        setIsloading(false);
      }
    } else {
      context.alertBox("error", "Add product in cart to book order");
    }
  };

  const checkout = async (e) => {
    e.preventDefault();
    if (context?.cartData?.length !== 0) {
      if (userData?.address_details?.length !== 0) {
        localStorage.setItem("address", selectedAddress);
        localStorage.setItem("amount", totalAmount);
        localStorage.setItem("id", context?.userData._id);
        localStorage.setItem("product", JSON.stringify(context?.cartData));
        const stripe = await stripePromise;
        const res = await axios.post(
          `${REACT_APP_API_URL}/api/create-checkout-session`,
          {
            cartItems: context?.cartData,
          }
        );

        const result = await stripe.redirectToCheckout({
          sessionId: res.data.id,
        });

        if (result.error) {
          context?.alertBox(result.error.message);
        }
      } else {
        context.alertBox("error", "Please add address");
        setIsloading(false);
      }
    } else {
      context.alertBox("error", "Add product in cart to book order");
    }
  };

  return (
    <section className="py-3 lg:py-10 px-3">
      <form onSubmit={checkout}>
        <div className="w-full lg:w-[90%] m-auto flex flex-col md:flex-row gap-5">
          <div className="leftCol w-full md:w-[60%]">
            <div className="card bg-white shadow-md p-5 rounded-md w-full">
              <div className="flex items-center justify-between">
                <h2>Select Delivery Address</h2>
                {userData?.address_details?.length !== 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      context?.setOpenAddressPanel(true);
                      context?.setAddressMode("add");
                    }}
                    className="btn"
                  >
                    <FaPlus />
                    ADD {context?.windowWidth < 767 ? "" : "NEW ADDRESS"}
                  </Button>
                )}
              </div>

              <br />

              <div className="flex flex-col gap-4">
                {userData?.address_details?.length !== 0 ? (
                  userData?.address_details?.map((address, index) => {
                    return (
                      <label
                        className={`flex gap-3 p-4 border border-[rgba(0,0,0,0.1)] rounded-md relative ${
                          isChecked === index && "bg-[#fff2f2]"
                        }`}
                        key={index}
                      >
                        <div>
                          <Radio
                            size="small"
                            onChange={(e) => handleChange(e, index)}
                            checked={isChecked === index}
                            value={address?._id}
                          />
                        </div>
                        <div className="info">
                          <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">
                            {address?.addressType}
                          </span>
                          <h3>{userData?.name}</h3>
                          <p className="mt-0 mb-0">
                            {address?.address_line1 +
                              " " +
                              address?.city +
                              " " +
                              address?.country +
                              " " +
                              address?.state +
                              " " +
                              address?.landmark +
                              " " +
                              "+ " +
                              address?.mobile}
                          </p>

                          <p className="mb-0 font-[500]">
                            {userData?.mobile !== null
                              ? "+" + userData?.mobile
                              : "+" + address?.mobile}
                          </p>
                        </div>

                        <Button
                          variant="text"
                          className="!absolute top-[15px] right-[15px]"
                          size="small"
                          onClick={() => editAddress(address?._id)}
                        >
                          EDIT
                        </Button>
                      </label>
                    );
                  })
                ) : (
                  <>
                    <div className="flex items-center mt-5 justify-between flex-col p-5">
                      <img src="/map.png" width="100" alt="img" />
                      <h2 className="text-center">
                        No Addresses found in your account!
                      </h2>
                      <p className="mt-0">Add a delivery address.</p>
                      <Button
                        className="btn-org"
                        onClick={() => {
                          context?.setOpenAddressPanel(true);
                          context?.setAddressMode("add");
                        }}
                      >
                        ADD ADDRESS
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="rightCol w-full  md:w-[40%]">
            <div className="card shadow-md bg-white p-5 rounded-md">
              <h2 className="mb-4">Your Order</h2>

              <div className="flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
                <span className="text-[14px] font-[600]">Product</span>
                <span className="text-[14px] font-[600]">Subtotal</span>
              </div>

              <div className="mb-5 scroll max-h-[250px] overflow-y-scroll overflow-x-hidden pr-2">
                {context?.cartData?.length !== 0 &&
                  context?.cartData?.map((item, index) => {
                    return (
                      <div
                        className="flex items-center justify-between py-2 border-b border-gray-100"
                        key={index}
                      >
                        {/* Left Side: Image + Info */}
                        <div className="part1 flex items-center gap-3">
                          <div className="img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer">
                            <img
                              src={item?.image}
                              className="w-full h-full object-cover transition-all group-hover:scale-105"
                              alt="img"
                            />
                          </div>

                          <div className="info space-y-1">
                            <h4
                              className="text-[14px] font-medium text-gray-800"
                              title={item?.productTitle}
                            >
                              {item?.productTitle?.length > 20
                                ? item?.productTitle?.substr(0, 19) + "..."
                                : item?.productTitle}
                            </h4>

                            {/* Quantity */}
                            <span className="text-[13px] text-gray-600">
                              Qty: {item?.quantity}
                            </span>
                        

                            {/* ✅ Variant Options (from variantData.options) */}
                            {item?.variantData?.options &&
                              Object.keys(item.variantData.options).length >
                                0 && (
                                <div className="flex flex-wrap gap-1 text-xs text-gray-500 mt-1">
                                  {Object.entries(item.variantData.options).map(
                                    ([key, val]) => (
                                      <span
                                        key={key}
                                        className="bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded-full"
                                      >
                                        {key}:{" "}
                                        <strong className="text-gray-900">
                                          {val}
                                        </strong>
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Price */}
                        <span className="text-[14px] font-semibold text-gray-800">
                          {(item?.quantity * item?.price)?.toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "PKR",
                            }
                          )}
                        </span>
                      </div>
                    );
                  })}
              </div>

              <div className="flex items-center flex-col gap-3 mb-2">
                <Button
                  type="submit"
                  className="btn-org btn-lg w-full flex gap-2 items-center"
                >
                  <BsFillBagCheckFill className="text-[20px]" /> Pay Now
                </Button>

                <Button
                  type="button"
                  className="btn-dark btn-lg w-full flex gap-2 items-center"
                  onClick={cashOnDelivery}
                >
                  {isLoading === true ? (
                    <CircularProgress />
                  ) : (
                    <>
                      <BsFillBagCheckFill className="text-[20px]" />
                      Cash on Delivery
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Checkout;
