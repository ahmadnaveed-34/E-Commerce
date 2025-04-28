import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDb.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import myListRouter from "./route/mylist.route.js";
import addressRouter from "./route/address.route.js";
import homeSlidesRouter from "./route/homeSlides.route.js";
import bannerV1Router from "./route/bannerV1.route.js";
import bannerList2Router from "./route/bannerList2.route.js";
import blogRouter from "./route/blog.route.js";
import orderRouter from "./route/order.route.js";
import logoRouter from "./route/logo.route.js";
import colors from "colors";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());
// app.use(morgan())
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get("/", (request, response) => {
  response.json({
    message: "Server is running " + process.env.PORT,
  });
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/myList", myListRouter);
app.use("/api/address", addressRouter);
app.use("/api/homeSlides", homeSlidesRouter);
app.use("/api/bannerV1", bannerV1Router);
app.use("/api/bannerList2", bannerList2Router);
app.use("/api/blog", blogRouter);
app.use("/api/order", orderRouter);
app.use("/api/logo", logoRouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(colors.green("Server is running on port:", process.env.PORT));
  });
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { cartItems } = req.body;

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "pkr",
        product_data: {
          name: item.productTitle,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        "http://localhost:3000/order/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/order/failed",
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});
