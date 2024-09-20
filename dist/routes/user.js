"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const verifyToken_js_1 = require("../middleware/verifyToken.js");
const router = express_1.default.Router();
router.get('/', userController_1.getAllUser);
router.post('/register', userController_1.createUser);
router.post('/login', userController_1.loginUser);
router
    .route('/me/:email')
    .get(verifyToken_js_1.verifyToken, userController_1.getUser)
    .patch(verifyToken_js_1.verifyToken, userController_1.editUser)
    .delete(verifyToken_js_1.verifyToken, userController_1.deleteUser);
exports.default = router;
