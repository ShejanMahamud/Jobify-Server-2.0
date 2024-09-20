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
exports.deleteUser = exports.editUser = exports.getUser = exports.getAllUser = exports.loginUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
dotenv_1.default.config();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const strongPassword = yield bcrypt_1.default.hash(user === null || user === void 0 ? void 0 : user.password, 13);
        const newUser = new userModel_1.default(Object.assign(Object.assign({}, user), { password: strongPassword }));
        const result = yield newUser.save();
        res.status(201).send({
            success: true,
            message: 'Successfully Registered!',
            data: result,
        });
    }
    catch (error) {
        if (error.status === 11000) {
            return res.status(400).send({
                success: false,
                message: 'Registration Failed! Email Already Exists!',
            });
        }
        else {
            console.log(`This error happened during registration: ${error.message}`);
            return res.status(500).send({
                success: false,
                message: error.message || 'Registration Error',
            });
        }
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield userModel_1.default.findOne({ email });
        if (!result) {
            return res
                .status(400)
                .send({ success: false, message: 'User not found!' });
        }
        const isMatch = yield bcrypt_1.default.compare(password, result.password);
        if (!isMatch) {
            return res
                .status(400)
                .send({ success: false, message: 'Invalid credentials', error: true });
        }
        const token = jsonwebtoken_1.default.sign({ email }, process.env.ACCESS_TOKEN, {
            expiresIn: '1h',
        });
        res.status(200).send({
            data: result,
            token,
            success: true,
            message: 'Successfully Logged In',
        });
    }
    catch (error) {
        console.log('Getting login error:', error.message);
        res.status(500).send({
            status: false,
            message: error.message || 'Something went wrong',
        });
    }
});
exports.loginUser = loginUser;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find({});
        res.status(200).send({
            success: true,
            data: users,
        });
    }
    catch (error) {
        console.log('Getting user error:', error.message);
        res.status(500).send({
            status: false,
            message: error.message || 'Something went wrong',
        });
    }
});
exports.getAllUser = getAllUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({ email: req.params.email });
        if (!user)
            return res.status(404).send({
                success: false,
                message: 'User not found!',
            });
        res.status(200).send({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.log('Getting single user error', error.message);
        res.status(400).send({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
});
exports.getUser = getUser;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const result = yield userModel_1.default.findOneAndUpdate({ email: req.params.email }, Object.assign(Object.assign({}, user), { updated_at: Date.now() }), {
            new: true,
            runValidators: true,
        });
        if (!result)
            return res.status(404).send({
                success: false,
                message: 'User modification failed, User not found',
            });
        res.status(200).send({
            success: true,
            message: 'Successfully User Updated!',
            data: result,
        });
    }
    catch (error) {
        console.log('Getting error while updating', error.message);
        res.status(400).send({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
});
exports.editUser = editUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userModel_1.default.findOneAndDelete({
            email: req.params.email,
        });
        if (!result)
            return res.status(404).send({
                success: false,
                message: 'User delete failed, User not found',
            });
        res.status(200).send({
            success: true,
            message: 'Successfully User Deleted!',
        });
    }
    catch (error) {
        console.log('Getting error while deleting', error.message);
        res.status(400).send({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
});
exports.deleteUser = deleteUser;
