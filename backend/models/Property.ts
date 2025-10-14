import { Schema, model, models } from "mongoose";

export type PropertyType = "residential" | "commercial";
export type PropertySubtype =
  | "house"
  | "apartment"
  | "condo"
  | "townhome"
  | "duplex"
  | "airbnb"
  | "office"
  | "retail"
  | "restaurant"
  | "salon"
  | "warehouse"
  | "other";

const PropertySchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // the client
    type: { type: String, enum: ["residential", "commercial"], required: true },
    subtype: {
      type: String,
      enum: [
        "house",
        "apartment",
        "condo",
        "townhome",
        "duplex",
        "airbnb",
        "office",
        "retail",
        "restaurant",
        "salon",
        "warehouse",
        "other",
      ],
      required: true,
    },
    name: { type: String, default: null }, // "Home", "Office", "Airbnb #2"
    address: {
      line1: { type: String, required: true },
      line2: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      placeId: { type: String, default: "" }, // e.g., Google place_id
      geo: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
    },
    size: {
      sqft: { type: Number, default: null },
      beds: { type: Number, default: null },
      baths: { type: Number, default: null },
      rooms: { type: Number, default: null }, // for commercial
    },
    access: {
      method: {
        type: String,
        enum: ["code", "key", "onsite", "concierge", "other"],
        default: "onsite",
      },
      notes: { type: String, default: "" },
    },
    parking: {
      type: {
        type: String,
        enum: ["driveway", "street", "garage", "loading", "other"],
        default: "street",
      },
      notes: { type: String, default: "" },
    },
    pets: [{ kind: { type: String }, notes: { type: String, default: "" } }],
    preferences: {
      fragranceFree: { type: Boolean, default: false },
      noBleach: { type: Boolean, default: false },
      noAmmonia: { type: Boolean, default: false },
      supplies: {
        type: String,
        enum: ["bring_all", "customer_provides", "eco_only"],
        default: "bring_all",
      },
      notes: { type: String, default: "" },
    },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PropertySchema.index({ ownerId: 1, createdAt: -1 });

const Property = (models.Property as any) || model("Property", PropertySchema);
export default Property;
