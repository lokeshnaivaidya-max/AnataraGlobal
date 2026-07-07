import { prisma } from '../config/db';
import { sendEmail } from './email';

export interface Job {
  id: string;
  name: string;
  data: any;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  processedAt?: Date;
}

class BackgroundQueue {
  private jobs = new Map<string, Job>();
  private activeWorkers = 0;
  private maxWorkers = 2;

  createJob(name: string, data: any): Job {
    const job: Job = {
      id: `job-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      data,
      status: 'queued',
      createdAt: new Date(),
    };
    this.jobs.set(job.id, job);
    this.triggerProcessor();
    return job;
  }

  getJob(id: string): Job | null {
    return this.jobs.get(id) || null;
  }

  private triggerProcessor() {
    if (this.activeWorkers >= this.maxWorkers) return;

    const nextJob = Array.from(this.jobs.values()).find(
      (job) => job.status === 'queued'
    );

    if (!nextJob) return;

    this.activeWorkers++;
    nextJob.status = 'processing';

    // Asynchronously run the job handler
    this.processJob(nextJob)
      .then((result) => {
        nextJob.status = 'completed';
        nextJob.result = result;
        nextJob.processedAt = new Date();
      })
      .catch((err) => {
        nextJob.status = 'failed';
        nextJob.error = err.message || String(err);
        nextJob.processedAt = new Date();
      })
      .finally(() => {
        this.activeWorkers--;
        this.triggerProcessor();
      });
  }

  private async processJob(job: Job): Promise<any> {
    console.log(`[Queue Worker] Processing job ID ${job.id} (${job.name})...`);

    switch (job.name) {
      case 'export_analytics':
        // Simulates a heavy CSV file generation
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return {
          downloadUrl: `/api/analytics/download-report/${job.id}`,
          fileSize: 1024,
        };

      case 'payment_webhook_process':
        const { paymentId, gateway } = job.data;
        // Verify payment in DB
        const payment = await prisma.payment.findUnique({
          where: { id: paymentId },
        });
        if (payment) {
          await prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'settled' },
          });
          // Generate invoice automatically
          await prisma.invoice.create({
            data: {
              userId: payment.userId,
              paymentId: payment.id,
              amount: payment.amount,
              description: `Invoice for ${payment.purpose}`,
              status: 'paid',
            },
          });
          console.log(`[Queue Worker] Payment settled & invoice generated for ID: ${paymentId}`);
        }
        return { success: true };

      case 'ai_document_analysis':
        // AI background indexing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return { parsedTags: ['Finance', 'Audit', 'Q3-Projections'] };

      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }
}

export const backgroundQueue = new BackgroundQueue();

// LIGHTWEIGHT CRON SCHEDULER LOOP
// Periodically checks for expirations and updates system settings/metrics
export function startCronScheduler() {
  console.log('[Scheduler] Background cron scheduler initialized.');

  // Run every 2 minutes
  setInterval(async () => {
    try {
      console.log('[Scheduler] Running scheduled task check...');
      
      // Task 1: Check document expirations near 30 days and alert owners
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 30);

      const nearExpiringDocs = await prisma.document.findMany({
        where: {
          expiryDate: {
            lte: targetDate,
            gte: new Date(),
          },
        },
      });

      for (const doc of nearExpiringDocs) {
        const owner = await prisma.user.findUnique({
          where: { id: doc.ownerId },
        });
        if (owner) {
          // Send alert email to user
          await sendEmail({
            to: owner.email,
            subject: `Action Required: Document Expiring Soon (${doc.fileName})`,
            text: `Hello ${owner.firstName},\n\nYour document "${doc.fileName}" is expiring on ${doc.expiryDate?.toLocaleDateString()}.\n\nPlease upload an updated version as soon as possible.\n\nBest regards,\nThe Antara Team`,
          });
        }
      }
      if (nearExpiringDocs.length > 0) {
        console.log(`[Scheduler] Sent near-expiry alerts to ${nearExpiringDocs.length} user(s).`);
      }
    } catch (error) {
      console.error('[Scheduler] Error running background cron jobs:', error);
    }
  }, 120000); // 120,000ms = 2 minutes
}
