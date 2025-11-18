import { getExemplosController, criarExemploController, updateExemploCOntroller, ex  } from "../controllers/ExemploController.js";
import express from 'express';

const router = express.Router();

router.get("/", getExemplosController);
router.post("/", criarExemploController);
router.put("/:id", updateExemploCOntroller);
router.delete()

export default router