import express from "express"
import { getImage } from "./imageController.js";

const router = express.Router();

router.get('/:fileId', getImage)

export default router