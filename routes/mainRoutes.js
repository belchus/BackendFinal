
const express = require("express");
const router = express.Router();
const passport = require("passport");
const main = require("../controllers/main.js");
const { auth, notAuth } = require("../utils/authModules.js");


router.get("/", notAuth, main.loginGet);
router.get("/products", auth, main.index); 
router.get("/products/:id", auth, main.item);
router.post(
  "/login",
  notAuth,
  passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.get("/info", main.infoserver);

router.get("/register", notAuth, main.registerGet);

router.post("/purchase", auth, (req, res) => {
  main.notifyPurchase(req.body);
});
router.get("/exit", (req, res) => {
  req.logout();
  return res.redirect("/");
});
router.get("/logout", auth, (req, res) => {
  res.render("logout.hbs", {
    firstname: req.user.firstname,
    title: "Logout",
  });
});



module.exports = router;