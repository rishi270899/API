const express = require("express");
const TeacherController = require("../controllers/TeacherController");
const userController = require("../controllers/userController");
const route = express.Router();
const { ChangeUserAuth } = require("../middleware/auth");
const categoryController = require("../controllers/categoryController");
const TenderController = require("../controllers/TenderController");

//route
//http://localhost:4000/api/teacherDisplay
route.get("/teacherdisplay", TeacherController.display);

//usercontroller
route.get("/getAllUser", ChangeUserAuth, userController.getAllUser);
route.post("/userInsert", userController.registerUser);
route.post("/loginUser", userController.loginUser);
route.get("/logout", userController.logout);
route.post("/updatePassword", ChangeUserAuth, userController.updatePassword);
route.get("/admin/getUser/:id", userController.getSingleUser);
route.get("/admin/getUser/:id", userController.getAllUser);
route.get("/me", ChangeUserAuth, userController.getUserDetail);
route.delete("/admin/deleteUser/:id", userController.deleteUser);

//categoryController
route.post("/registerUser", categoryController.registerUser);

//tendercontroller
route.post("/Tender_insert", TenderController.Tender_insert);
route.get("/getTender",TenderController.getTender);
route.get("/getTenderById/:id",TenderController.getTenderById);
route.delete("/deleteTender/:id",TenderController.deleteTender)
route.post("/updateTender/:id",TenderController.updateTender)

module.exports = route;
