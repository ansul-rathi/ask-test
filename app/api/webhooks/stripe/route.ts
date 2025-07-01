// import { NextResponse } from 'next/server';
// import { headers } from 'next/headers';
// import stripe from '@/app/lib/stripe';
// import { getUserByStripeId } from '@/app/services/auth';
// import CreditsService from '@/app/services/credits-service';

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function POST(req: Request) {
//   try {
//     const body = await req.text();
//     const signature = headers().get('stripe-signature')!;

//     let event;
//     try {
//       event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//     } catch (err: any) {
//       console.error(`Webhook signature verification failed: ${err.message}`);
//       return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
//     }

//     switch (event.type) {
//        // Add checkout session completed handler
//        case 'checkout.session.completed': {
//         const session = event.data.object;
//         console.log('Checkout session completed:', {
//           sessionId: session.id,
//           customerId: session.customer,
//           eventType: event.type
//         });
      
//         const userId = await getUserByStripeId(session.customer as string);
//         console.log('Found userId:', userId);
              
//         if (userId) {
//           try {
//             // Reset credits when payment is successful
//             await CreditsService.refreshCredits(userId);
//             console.log('Credits reset successfully for user:', userId);
//           } catch (error) {
//             console.error('Error resetting credits:', error);
//           }
//         } else {
//           console.error('User not found for checkout session:', session.id);
//         }
//         break;
//       }

//       case 'customer.subscription.created':
//       case 'customer.subscription.resumed': {
//         const subscription = event.data.object;
//         const userId = await getUserByStripeId(subscription.customer as string);
        
//         if (userId) {
//           if (subscription.status === 'active') {
//             await CreditsService.refreshCredits(userId);
//           } else if (subscription.status === 'past_due') {
//             await CreditsService.handlePaymentFailed(userId);
//           }
//         } else {
//           console.error('User not found for stripeCustomerId:', subscription.customer);
//         }
//         break;
//       }

//       case 'customer.subscription.deleted': {
//         const cancelledSubscription = event.data.object;
//         const cancelledUserId = await getUserByStripeId(cancelledSubscription.customer as string);
        
//         if (cancelledUserId) {
//           await CreditsService.cancelSubscription(cancelledUserId);
//         }
//         break;
//       }

//       case 'invoice.payment_failed': {
//         const failedInvoice = event.data.object;
//         const userId = await getUserByStripeId(failedInvoice.customer as string);
        
//         if (userId) {
//           await CreditsService.handlePaymentFailed(userId);
//         }
//         break;
//       }

//       case 'customer.subscription.paused': {
//         const subscription = event.data.object;
//         const userId = await getUserByStripeId(subscription.customer as string);
        
//         if (userId) {
//           await CreditsService.handlePaymentFailed(userId);
//         }
//         break;
//       }


//       // Add payment intent succeeded handler for one-time payments
//       case 'payment_intent.succeeded': {
//         const paymentIntent = event.data.object;
//         const userId = await getUserByStripeId(paymentIntent.customer as string);
        
//         if (userId) {
//           // You could handle different payment amounts differently
//           await CreditsService.refreshCredits(userId);
//           console.log('Payment successful, credits refreshed for user:', userId);
//         }
//         break;
//       }
//     }
//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error('Error processing webhook:', error);
//     return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
//   }
// }


// app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { refreshCredits } from '../../credits/[userId]/utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log('🎉 Webhook received');
  
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
      console.log('✅ Webhook verified | Event:', event.type);
    } catch (err: any) {
      console.error('❌ Webhook verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💳 Payment successful, session:', session.id);

        if (session.metadata?.userId) {
          try {
            await refreshCredits(session.metadata.userId, session.metadata.plan);
            console.log('✨ Credits reset for user:', session.metadata.userId);
          } catch (error) {
            console.error('❌ Error resetting credits:', error);
            throw error;
          }
        } else {
          console.warn('⚠️ No userId in session metadata');
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('📅 Subscription event:', subscription.id);

        if (subscription.metadata?.userId) {
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            await refreshCredits(subscription.metadata.userId, subscription.metadata.plan);
            console.log('✨ Credits reset for subscription:', subscription.id);
          }
        }
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('⚠️ Trial ending soon for subscription:', subscription.id);
        
        // Here you could implement logic to notify users about their trial ending
        // For example, send an email notification
        break;
      }

      default: {
        console.log('👉 Unhandled event type:', event.type);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}