const { Router } = require("express");
const allController = require("../controllers/allControllers");

const exspress = require("express");
const app = exspress();
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("../middleware/authmiddleware");
app.use(cookieParser());

const router = Router();

//homepage
router.get("/", allController.home);
router.get("/home", allController.home_get);
// router.get("/", allController.track_get);

//transaction
router.get("/transaction", requireAuth, allController.transaction_get);
router.get(
  "/transaction/add",
  requireAuth,
  allController.transaction_render_add
);
router.post("/transaction/add", requireAuth, allController.transaction_add);
router.get(
  "/transaction/edit/:id",
  requireAuth,
  allController.transaction_render_edit
);
router.post(
  "/transaction/edit/:id",
  requireAuth,
  allController.transaction_edit
);
router.post(
  "/transaction/delete/:id",
  requireAuth,
  allController.transaction_delete
);

router.get(
  "/transaction/finished",
  requireAuth,
  allController.transaction_finished_get
);
router.get("/transaction/:id/edit", allController.transaction_render_edit);
router.post("/transaction/:id/edit/post", allController.transaction_add);

module.exports = router;
