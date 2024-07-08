const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { status } = require("init");
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dzmqs5sdv",
  api_key: "282587691228368",
  api_secret: "th_fTIbfb6f_QcZLnou3dj4rIh8",
});

class UserController {
  static registerUser = async (req, res) => {
    // console.log(req.body)
    // console.log(req.files.image)
    const file = req.files.image;
    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "userImage",
    });
    const { name, email, password, conPassword } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res
        .status(404)
        .json({ status: "failed", message: "THIS EMAIL IS ALREAD EXIT" });
    } else {
      if (name && email && password && conPassword) {
        if (password === conPassword) {
          try {
            const hashPassword = await bcrypt.hash(password, 10);
            const data = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
              },
            });
            await data.save();
            res.status(201).json({
              status: "success",
              message: "User Registration Successfully",
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          res.status(404).json({
            status: "failed",
            message: "Password and Confirm Password does not match",
          });
        }
      } else {
        res.status(404).json({
          status: "failed",
          message: "All Fields are required",
        });
      }
    }
  };

  static getAllUser = async (req, res) => {
    try {
      const data = await UserModel.find();
      //console.log(data);
      res.status(200).json({
        data,
      });
    } catch (err) {
      res.send(err);
    }
  };

  static loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return res.status(400).json({
          status: "failed",
          message: "Email and password are required",
        });
      }

      // Find user by email
      const user = await UserModel.findOne({ email: email });

      // Check if user exists
      if (user) {
        // Check if user password is defined
        if (!user.password) {
          return res.status(500).json({
            status: "failed",
            message: "User password is not set in the database",
          });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          // Generate JWT token
          const token = jwt.sign({ ID: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
          });

          // Set cookie with token
          res.cookie("token", token, { httpOnly: true, secure: true });

          // Send response
          res.status(200).json({
            status: "success",
            message: "Login Successfully 😃🍻",
            token,
            user,
          });
        } else {
          // Invalid password
          res.status(401).json({
            status: "failed",
            message: "Email and password are not valid 😓",
          });
        }
      } else {
        // User not found
        res.status(404).json({
          status: "failed",
          message: "You are not a registered user",
        });
      }
    } catch (e) {
      // Log error and send response
      console.error(e);
      res.status(500).json({
        status: "error",
        message: "An internal server error occurred",
      });
    }
  };

  static logout = async (req, res) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      res.status(200).json({
        success: true,
        message: "Logged Out",
      });
    } catch (error) {
      console.log(error);
    }
  };

  static updatePassword = async (req, res) => {
    // console.log(req.user)
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (oldPassword && newPassword && confirmPassword) {
        const user = await UserModel.findById(req.user.id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        //const isPasswordMatched = await userModel.comparePassword(req.body.oldPassword);
        if (!isMatch) {
          res
            .status(201)
            .json({ status: 400, message: "Old password is incorrect" });
        } else {
          if (newPassword !== confirmPassword) {
            res
              .status(201)
              .json({ status: "failed", message: "password does not match" });
          } else {
            // const salt = await bcrypt.genSalt(10);
            const newHashPassword = await bcrypt.hash(newPassword, 10);
            //console.log(req.user)
            await UserModel.findByIdAndUpdate(req.user.id, {
              $set: { password: newHashPassword },
            });
            res.status(201).json({
              status: "success",
              message: "Password changed succesfully",
            });
          }
        }
      } else {
        res
          .status(201)
          .json({ status: "failed", message: "All Fields are Required" });
      }
    } catch (err) {
      res.status(201).json(err);
    }
  };

  static updateProfile = async (req, res) => {
    try {
      //console.log(req.body)
      if (req.file) {
        const user = await UserModel.findById(req.user.id);
        const image_id = user.avatar.public_id;
        await cloudinary.uploader.destroy(image_id);

        const file = req.files.avatar;
        const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "userImage",
          width: 150,
        });
        var data = {
          name: req.body.name,
          email: req.body.email,
          avatar: {
            public_id: myimage.public_id,
            url: myimage.secure_url,
          },
        };
      } else {
        var data = {
          name: req.body.name,
          email: req.body.email,
        };
      }

      const updateuserprofile = await UserModel.findByIdAndUpdate(
        req.user.id,
        data
      );
      res.status(200).json({
        success: true,
        updateuserprofile,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static getAllUser = async (req, res) => {
    try {
      const data = await UserModel.find();
      res.status(200).json({
        data,
      });
    } catch (err) {
      res.send(err);
    }
  };

  static getSingleUser = async (req, res) => {
    try {
      const data = await UserModel.findById(req.params.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  static getUserDetail = async (req, res) => {
    try {
      //   console.log(req.user);
      const user = await UserModel.findById(req.user.id);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static deleteUser = async (req, res) => {
    try {
      const data = await UserModel.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ status: "success", message: "User deleted successfully 😃🍻" });
    } catch (err) {
      console.log(err);
    }
  };

  //catagory controller model
}

module.exports = UserController;
