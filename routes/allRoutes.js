const { Router } = require("express");
const allController = require("../controllers/allControllers");
const { requireAuth, checkUser } = require("../middleware/authmiddleware");

const router = Router();

//homepage
router.get("/", allController.home);
router.get("/home", allController.home_get);

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
router.post(
  "/transaction/finished/:id",
  requireAuth,
  allController.transaction_finished_post
);

//transaction finished
router.get(
  "/transaction-finished/",
  requireAuth,
  allController.transaction_finished
);
router.post(
  "/transaction-finished/redo/:id",
  requireAuth,
  allController.transaction_finished_redo
);

//income
router.get("/income", requireAuth, allController.income_get);

module.exports = router;
