"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Antara Platform MVP API Documentation',
            version: '1.0.0',
            description: 'REST API documentation for the Antara MVP Platform. Outlines endpoints for Auth, Profiles, Advisory, Documents, and Admin functionalities.',
        },
        servers: [
            {
                url: 'http://localhost:5001/api/v1',
                description: 'Development Server (Port 5001)',
            },
            {
                url: 'http://localhost:5000/api/v1',
                description: 'Alternative Server (Port 5000)',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: <token_value>',
                },
            },
            schemas: {
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'fail' },
                        message: { type: 'string', example: 'Detailed error message description' },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        message: { type: 'string', example: 'Operation completed successfully' },
                    },
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
        paths: {
            '/health': {
                get: {
                    summary: 'Health Check',
                    description: 'Check if the backend API service is running and healthy.',
                    security: [],
                    responses: {
                        200: {
                            description: 'Service is healthy',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'success' },
                                            message: { type: 'string', example: 'Antara Platform MVP API is healthy.' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/auth/register': {
                post: {
                    summary: 'User Registration',
                    description: 'Register a new user (Founder, MSME, or Advisor). Generates an OTP code sent to the email.',
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password', 'firstName', 'lastName'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                                        password: { type: 'string', minLength: 6, example: 'password123' },
                                        firstName: { type: 'string', example: 'John' },
                                        lastName: { type: 'string', example: 'Doe' },
                                        roleName: { type: 'string', enum: ['Founder', 'MSME', 'Advisor'], example: 'Founder' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'User registered successfully. OTP sent.',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'success' },
                                            message: { type: 'string', example: 'Registration successful. OTP sent to your email.' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Validation or existing user error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
            },
            '/auth/login': {
                post: {
                    summary: 'User Login',
                    description: 'Authenticate user with email and password.',
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                                        password: { type: 'string', example: 'password123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Authentication successful. Returns token and user metadata.',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'success' },
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                                                    user: {
                                                        type: 'object',
                                                        properties: {
                                                            id: { type: 'string', example: 'user-id-uuid' },
                                                            email: { type: 'string', example: 'user@example.com' },
                                                            firstName: { type: 'string', example: 'John' },
                                                            lastName: { type: 'string', example: 'Doe' },
                                                            role: { type: 'string', example: 'Founder' },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Invalid credentials or validation error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                        401: {
                            description: 'Email not verified (OTP verification required)',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
            },
            '/auth/verify-otp': {
                post: {
                    summary: 'Verify OTP Code',
                    description: 'Verify the OTP code sent for email verification, login MFA, or password reset.',
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'code', 'purpose'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                                        code: { type: 'string', example: '123456' },
                                        purpose: { type: 'string', enum: ['email_verification', 'login_mfa', 'password_reset'], example: 'email_verification' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'OTP verified successfully',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
                        },
                        400: {
                            description: 'Invalid or expired OTP',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
            },
            '/auth/forgot-password': {
                post: {
                    summary: 'Forgot Password Request',
                    description: 'Request a password reset OTP.',
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'OTP sent to email',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
                        },
                        400: {
                            description: 'User not found',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
            },
            '/auth/reset-password': {
                post: {
                    summary: 'Reset Password',
                    description: 'Reset password using the OTP code received.',
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'code', 'newPassword'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                                        code: { type: 'string', example: '123456' },
                                        newPassword: { type: 'string', minLength: 6, example: 'newpassword123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Password reset successful',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
                        },
                        400: {
                            description: 'Invalid OTP or validation error',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
            },
            '/auth/sessions': {
                get: {
                    summary: 'Get Active Sessions',
                    description: 'Retrieve all active sessions/logins for the authenticated user.',
                    responses: {
                        200: {
                            description: 'List of active sessions',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'success' },
                                            data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'string', example: 'session-uuid' },
                                                        ipAddress: { type: 'string', example: '127.0.0.1' },
                                                        userAgent: { type: 'string', example: 'Mozilla/5.0...' },
                                                        isActive: { type: 'boolean', example: true },
                                                        createdAt: { type: 'string', format: 'date-time' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: 'Unauthorized',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                        },
                    },
                },
            },
            '/auth/sessions/{id}': {
                delete: {
                    summary: 'Revoke Active Session',
                    description: 'Log out of a specific active session by its session ID.',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'The session ID to revoke',
                            schema: { type: 'string' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Session revoked successfully',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        404: {
                            description: 'Session not found',
                        },
                    },
                },
            },
            '/profiles/founder': {
                get: {
                    summary: 'Get Founder Profile',
                    description: 'Retrieve profile details for the authenticated Founder user, including education, experience, and startup details.',
                    responses: {
                        200: {
                            description: 'Founder profile details',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'success' },
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'string' },
                                                    bio: { type: 'string' },
                                                    linkedinUrl: { type: 'string' },
                                                    panNumber: { type: 'string' },
                                                    gstNumber: { type: 'string' },
                                                    kycStatus: { type: 'string' },
                                                    education: { type: 'array', items: { type: 'object' } },
                                                    experience: { type: 'array', items: { type: 'object' } },
                                                    skills: { type: 'array', items: { type: 'string' } },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                put: {
                    summary: 'Update Founder Profile',
                    description: 'Update personal details on the Founder profile.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        bio: { type: 'string', example: 'Tech entrepreneur and software engineer' },
                                        linkedinUrl: { type: 'string', format: 'uri', example: 'https://linkedin.com/in/johndoe' },
                                        panNumber: { type: 'string', example: 'ABCDE1234F' },
                                        gstNumber: { type: 'string', example: '22AAAAA0000A1Z5' },
                                        kycStatus: { type: 'string', enum: ['pending', 'verified', 'rejected'] },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Profile updated successfully',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
                        },
                    },
                },
            },
            '/profiles/founder/education': {
                post: {
                    summary: 'Add Founder Education',
                    description: 'Add an education entry to the founder profile.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['institution', 'degree', 'fieldOfStudy', 'startDate'],
                                    properties: {
                                        institution: { type: 'string', example: 'Stanford University' },
                                        degree: { type: 'string', example: 'M.S.' },
                                        fieldOfStudy: { type: 'string', example: 'Computer Science' },
                                        startDate: { type: 'string', format: 'date', example: '2020-09-01' },
                                        endDate: { type: 'string', format: 'date', example: '2022-06-15' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Education added successfully',
                        },
                    },
                },
            },
            '/profiles/founder/education/{id}': {
                delete: {
                    summary: 'Delete Founder Education',
                    description: 'Delete an education entry by ID.',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Education entry deleted',
                        },
                    },
                },
            },
            '/profiles/founder/experience': {
                post: {
                    summary: 'Add Founder Experience',
                    description: 'Add a professional experience entry to the founder profile.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['company', 'role', 'startDate'],
                                    properties: {
                                        company: { type: 'string', example: 'Google' },
                                        role: { type: 'string', example: 'Senior Software Engineer' },
                                        description: { type: 'string', example: 'Developing core infrastructure services.' },
                                        startDate: { type: 'string', format: 'date', example: '2022-07-01' },
                                        endDate: { type: 'string', format: 'date', example: '2025-01-01' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Experience added successfully',
                        },
                    },
                },
            },
            '/profiles/founder/experience/{id}': {
                delete: {
                    summary: 'Delete Founder Experience',
                    description: 'Delete an experience entry by ID.',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Experience entry deleted',
                        },
                    },
                },
            },
            '/profiles/founder/skills': {
                post: {
                    summary: 'Save Founder Skills',
                    description: 'Upsert list of skills on the founder profile.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['skills'],
                                    properties: {
                                        skills: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            example: ['TypeScript', 'React', 'Node.js', 'System Design'],
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Skills updated successfully',
                        },
                    },
                },
            },
            '/profiles/founder/startup': {
                get: {
                    summary: 'Get Startup Details',
                    description: 'Retrieve the details of the startup associated with the authenticated Founder.',
                    responses: {
                        200: {
                            description: 'Startup details',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'success' },
                                            data: { type: 'object' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    summary: 'Upsert Startup Details',
                    description: 'Create or update details of the startup.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'industry', 'sector', 'problem', 'solution'],
                                    properties: {
                                        name: { type: 'string', example: 'Acme SaaS Corp' },
                                        industry: { type: 'string', example: 'Technology' },
                                        sector: { type: 'string', example: 'B2B Software' },
                                        problem: { type: 'string', example: 'Businesses struggle to manage multi-tenant database clusters efficiently.' },
                                        solution: { type: 'string', example: 'An automated, AI-driven clustering management console.' },
                                        revenue: { type: 'number', example: 120000 },
                                        traction: { type: 'string', example: '50 active pilot accounts' },
                                        customers: { type: 'integer', example: 12 },
                                        currentValuation: { type: 'number', example: 2500000 },
                                        currentFunding: { type: 'number', example: 350000 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Startup details updated successfully',
                        },
                    },
                },
            },
            '/profiles/msme': {
                get: {
                    summary: 'Get MSME Profile',
                    description: 'Retrieve profile details for the authenticated MSME user.',
                    responses: {
                        200: {
                            description: 'MSME profile details',
                        },
                    },
                },
                post: {
                    summary: 'Upsert MSME Profile',
                    description: 'Create or update the MSME profile configuration.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['companyName', 'industryId', 'turnoverTier'],
                                    properties: {
                                        companyName: { type: 'string', example: 'Antara MSME Enterprise' },
                                        industryId: { type: 'string', example: 'manufacturing' },
                                        employeeCount: { type: 'integer', example: 45 },
                                        isExporter: { type: 'boolean', example: true },
                                        exportCountries: { type: 'array', items: { type: 'string' }, example: ['Germany', 'USA'] },
                                        exportPercentage: { type: 'number', example: 25.5 },
                                        turnoverTier: { type: 'string', example: 'tier_2' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'MSME profile saved',
                        },
                    },
                },
            },
            '/profiles/msme/gst': {
                post: {
                    summary: 'Submit MSME GST Details',
                    description: 'Submit GST number and optional certification document.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['gstNumber'],
                                    properties: {
                                        gstNumber: { type: 'string', example: '22AAAAA0000A1Z5' },
                                        fileUrl: { type: 'string', format: 'uri', example: 'https://storage.googleapis.com/bucket/gst.pdf' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'GST details submitted',
                        },
                    },
                },
            },
            '/profiles/msme/turnover': {
                post: {
                    summary: 'Submit MSME Annual Turnover',
                    description: 'Record turnover amount for a specific year.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['year', 'amount'],
                                    properties: {
                                        year: { type: 'integer', example: 2025 },
                                        amount: { type: 'number', example: 1500000 },
                                        fileUrl: { type: 'string', format: 'uri', example: 'https://storage.googleapis.com/bucket/turnover.pdf' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Turnover submitted successfully',
                        },
                    },
                },
            },
            '/advisory/advisors': {
                get: {
                    summary: 'Get Matching Advisors',
                    description: 'Returns list of available advisors, optionally filtered by expertise.',
                    parameters: [
                        {
                            name: 'expertise',
                            in: 'query',
                            required: false,
                            description: 'Filter advisors by expertise area',
                            schema: { type: 'string' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'List of matching advisors',
                        },
                    },
                },
            },
            '/notifications/lead': {
                post: {
                    summary: 'Submit Lead Received Notification',
                    description: 'Triggers an email notification to the sales team (sales@antara.com) for a new business lead.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['leadName', 'leadEmail', 'leadMessage'],
                                    properties: {
                                        leadName: { type: 'string', example: 'Alice Smith' },
                                        leadEmail: { type: 'string', format: 'email', example: 'alice@example.com' },
                                        leadMessage: { type: 'string', example: 'Interested in growth advisory consultation options.' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Lead notification sent successfully',
                        },
                    },
                },
            },
            '/notifications/partner-approval': {
                post: {
                    summary: 'Send Partner Approval Welcome Email',
                    description: 'Sends a welcome email to an advisor or partner when their profile status is approved.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['partnerEmail', 'partnerName'],
                                    properties: {
                                        partnerEmail: { type: 'string', format: 'email', example: 'advisor@example.com' },
                                        partnerName: { type: 'string', example: 'Dr. Jane Doe' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Partner welcome email sent successfully',
                        },
                    },
                },
            },
            '/notifications/event': {
                post: {
                    summary: 'Send Event Registration Confirmation',
                    description: 'Sends a confirmation email immediately for event registration.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['userEmail', 'eventDetails'],
                                    properties: {
                                        userEmail: { type: 'string', format: 'email', example: 'user@example.com' },
                                        eventDetails: { type: 'string', example: 'Antara Global Growth Web Seminar, July 15th at 3 PM GMT' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Event confirmation email sent successfully',
                        },
                    },
                },
            },
            '/notifications/milestone': {
                post: {
                    summary: 'Send Fundraising Milestone Status Update',
                    description: 'Sends a milestone progress report or funding update notification email to the founder.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['founderEmail', 'startupName', 'milestoneDetails'],
                                    properties: {
                                        founderEmail: { type: 'string', format: 'email', example: 'founder@example.com' },
                                        startupName: { type: 'string', example: 'Acme SaaS Corp' },
                                        milestoneDetails: { type: 'string', example: 'Successfully secured $250k Pre-seed funding target!' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Milestone status update email sent successfully',
                        },
                    },
                },
            },
            '/team/startup/{startupId}': {
                post: {
                    summary: 'Add Team Member to Startup',
                    description: 'Allows a founder to add a new co-founder or team member to their startup.',
                    parameters: [
                        {
                            name: 'startupId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'role'],
                                    properties: {
                                        name: { type: 'string', example: 'Bob Johnson' },
                                        role: { type: 'string', example: 'Chief Technology Officer (CTO)' },
                                        email: { type: 'string', format: 'email', example: 'bob@example.com' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Team member added successfully',
                        },
                    },
                },
                get: {
                    summary: 'List Startup Team Members',
                    description: 'Retrieves all team members associated with a given startup ID.',
                    parameters: [
                        {
                            name: 'startupId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'List of team members',
                        },
                    },
                },
            },
            '/team/{memberId}': {
                delete: {
                    summary: 'Remove Team Member',
                    description: 'Deletes/removes a team member from a startup.',
                    parameters: [
                        {
                            name: 'memberId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Team member removed successfully',
                        },
                    },
                },
            },
            '/signatures/{documentId}/sign': {
                post: {
                    summary: 'Digitally Sign Document',
                    description: 'Signs a document by generating a cryptographic SHA-256 digital signature hash.',
                    parameters: [
                        {
                            name: 'documentId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                        },
                    ],
                    responses: {
                        201: {
                            description: 'Document signed successfully',
                        },
                    },
                },
            },
            '/signatures/{documentId}/signature': {
                get: {
                    summary: 'View Document Digital Signature',
                    description: 'Retrieves the digital signature details (signer details, timestamp, signature hash) for a document.',
                    parameters: [
                        {
                            name: 'documentId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Digital signature details',
                        },
                        404: {
                            description: 'Document has not been signed yet',
                        },
                    },
                },
            },
            '/billing/my-invoices': {
                get: {
                    summary: 'Get My Invoices',
                    description: 'Retrieves all invoices issued to the authenticated user.',
                    responses: {
                        200: {
                            description: 'List of user invoices',
                        },
                    },
                },
            },
            '/billing/admin/billing': {
                get: {
                    summary: 'Get All Invoices (Admin Only)',
                    description: 'Lists all system-wide invoices.',
                    responses: {
                        200: {
                            description: 'List of all platform invoices',
                        },
                    },
                },
                post: {
                    summary: 'Create Invoice (Admin Only)',
                    description: 'Generates a new invoice/billing ledger record for a user.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['userId', 'amount', 'description', 'dueDate'],
                                    properties: {
                                        userId: { type: 'string', format: 'uuid', example: 'user-id-uuid' },
                                        amount: { type: 'number', example: 499 },
                                        description: { type: 'string', example: 'Antara Platform Growth Plan - Monthly Subscription' },
                                        dueDate: { type: 'string', format: 'date-time', example: '2026-08-01T00:00:00Z' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Invoice created successfully',
                        },
                    },
                },
            },
            '/billing/admin/billing/{id}': {
                put: {
                    summary: 'Update Invoice Status (Admin Only)',
                    description: 'Updates payment status of an invoice (pending, paid, failed).',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['status'],
                                    properties: {
                                        status: { type: 'string', enum: ['pending', 'paid', 'failed'], example: 'paid' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Invoice status updated successfully',
                        },
                    },
                },
            },
            '/partners': {
                get: {
                    summary: 'List Partners & Status (Admin Only)',
                    description: 'Lists all registered advisors/partners and their approval status.',
                    responses: {
                        200: {
                            description: 'List of platform partners',
                        },
                    },
                },
            },
            '/partners/{id}/status': {
                put: {
                    summary: 'Update Partner Status (Admin Only)',
                    description: 'Approves or rejects a partner. Approving automatically triggers a welcome email.',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid', description: 'The advisor profile ID' },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['status'],
                                    properties: {
                                        status: { type: 'string', enum: ['pending', 'approved', 'rejected'], example: 'approved' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Partner status updated and email sent if approved',
                        },
                    },
                },
            },
            '/investors': {
                get: {
                    summary: 'Get Investor Database',
                    description: 'Browses and searches the directory of venture capital / angel investors.',
                    responses: {
                        200: {
                            description: 'List of investors',
                        },
                    },
                },
                post: {
                    summary: 'Create Investor Profile (Admin Only)',
                    description: 'Registers a new investor profile in the database.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['companyName', 'contactName', 'email', 'investmentStage', 'minTicket', 'maxTicket'],
                                    properties: {
                                        companyName: { type: 'string', example: 'Alpha Venture Partners' },
                                        contactName: { type: 'string', example: 'Sarah Connor' },
                                        email: { type: 'string', format: 'email', example: 'sarah@alphavp.com' },
                                        investmentStage: { type: 'array', items: { type: 'string' }, example: ['Seed', 'Series A'] },
                                        minTicket: { type: 'number', example: 50000 },
                                        maxTicket: { type: 'number', example: 250000 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Investor profile created successfully',
                        },
                    },
                },
            },
            '/investors/{id}': {
                put: {
                    summary: 'Update Investor Profile (Admin Only)',
                    description: 'Updates info of an existing investor profile.',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        companyName: { type: 'string' },
                                        contactName: { type: 'string' },
                                        minTicket: { type: 'number' },
                                        maxTicket: { type: 'number' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Investor updated successfully',
                        },
                    },
                },
                delete: {
                    summary: 'Delete Investor Profile (Admin Only)',
                    description: 'Deletes an investor profile.',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Investor deleted successfully',
                        },
                    },
                },
            },
            '/events': {
                get: {
                    summary: 'List Platform Events',
                    description: 'Retrieves all upcoming events hosted on the platform.',
                    responses: {
                        200: {
                            description: 'List of platform events',
                        },
                    },
                },
            },
            '/events/register/{id}': {
                post: {
                    summary: 'Register for Event',
                    description: 'Registers the authenticated user for an event and automatically triggers a confirmation email.',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid', description: 'The Event ID' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Registered successfully. Email sent.',
                        },
                    },
                },
            },
            '/events/admin/events': {
                post: {
                    summary: 'Create Platform Event (Admin Only)',
                    description: 'Creates a new platform event.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['title', 'eventDate'],
                                    properties: {
                                        title: { type: 'string', example: 'Global Venture Pitch Summit' },
                                        description: { type: 'string', example: 'Connect with 20+ VCs and pitch live.' },
                                        eventDate: { type: 'string', format: 'date-time', example: '2026-09-10T18:00:00Z' },
                                        location: { type: 'string', example: 'Virtual / Zoom Room' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Event created successfully',
                        },
                    },
                },
            },
            '/events/admin/events/{id}': {
                delete: {
                    summary: 'Delete Platform Event (Admin Only)',
                    description: 'Cancels/deletes a platform event.',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid' },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Event deleted successfully',
                        },
                    },
                },
            },
        },
    },
    apis: [], // We are explicitly mapping the paths above for cleanliness, avoiding JSDoc bloat in controller files
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
