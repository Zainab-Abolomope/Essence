const express = require("express")
const router = express.Router()
const {getHome, getBlog, getSingleBlog, getRegularPage, getSingleProducts, getCheckout, getContact, getShop, login, postProduct, signup, signupLogic, loginLogic, logout, post} = require("../controllers/maincontroller")
const {verify, checkUser} = require("../middleware/verify")


router.get("/", checkUser, getHome)
router.get("/blog",checkUser, getBlog)
router.get("/contact", checkUser, getContact)
router.get("/shop", checkUser, getShop)
router.get("/single-blog", checkUser, getSingleBlog)
router.get("/product-detail/:id", checkUser, getSingleProducts)
router.get("/regular",checkUser, getRegularPage)
router.get("/checkout",verify, getCheckout)
router.get("/register", signup)
router.post("/register", signupLogic)
router.get("/logout", logout)
router.get("/login", login)
router.post("/login", loginLogic)
router.get("/post",verify, postProduct)
router.post("/post", verify, post)

module.exports = router