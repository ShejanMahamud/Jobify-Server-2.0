"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("./userModel"));
const companySchema = new mongoose_1.default.Schema({
    company_logo: {
        type: String,
    },
    company_banner: {
        type: String,
    },
    company_name: {
        type: String,
    },
    about_us: {
        type: String,
    },
    organization_type: {
        type: String,
    },
    industry_type: {
        type: String,
    },
    team_size: {
        type: String,
    },
    yoe: {
        type: String,
    },
    website: {
        type: String,
    },
    company_vision: {
        type: String,
    },
    socials: { type: Map, of: String },
    location: {
        type: String,
    },
    phone: {
        type: Number,
    },
    plan: {
        type: String,
        default: 'free',
    },
    job_post_limit: {
        type: Number,
        default: 2,
    },
    resume_access_limit: {
        type: Number,
        default: 1,
    },
    urgent_job_limit: {
        type: Number,
        default: 1,
    },
    featured_job_limit: {
        type: Number,
        default: 1,
    },
    featured_company: {
        type: Boolean,
        default: false,
    },
    saved_candidate_limit: {
        type: Number,
        default: 5,
    },
});
const CompanyModel = userModel_1.default.discriminator('Company', companySchema);
exports.default = CompanyModel;
