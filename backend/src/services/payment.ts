import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy load Stripe to prevent crash on startup if key is missing
let stripeClient: Stripe | null = null;
function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.trim() === '') {
    throw new Error('STRIPE_SECRET_KEY is not defined in the environment. Please configure it in your .env file to enable Stripe payments.');
  }
    if (!stripeClient) {
      stripeClient = new Stripe(secretKey, {
        apiVersion: '2026-06-24.dahlia',
      });
    }
  return stripeClient;
}

// Lazy load Razorpay to prevent crash on startup if key is missing
let razorpayClient: Razorpay | null = null;
function getRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || keyId.trim() === '' || keySecret.trim() === '') {
    throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in the environment. Please configure them in your .env file to enable Razorpay payments.');
  }
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayClient;
}

/**
 * Creates a Razorpay Order
 */
export async function createRazorpayOrder(amount: number, receiptId: string): Promise<any> {
  const razorpay = getRazorpayClient();
  const options = {
    amount: Math.round(amount * 100), // Amount in paise/cents
    currency: 'INR',
    receipt: receiptId,
  };
  return razorpay.orders.create(options);
}

/**
 * Verifies Razorpay Webhook/Callback Payment Signature
 */
export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET is missing. Cannot verify payment signature.');
  }
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  return generatedSignature === signature;
}

/**
 * Creates a Stripe Payment Intent
 */
export async function createStripePaymentIntent(amount: number, metadata: Record<string, string>): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Amount in cents
    currency: 'usd',
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

/**
 * Executes a refund on the gateway
 */
export async function refundGatewayPayment(gateway: string, gatewayPaymentId: string, amount: number): Promise<any> {
  if (gateway === 'razorpay') {
    const razorpay = getRazorpayClient();
    return razorpay.payments.refund(gatewayPaymentId, {
      amount: Math.round(amount * 100),
    });
  } else if (gateway === 'stripe') {
    const stripe = getStripeClient();
    return stripe.refunds.create({
      payment_intent: gatewayPaymentId,
      amount: Math.round(amount * 100),
    });
  } else {
    throw new Error(`Unsupported gateway for refund: ${gateway}`);
  }
}
