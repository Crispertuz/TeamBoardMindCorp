import forgotPassword from '../controllers/forgot_password.js';
import express from 'express';
const router = express.Router();

router.post("/forgottenPassword", forgotPassword.forgottenPassword);
router.put("/forgottenPasswordConfirm", forgotPassword.forgottenPasswordConfirm);

export default router;