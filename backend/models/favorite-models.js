import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
    },
    tourIds: [{ // Array of tourIds that the user has added to their favorites
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
    }],
    addedDate: {
      type: Date,
      default: Date.now, // Automatically set current date if not provided
    },
  },
  { timestamps: true }
);

export const Favorite = mongoose.model("Favorite", favoriteSchema);
