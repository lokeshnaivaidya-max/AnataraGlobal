"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import Routers
const auth_1 = __importDefault(require("./routes/auth"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const assessments_1 = __importDefault(require("./routes/assessments"));
const advisory_1 = __importDefault(require("./routes/advisory"));
const documents_1 = __importDefault(require("./routes/documents"));
const admin_1 = __importDefault(require("./routes/admin"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const team_1 = __importDefault(require("./routes/team"));
const signatures_1 = __importDefault(require("./routes/signatures"));
const billing_1 = __importDefault(require("./routes/billing"));
const partners_1 = __importDefault(require("./routes/partners"));
const investors_1 = __importDefault(require("./routes/investors"));
const events_1 = __importDefault(require("./routes/events"));
// Import Swagger Setup
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
// Import Mail services
const email_1 = require("./services/email");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable CORS with origins matching frontend configurations
app.use((0, cors_1.default)({
    origin: '*', // Customize to match localhost:5173 / frontend url in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Body Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger API Documentation Route
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Health Check API
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Antara Platform MVP API is healthy.' });
});
// Main Endpoint Routers (Modules 1 - 7)
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/profiles', profiles_1.default);
app.use('/api/v1/assessments', assessments_1.default);
app.use('/api/v1/advisory', advisory_1.default);
app.use('/api/v1/documents', documents_1.default);
app.use('/api/v1/admin', admin_1.default);
app.use('/api/v1/notifications', notifications_1.default);
app.use('/api/v1/team', team_1.default);
app.use('/api/v1/signatures', signatures_1.default);
app.use('/api/v1/billing', billing_1.default);
app.use('/api/v1/partners', partners_1.default);
app.use('/api/v1/investors', investors_1.default);
app.use('/api/v1/events', events_1.default);
// Module 8: Notifications Test endpoint (Admin / Debug only utility)
app.post('/api/v1/notifications/send-test', async (req, res) => {
    try {
        const { to, subject, body } = req.body;
        if (!to || !subject || !body) {
            res.status(400).json({ status: 'fail', message: 'Missing fields: to, subject, body' });
            return;
        }
        const success = await (0, email_1.sendEmail)({ to, subject, text: body });
        if (success) {
            res.status(200).json({ status: 'success', message: 'Test email successfully triggered!' });
        }
        else {
            res.status(500).json({ status: 'fail', message: 'Email failed to send.' });
        }
    }
    catch (error) {
        console.error('Test notification trigger error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Fallback Route for non-existing endpoints
app.use((req, res) => {
    res.status(404).json({ status: 'fail', message: `Route not found: ${req.method} ${req.originalUrl}` });
});
// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('[Global Error Logger]', err);
    const status = err.status || 'error';
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status,
        message: err.message || 'Something went wrong inside the server.',
    });
});
// Import Expiry Alert Scheduler
const expiryAlerts_1 = require("./services/expiryAlerts");
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Antara Platform MVP Backend is running!`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
    console.log(`===============================================`);
    // Start background schedulers
    (0, expiryAlerts_1.startExpiryAlertScheduler)();
});
exports.default = app;
