import { Schema, model, models } from "mongoose";

export type QuoteStatus = "draft" | "submitted" | "scheduled" | "closed";
export type Frequency = "one_time" | "weekly" | "biweekly" | "monthly";
export type Condition = "light" | "standard" | "heavy" | "post_construction";
export type DaySlot = "morning" | "afternoon" | "evening";

const QuoteSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["draft", "submitted", "scheduled", "closed"],
      default: "draft",
    },
    draftKey: { type: String, default: null }, // for anonymous editing
    clientId: { type: Schema.Types.ObjectId, ref: "User", default: null },

    propertyId: { type: Schema.Types.ObjectId, ref: "Property", default: null },
    propertySnapshot: {
      type: new Schema(
        {
          type: String,
          subtype: String,
          address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            zip: String,
          },
          size: { sqft: Number, beds: Number, baths: Number, rooms: Number },
        },
        { _id: false }
      ),
      default: null,
    },

    contact: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      callPrefs: {
        bestTime: {
          type: String,
          enum: ["morning", "afternoon", "evening", "any"],
          default: "any",
        },
        voicemailOK: { type: Boolean, default: true },
      },
    },

    frequency: {
      type: String,
      enum: ["one_time", "weekly", "biweekly", "monthly"],
      default: "one_time",
    },
    conditionLevel: {
      type: String,
      enum: ["light", "standard", "heavy", "post_construction"],
      default: "standard",
    },
    specialAreas: { type: [String], default: [] },
    surfaces: { type: [String], default: [] },
    targetWindow: {
      date: { type: String, default: "" },
      slot: {
        type: String,
        enum: ["morning", "afternoon", "evening"],
        default: "morning",
      },
      flexible: { type: Boolean, default: true },
    },

    photos: [
      {
        url: { type: String, required: true },
        label: { type: String, default: "" },
      },
    ],
    notes: { type: String, default: "" },

    priceEstimate: {
      currency: { type: String, default: "USD" },
      laborMinutes: { type: Number, default: null },
      baseAmount: { type: Number, default: null },
      discountAmount: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, default: null },
    },

    admin: {
      assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
      leadStatus: {
        type: String,
        enum: [
          "new",
          "called",
          "left_vm",
          "no_answer",
          "scheduled",
          "rejected",
          "closed",
        ],
        default: "new",
      },
      timeline: [
        {
          at: { type: Date, default: Date.now },
          event: { type: String },
          by: { type: Schema.Types.ObjectId, ref: "User", default: null },
          note: { type: String, default: "" },
        },
      ],
    },
  },
  { timestamps: true }
);

QuoteSchema.index({ clientId: 1, createdAt: -1 });
QuoteSchema.index({ status: 1, createdAt: -1 });
QuoteSchema.index({ draftKey: 1 }, { sparse: true });

const Quote = (models.Quote as any) || model("Quote", QuoteSchema);
export default Quote;
