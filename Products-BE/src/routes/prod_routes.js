import { Router } from "express";
import { 
  getProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../controllers/prod_controller.js";
import { requireAuth } from "../middleware/user_auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", requireAuth, getProducts);
router.get("/search", requireAuth, searchProducts);
router.get("/:id", requireAuth, getProductById);

router.post("/", requireAuth, upload.single("image"), createProduct);
router.put("/:id", requireAuth, upload.single("image"), updateProduct);

router.delete("/:id", requireAuth, deleteProduct);

export default router;

//upload.image bet assem l request la chunks w bet le2e l image 
//then uploads it the right folter w bi sir fina nesta3mol req.file.