import express from "express";

const addressrouter = express.Router();
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAddressByIdAdmin,
  updateAddress,
} from "../controllers/address-controllers.js";

import { verifyUser } from "../middlewares/userVeriffy.js";
import { verifyAdmin } from "../middlewares/adminVerify.js";

addressrouter.get("/:id", verifyUser, getAddressById);

addressrouter.post("/:id", verifyUser, createAddress);

addressrouter.put("/:id", verifyUser, updateAddress);

addressrouter.delete("/:id", verifyUser, deleteAddress);

addressrouter.get("/admin/:id", verifyAdmin, getAddressByIdAdmin);

export default addressrouter;
