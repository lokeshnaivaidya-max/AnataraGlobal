"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDocumentExpirations = checkDocumentExpirations;
exports.startExpiryAlertScheduler = startExpiryAlertScheduler;
const db_1 = require("../config/db");
const email_1 = require("./email");
async function checkDocumentExpirations() {
    console.log('[Expiry Alert Scheduler] Checking for documents near expiration...');
    try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const today = new Date();
        // Find documents expiring in the next 30 days
        const expiringDocuments = await db_1.prisma.document.findMany({
            where: {
                expiryDate: {
                    gte: today,
                    lte: thirtyDaysFromNow,
                },
            },
            include: {
                owner: true,
            },
        });
        console.log(`[Expiry Alert Scheduler] Found ${expiringDocuments.length} document(s) expiring in the next 30 days.`);
        for (const doc of expiringDocuments) {
            const remainingDays = Math.ceil((new Date(doc.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            await (0, email_1.sendEmail)({
                to: doc.owner.email,
                subject: `ACTION REQUIRED: Document Expiry Alert - ${doc.fileName}`,
                text: `Hello ${doc.owner.firstName},\n\nThis is an automated alert to notify you that your uploaded document "${doc.fileName}" (Category: ${doc.category}) is expiring in ${remainingDays} days (Expiry Date: ${new Date(doc.expiryDate).toDateString()}).\n\nPlease login to the platform to upload a renewed version.\n\nThank you,\nAntara Team`,
            });
            console.log(`[Expiry Alert Scheduler] Expiry alert sent to ${doc.owner.email} for document: ${doc.fileName}`);
        }
    }
    catch (error) {
        console.error('[Expiry Alert Scheduler] Error checking document expirations:', error);
    }
}
function startExpiryAlertScheduler() {
    // Run once immediately on startup
    checkDocumentExpirations();
    // Run every 24 hours
    const intervalTime = 24 * 60 * 60 * 1000;
    setInterval(checkDocumentExpirations, intervalTime);
    console.log('[Expiry Alert Scheduler] Background scheduler initialized to check daily.');
}
