const express = require("express");

const router = express.Router();

const useAuthcontroller = require("../controllers/auth");

router.post("/authdetails", useAuthcontroller.addAuth);

router.post("/logindetails", useAuthcontroller.loginAuth);

module.exports = router;
