import express from 'express'; // Hoặc require('express') nếu dùng CommonJS, nhưng khuyến nghị ES modules cho TS
import { getProfileController, updateProfileController } from '../controllers/user.controller';
import {verifyToken} from '../middleware/verifyToken'; // Giả sử đã có, chuyển sang .ts nếu cần

const router = express.Router();

router.get('/profile', verifyToken, getProfileController);
router.put('/update', verifyToken, updateProfileController);

export default router; // Hoặc module.exports = router; nếu CommonJS