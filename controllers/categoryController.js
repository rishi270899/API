const categoryModel = require("../models/categoryModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { status } = require("init");
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dzmqs5sdv",
  api_key: "282587691228368",
  api_secret: "th_fTIbfb6f_QcZLnou3dj4rIh8",
});

class categoryController {
  static registerUser = async (req, res) => {
    const file = req.files.image;
    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "userImage",
    });
    const { name, image } = req.body;
    
  };




}
module.exports = categoryController;
