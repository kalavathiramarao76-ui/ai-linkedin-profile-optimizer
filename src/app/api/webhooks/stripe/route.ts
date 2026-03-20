import { NextRequest, NextResponse } from 'next/server';

// Stripe webhook handler
// In production, verify the webhook signature using STRIPE_WEBHOOK_SECRET
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }

    // In production, verify signature:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    // Parse the event
    let event;
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // Update user's plan in database
        // const userId = session.metadata?.userId;
        // await prisma.user.update({ where: { id: userId }, data: { plan: 'pro' } });
        console.log('Checkout completed:', session.id);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Downgrade user to free plan
        // const userId = subscription.metadata?.userId;
        // await prisma.user.update({ where: { id: userId }, data: { plan: 'free' } });
        console.log('Subscription cancelled:', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('Payment failed:', invoice.id);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
