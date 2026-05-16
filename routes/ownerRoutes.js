import express from "express";
import {protect} from"../middleware/auth.js"
import { changeRoleToOwner, deleteCar, getDashboardData, getOwnersCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerController.js";
import { addCar } from "../controllers/ownerController.js";

import upload from "../middleware/multer.js";
 const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner)

ownerRouter.post("/add-car",protect, upload.single("image") ,addCar)
ownerRouter.get("/cars", protect, getOwnersCars)
ownerRouter.post("/toggle-car", protect, toggleCarAvailability)
ownerRouter.post("/delete-car",protect ,deleteCar);
ownerRouter.get('/dashboard',protect,getDashboardData)
ownerRouter.post(
  "/update-image",
  protect,                  // 🔥 FIRST auth
  upload.single("image"),   // 🔥 THEN file
  updateUserImage
);


export default ownerRouter;