import React, { useContext } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { deleteData, postData } from "../../utils/api";

export const OrderSuccess = () => {
  const context = useContext(MyContext);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const user = localStorage.getItem("id");
  const address = localStorage.getItem("address");
  const amount = localStorage.getItem("amount");
  const productData = JSON.parse(localStorage.getItem("product"));

  useEffect(() => {
    if (sessionId) {
      const payLoad = {
        userId: user,
        products: productData,
        paymentId: sessionId,
        payment_status: "PAID",
        delivery_address: address,
        totalAmt: amount,
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };
      postData(`/api/order/create`, payLoad).then((res) => {
        context.alertBox("success", res?.message);

        if (res?.error === false) {
          deleteData(`/api/cart/emptyCart/${user}`).then((res) => {
            context?.getCartItems();
            localStorage.removeItem("id");
            localStorage.removeItem("address");
            localStorage.removeItem("amount");
            localStorage.removeItem("product");
          });
        } else {
          context.alertBox("error", res?.message);
          localStorage.removeItem("id");
          localStorage.removeItem("address");
          localStorage.removeItem("amount");
          localStorage.removeItem("product");
        }
      });
    }
  }, []);

  return (
    <section className="w-full p-10 py-8 lg:py-20 flex items-center justify-center flex-col gap-2">
      <img src="/checked.png" alt="img" className="w-[80px] sm:w-[120px]" />
      <h3 className="mb-0 text-[20px] sm:text-[25px]">Your order is placed</h3>
      <p className="mt-0 mb-0">Thank you for your payment.</p>
      <p className="mt-0 text-center">
        Order Invoice send to your email <b>{context?.userData?.email}</b>
      </p>

      <Link to="/">
        <Button className="btn-org btn-border">Back to home</Button>
      </Link>
    </section>
  );
};
