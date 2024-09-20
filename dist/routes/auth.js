"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userModel_1 = __importDefault(require("../models/userModel"));
dotenv_1.default.config();
const router = express_1.default.Router();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        const fullName = profile.displayName;
        const profile_picture = ((_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value) || 'https://i.ibb.co.com/6F9w4Ps/boy.png';
        if (!email) {
            return done(new Error('No email found'), false);
        }
        let user = yield userModel_1.default.findOne({ email });
        if (!user) {
            user = new userModel_1.default({
                fullName,
                email,
                profile_picture,
                role: 'candidate',
            });
            yield user.save();
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN, {
            expiresIn: '1h',
        });
        return done(null, { token });
    }
    catch (error) {
        return done(error, false);
    }
})));
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated.',
        });
    }
    const { token } = req.user;
    res.json({
        success: true,
        message: 'Successfully logged in with Google!',
        token: token,
    });
});
exports.default = router;
