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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_1 = __importDefault(require("../src/routes/auth"));
const user_1 = __importDefault(require("../src/routes/user"));
const connectDB_1 = require("./db/connectDB");
const customError_1 = require("./utils/customError");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3478;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
//setup passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get('/', (req, res) => {
    res.send({
        status: 200,
        success: true,
        message: 'Server Running...',
    });
});
//routes
app.use('/auth', auth_1.default);
app.use('/auth/user', user_1.default);
// Handle 404 errors
app.use((req, res, next) => {
    const error = new customError_1.CustomError('Requested URL Not Found', 404);
    next(error);
});
// Global error handler
app.use((error, req, res) => {
    console.error(error);
    res.status(error.status || 500).send({
        status: error.status || 500,
        success: false,
        message: error.message || 'Internal Server Error',
    });
});
// Initialize server and connect to the database
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.connectDB)(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(`APP RUNNING ON PORT: ${PORT}`));
    }
    catch (error) {
        console.error('Failed to Start the Server:', error);
        process.exit(1);
    }
}))();
