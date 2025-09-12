// server/src/routes/tenantRoutes.ts
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { upgradeTenant } from '../controllers/tenantController.js';

const router = express.Router();

router.post('/:slug/upgrade', protect, upgradeTenant);

export default router;