import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    brand: {
      type: String,
      default: "",
    },
    catName: { type: String, default: "" },
    catId: { type: String, default: "" },
    subCatId: { type: String, default: "" },
    subCat: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    rating: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sale: {
      type: Number,
      default: 0,
    },
    bannerimages: [
      {
        type: String,
        required: true,
      },
    ],
    bannerTitleName: {
      type: String,
      default: "",
    },
    isDisplayOnHomeBanner: {
      type: Boolean,
      default: false,
    },

    variants: [
      {
        size: { type: String },
        color: { type: String },
        ram: { type: String },
        storage: { type: String },
        material: { type: String },
        weight: { type: String },
        flavour: { type: String },
        dimensions: { type: String },
        voltage: { type: String },
        regularPrice: { type: Number, required: true },
        discountedPrice: { type: Number, required: true },
        stock: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
