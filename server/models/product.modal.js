import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    options: {
      type: Map, // e.g. { Size: "M", Color: "Red", RAM: "8GB" }
      of: String,
      required: true,
    },
    regularPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    brand: { type: String, default: "" },

    catName: { type: String, default: "" },
    catId: { type: String, default: "" },
    subCatId: { type: String, default: "" },
    subCat: { type: String, default: "" },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    sale: { type: Number, default: 0 },

    bannerimages: [{ type: String, required: true }],
    bannerTitleName: { type: String, default: "" },
    isDisplayOnHomeBanner: { type: Boolean, default: false },

    variantCombinations: [variantSchema],
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
