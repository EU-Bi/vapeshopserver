const Router = require("express");
const router = new Router();
const deviceRouter = require("./deviceRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");
const adminRouter = require("./adminRouter");
const orderRouter = require("./orderRouter");
const modelRouter = require("./modelRouter");
const tasteRouter = require("./tasteRouter");
const bannerRouter = require("./bannerRouter");

router.use("/type", typeRouter);
router.use("/device", deviceRouter);
router.use("/model", modelRouter);
router.use("/brand", brandRouter);
router.use("/admin", adminRouter);
router.use("/order", orderRouter);
router.use("/taste", tasteRouter);
router.use("/banners", bannerRouter);

module.exports = router;
