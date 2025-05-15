import React, { useContext, useEffect, useState } from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturnLight } from "react-icons/pi";
import { BsWallet2 } from "react-icons/bs";
import { LiaGiftSolid } from "react-icons/lia";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoChatboxOutline } from "react-icons/io5";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaPinterestP } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

import Drawer from "@mui/material/Drawer";
import CartPanel from "../CartPanel";
import { MyContext } from "../../App";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { ProductZoom } from "../ProductZoom";
import { IoCloseSharp } from "react-icons/io5";
import { ProductDetailsComponent } from "../ProductDetails";
import AddAddress from "../../Pages/MyAccount/addAddress";
import { IoMdClose } from "react-icons/io";
import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

const Footer = () => {
  const context = useContext(MyContext);

  const [selectedVariants, setSelectedVariants] = useState({});
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickActiveTab = (key, value) => {
    const newSelected = { ...selectedVariants, [key]: value };

    // ✅ Filter variant combinations that match all selected options
    const filtered = context?.productVariantData.filter((variant) =>
      Object.entries(newSelected).every(([k, v]) => variant.options?.[k] === v)
    );

    setSelectedVariants(newSelected);

    setFilteredVariants(filtered);

    // if (filtered?.[0]) {
    //   setRegularPrice(filtered[0].regularPrice || 0);
    //   setDiscountedPrice(filtered[0].discountedPrice || 0);
    //   setCountInStock(filtered[0].stock || 0);
    // }

    // ✅ Optional: update image index for selected variant
    const variantIndex = context?.productVariantData.findIndex((variant) =>
      Object.entries(newSelected).every(([k, v]) => variant.options?.[k] === v)
    );

    if (variantIndex !== -1) {
      context?.setChangeProductPicIndex(
        (context?.productImages?.length || 0) + variantIndex
      );
    }
  };

  useEffect(() => {
    if (context?.showVariantModal) {
      // Save current scroll position
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = `-${scrollX}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.width = "";
        window.scrollTo(scrollX, scrollY); // restore scroll
      };
    }
  }, [context?.showVariantModal]);

  const addToCart = (product, userId, quantity) => {
    setIsLoading(true);
    if (userId === undefined) {
      context?.alertBox("error", "you are not login please login first");
      return false;
    }

    if (filteredVariants?.length === 0 || filteredVariants?.length > 1) {
      context?.alertBox(
        "error",
        "At least one valid product variant is required."
      );
      return setIsLoading(false);
    }

    if (filteredVariants[0]?.stock <= 0) {
      context?.alertBox("error", "Stock not available for this variant");
      return setIsLoading(false);
    }

    const productItem = {
      _id: product?._id,
      productTitle: product?.name,
      image: filteredVariants[0]?.image,
      rating: product?.rating,
      price: filteredVariants[0]?.discountedPrice,
      oldPrice: filteredVariants[0]?.regularPrice,
      quantity: quantity,
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
          context?.setShowVariantModal(false);
          setIsLoading(false);
          setSelectedVariants({});
          setFilteredVariants([]);
        }, 300);
      } else {
        context?.alertBox("error", res?.message);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    });
  };

  return (
    <>
      <footer className="py-6 bg-[#fafafa]">
        <div className="container">
          <div className="flex items-center justify-center gap-2 py-3 lg:py-8 pb-0 lg:pb-8 px-0 lg:px-5 scrollableBox footerBoxWrap">
            <div className="col flex items-center justify-center flex-col group w-[15%]">
              <LiaShippingFastSolid className="text-[40px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1" />
              <h3 className="text-[16px] font-[600] mt-3">Free Shipping</h3>
              <p className="text-[12px] font-[500]">For all Orders Over $100</p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[15%]">
              <PiKeyReturnLight className="text-[40px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1" />
              <h3 className="text-[16px] font-[600] mt-3">30 Days Returns</h3>
              <p className="text-[12px] font-[500]">For an Exchange Product</p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[15%]">
              <BsWallet2 className="text-[40px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1" />
              <h3 className="text-[16px] font-[600] mt-3">Secured Payment</h3>
              <p className="text-[12px] font-[500]">Payment Cards Accepted</p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[15%]">
              <LiaGiftSolid className="text-[40px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1" />
              <h3 className="text-[16px] font-[600] mt-3">Special Gifts</h3>
              <p className="text-[12px] font-[500]">Our First Product Order</p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[15%]">
              <BiSupport className="text-[40px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1" />
              <h3 className="text-[16px] font-[600] mt-3">Support 24/7</h3>
              <p className="text-[12px] font-[500]">Contact us Anytime</p>
            </div>
          </div>
          <br />

          <hr />

          <div className="footer flex px-3 lg:px-0 flex-col lg:flex-row py-5">
            <div className="part1 w-full lg:w-[25%] border-r border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[18px] font-[600] mb-4">Contact us</h2>
              <p className="text-[13px] font-[400] pb-4">
                Mega Mart
                <br />
                507-Gulberg Trade Centre, Gulberg III, Lahore
              </p>

              <Link
                className="link text-[13px]"
                to="mailto:someone@example.com"
              >
                sales@megamart.com
              </Link>

              <span className="text-[22px] font-[600] block w-full mt-3 mb-5 text-primary">
                (+92) 3214141320
              </span>
            </div>

            <div className="part2 w-full lg:w-[40%] flex pl-0 lg:pl-8 mt-5 lg:mt-0">
              <div className="part2_col1 w-[50%]">
                <h2 className="text-[18px] font-[600] mb-4">Navigation</h2>
                <ul className="list">
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link hover:text-primary">
                      Home
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/my-orders" className="link hover:text-primary">
                      Orders
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/my-list" className="link hover:text-primary">
                      Wishlist
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/cart" className="link hover:text-primary">
                      Cart
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="part2_col2 w-[50%]">
                <h2 className="text-[18px] font-[600] mb-4">Store Info</h2>
                <ul className="list">
                  <li className="list-none text-[14px] w-full mb-2 text-gray-700">
                    We offer 24/7 customer support for all your shopping needs.
                  </li>
                  <li className="list-none text-[14px] w-full mb-2 text-gray-700">
                    All transactions are encrypted and secured.
                  </li>
                  <li className="list-none text-[14px] w-full mb-2 text-gray-700">
                    Fast delivery across Pakistan – typically 2-4 business days.
                  </li>
                </ul>
              </div>
            </div>
            <div className="part2 w-full lg:w-[35%] flex pl-0 lg:pl-8 flex-col pr-8 mt-5 lg:mt-0">
              <div className="mb-2">
                <h2 className="text-[18px] font-[600] mb-2">Special Offers</h2>
                <p className="text-[13px]">
                  Limited time deals – save big on top categories this week
                  only!
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-[18px] font-[600] mb-2">Trending Now</h2>
                <p className="text-[13px]">
                  Explore the most popular items customers are loving right now.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="bottomStrip border-t border-[rgba(0,0,0,0.1)] pt-3 pb-[100px] lg:pb-3 bg-white">
        <div className="container flex items-center justify-between flex-col lg:flex-row gap-4 lg:gap-0">
          <ul className="flex items-center gap-2">
            <li className="list-none">
              <a
                href="https://facebook.com"
                rel="noreferrer"
                target="_blank"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-primary transition-all"
              >
                <FaFacebookF className="text-[17px] group-hover:text-white" />
              </a>
            </li>

            <li className="list-none">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-primary transition-all"
              >
                <AiOutlineYoutube className="text-[21px] group-hover:text-white" />
              </a>
            </li>

            <li className="list-none">
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-primary transition-all"
              >
                <FaPinterestP className="text-[17px] group-hover:text-white" />
              </a>
            </li>

            <li className="list-none">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-primary transition-all"
              >
                <FaInstagram className="text-[17px] group-hover:text-white" />
              </a>
            </li>
          </ul>

          <p className="text-[13px] text-center mb-0">
            © 2025 Mega Mart. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            <img src="/carte_bleue.png" alt="img" />
            <img src="/visa.png" alt="img" />
            <img src="/master_card.png" alt="img" />
            <img src="/american_express.png" alt="img" />
            <img src="/paypal.png" alt="img" />
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <Drawer
        open={context.openCartPanel}
        onClose={context.toggleCartPanel(false)}
        anchor={"right"}
        className="cartPanel"
      >
        <div className="flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.1)] overflow-hidden">
          <h4>Shopping Cart ({context?.cartData?.length})</h4>
          <IoCloseSharp
            className="text-[20px] cursor-pointer"
            onClick={context.toggleCartPanel(false)}
          />
        </div>

        {context?.cartData?.length !== 0 ? (
          <CartPanel data={context?.cartData} />
        ) : (
          <>
            <div className="flex items-center justify-center flex-col pt-[100px] gap-5">
              <img src="/empty-cart.png" alt="img" className="w-[150px]" />
              <h4>Your Cart is currently empty</h4>
              <Button
                className="btn-org btn-sm"
                onClick={context.toggleCartPanel(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </Drawer>

      {/* Address Panel */}
      <Drawer
        open={context.openAddressPanel}
        onClose={context.toggleAddressPanel(false)}
        anchor={"right"}
        className="addressPanel"
      >
        <div className="flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.1)] overflow-hidden">
          <h4>
            {context?.addressMode === "add" ? "Add" : "Edit"} Delivery Address{" "}
          </h4>
          <IoCloseSharp
            className="text-[20px] cursor-pointer"
            onClick={context.toggleAddressPanel(false)}
          />
        </div>

        <div className="w-full max-h-[100vh] overflow-auto">
          <AddAddress />
        </div>
      </Drawer>

      <Dialog
        open={context?.openProductDetailsModal.open}
        fullWidth={context?.fullWidth}
        maxWidth={context?.maxWidth}
        onClose={context?.handleCloseProductDetailsModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="productDetailsModal"
      >
        <DialogContent>
          <div className="flex items-center w-full productDetailsModalContainer relative">
            <Button
              className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[15px] right-[15px] !bg-[#f1f1f1]"
              onClick={context?.handleCloseProductDetailsModal}
            >
              <IoCloseSharp className="text-[20px]" />
            </Button>
            {context?.openProductDetailsModal?.item?.length !== 0 && (
              <>
                <div className="col1 w-[40%] px-3 py-8">
                  <ProductZoom
                    images={context?.openProductDetailsModal?.item?.images}
                    variantImages={
                      context?.openProductDetailsModal?.item
                        ?.variantCombinations
                    }
                  />
                </div>

                <div className="col2 w-[60%] py-8 px-8 pr-16 productContent">
                  <ProductDetailsComponent
                    item={context?.openProductDetailsModal?.item}
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {context?.showVariantModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white w-[95%] max-w-md rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-fadeIn relative">
            {/* Close Button */}
            <button
              onClick={() => {
                context?.setShowVariantModal(false);
                setSelectedVariants({});
                setFilteredVariants([]);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
            >
              <IoMdClose className="text-2xl" />
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Choose Product Variant
            </h2>

            {/* Variant Selectors */}

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {[
                ...new Set(
                  context?.productVariantData?.flatMap((v) =>
                    Object.keys(v.options || {})
                  )
                ),
              ].map((key) => {
                const values = [
                  ...new Set(
                    context?.productVariantData
                      .map((v) => v.options?.[key])
                      .filter(Boolean)
                  ),
                ];

                return (
                  values.length > 0 && (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {values.map((val, i) => (
                          <button
                            key={i}
                            onClick={() => handleClickActiveTab(key, val)}
                            className={`px-3 py-1.5 rounded-full border text-sm transition 
                ${
                  selectedVariants[key] === val
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                );
              })}
            </div>

            {/* Price + Stock */}

            {filteredVariants?.[0] && (
              <div className="mt-6 border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Regular Price:</span>
                  <span className="font-semibold line-through text-red-500">
                    Rs.{" "}
                    {filteredVariants[0]?.regularPrice?.toLocaleString() || 0}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>Discounted Price:</span>
                  <span className="font-bold text-green-600">
                    Rs.{" "}
                    {filteredVariants[0]?.discountedPrice?.toLocaleString() ||
                      0}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>Stock Available:</span>
                  <span className="font-semibold text-gray-800">
                    {filteredVariants[0]?.stock ?? 0} item
                    {filteredVariants[0]?.stock === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <div className="mt-6">
              <Button
                className={`
      !w-full 
      !py-3 
      !rounded-lg 
      !font-semibold 
      !text-white 
      !transition 
      !duration-300 
      !ease-in-out 
      !flex items-center !justify-center
      ${
        filteredVariants?.length < 1
          ? "!bg-gray-300 !cursor-not-allowed"
          : "!bg-primary hover:!bg-red-600 hover:!scale-[1.02] !shadow-md"
      }
    `}
                onClick={() => {
                  addToCart(
                    context?.modelProductData,
                    context?.userData?._id,
                    1
                  );
                }}
                disabled={filteredVariants?.length < 1}
              >
                {isLoading === false ? (
                  <span className="tracking-wide">
                    🛒 Confirm & Add to Cart
                  </span>
                ) : (
                  <CircularProgress color="inherit" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
