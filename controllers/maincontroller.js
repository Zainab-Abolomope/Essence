const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getHome = async (req, res) => {
  try {
    if (req.user) {
      const email = req.user.email;
      const user = await userModel.findOne({ email: email });
      res.render("index", { user });
    } else {
      res.render("index");
    }
  } catch (err) {
    console.log(err.message);
    res.render("index");
  }
};

const getCheckout = (req, res) => {
  res.render("checkout");
};
const getContact = (req, res) => {
  res.render("contact");
};
const getShop = async(req, res) => {
    const products = await productModel.find();
  res.render("shop", {products});
};
const getSingleBlog = (req, res) => {
  res.render("single-blog");
};
const getBlog = (req, res) => {
  res.render("blog");
};
const getRegularPage = (req, res) => {
  res.render("regular-page");
};
const getSingleProducts = async(req, res) => {
    const productId = req.params.id
    const product = await productModel.findOne({_id: productId})
  res.render("single-product-details", {product});
};

const login = (req, res) => {
  res.render("orangelogin");
};

const signup = (req, res) => {
  res.render("orangelogin");
};
const postProduct = (req, res) => {
  res.render("postproduct");
};

const signupLogic = async (req, res) => {
  const { name, email, password } = req.body;
  if (name !== "" && email !== "" && password !== "") {
    const checkEmail = await userModel.findOne({ email: email });
    if (checkEmail) {
      res.render("orangelogin", { error: "Email already in use" });
    } else {
      if (password.length >= 6) {
        await userModel.create({
          name: name,
          email: email,
          password: password,
        });

        res.render("orangelogin", {
          message: "Registration is successful, please login",
        });
      } else {
        res.render("orangelogin", {
          error: "Password must be at least 6 characters",
        });
      }
    }
  } else {
    res.render("orangelogin", {
      error: "Name, Email or Password cannot be empty",
    });
  }
};
const loginLogic = async (req, res) => {
  const { email, password } = req.body;
  if (email !== "" && password !== "") {
    const checkEmail = await userModel.findOne({ email: email });
    if (checkEmail) {
      const comparePassword = await bcrypt.compare(
        password,
        checkEmail.password
      );
      console.log(comparePassword);
      if (comparePassword) {
        const token = await jwt.sign({ email }, process.env.JWT_KEY, {
          expiresIn: "1h",
        });
        res.cookie("essence_token", token);
        // res.render("index", { message: "Logged in successfully" });
        res.redirect("/");
      } else {
        res.render("orangelogin", { error: "Email or Password mismatch" });
      }
    } else {
      res.render("orangelogin", { error: "Email or Password mismatch" });
    }
  } else {
    res.render("orangelogin", { error: "Email or Password cannot be empty" });
  }
};

const logout = (req, res) => {
  try {
    if (req.cookies.essence_token) {
      res.clearCookie("essence_token");
      res.render("orangelogin", { message: "Logout successfully" });
    } else {
      res.render("orangelogin", { error: "you are not logged in" });
    }
  } catch (err) {
    console.log(err.message);
    res.redirect("/login");
  }
};

const post = async (req, res) => {
    const email = req.user.email
    const user = await userModel.findOne({ email: email})
  try {
    const { name, price, sizes, colors, description } = req.body;
    const images = req.files.images;
    const colorArr = colors.split(",");
    const sizeArr = sizes.split(",");
    const imageArr = [];

    if (Array.isArray(images)) {
      await Promise.all(
        images.map(async (image, index) => {
          const imageName = image.name;
          try {
            await new Promise((resolve, reject) => {
              image.mv(`public/upload/${imageName}`, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
            const fileupoad = `upload/${imageName}`;
            imageArr.push(fileupoad);
          } catch (err) {
            console.log(err.message);
            return res.render("postproduct", {
              error: "Error occured while adding picture",
            });
          }
        })
      );
    } else {
      const imageName = images.name;
      await images.mv(`public/upload/${imageName}`);
      const fileupoad = `upload/${imageName}`;
      imageArr.push(fileupoad);
    }

    await productModel.create({
      name: name,
      description: description,
      price: price,
      sizes: sizeArr,
      colors: colorArr,
      images: imageArr,
      imageOne: imageArr[0],
      imageTwo: imageArr.length > 1 ? imageArr[1] : imageArr[0],
      postedBy: user._id
    });
    res.render("postproduct", { message: "Product posted successfully" });
  } catch (err) {
    console.log(err.message);
    res.render("postproduct", { error: "Error occured while posting" });
  }
};

module.exports = {
  post,
  getHome,
  getBlog,
  getSingleBlog,
  getRegularPage,
  getSingleProducts,
  getCheckout,
  getContact,
  getShop,
  login,
  postProduct,
  signup,
  signupLogic,
  loginLogic,
  logout,
};
