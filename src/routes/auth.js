const router = require("express").Router();
const { Auth } = require("../handlers");
const passport = require("passport");

const handler = new Auth();

router.get("/", handler.refresh);
router.post("/", handler.createProfile);
router.post("/login", handler.login);

// router.get("/login/failed", (req, res) => {
//   res.status(401).json({ error: true, message: "Log in failure" });
// });

// router.get("/login/success", (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       error: false,
//       message: "Successfully Loged In",
//       user: req.user,
//     });
//   } else {
//     res.status(403).json({ error: true, message: "Not Authorized" });
//   }
// });

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: process.env.CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

// router.get("/google", passport.authenticate("google",["profile","email"]));

// router.get("/logout",(req,res)=>{
//   req.logout();
//   req.redirect(process.env.CLIENT_URL);
// })

module.exports = {
  auths: router,
};
