"use strict";
// import { Request, Response } from "express";
// // import { Subscription } from "../app/modules/payment/payment.model";
// import { MemberShip } from "../app/modules/memberShip/memberShip.model";
// import config, { stripe } from "../config";
// import Stripe from "stripe";
// import { Subscription } from "../app/modules/user/subscription.ts/subscription.Model";
// if (!config.stripe_secrete_key) {
//   throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
// }
// export async function stripeWebhook(req: Request, res: Response) {
//   const sig = req.headers["stripe-signature"] as string;
//   let event: Stripe.Event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body, // ⚠ raw body required
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );
//   } catch (err: any) {
//     console.error("❌ Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
//   try {
//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object as Stripe.Checkout.Session;
//         const subscriptionId = session.metadata?.subscriptionId;
//         if (!subscriptionId) break;
//         const sub = await Subscription.findById(subscriptionId) as any;
//         if (!sub) break;
//         const membership = await MemberShip.findById(sub.membershipId);
//         if (!membership) break;
//         const now = new Date();
//         const endDate = new Date(now);
//         // ✅ Calculate end date
//         if (membership.type === "recurring") {
//           switch (membership.interval) {
//             case "day":
//               endDate.setDate(endDate.getDate() + 1);
//               break;
//             case "week":
//               endDate.setDate(endDate.getDate() + 7);
//               break;
//             case "month":
//               endDate.setMonth(endDate.getMonth() + 1);
//               break;
//             case "year":
//               endDate.setFullYear(endDate.getFullYear() + 1);
//               break;
//             default:
//               endDate.setDate(endDate.getDate() + 7); // fallback weekly
//           }
//         } else {
//           // One-time plan
//           endDate.setMonth(
//             endDate.getMonth() + (membership.durationInMonths || 1)
//           );
//         }
//         // ✅ Update subscription in DB
//         sub.status = "active";
//         sub.startDate = new Date();
//         sub.endDate = endDate;
//         if (membership.signUpFee > 0) sub.signUpFeePaid = true;
//         if (membership.refundableDeposit > 0) sub.refundableDepositPaid = true;
//         await sub.save();
//         console.log("✅ Subscription activated:", sub._id);
//         // 🔹 Send completed invoice for one-time payments
//         if (membership.type === "onetime" && session.customer) {
//           try {
//             const totalAmount =
//               membership.price +
//               (membership.signUpFee || 0) +
//               (membership.refundableDeposit || 0);
//             // Create invoice item
//             await stripe.invoiceItems.create({
//               customer: session.customer as string,
//               amount: totalAmount * 100,
//               currency: "usd",
//               description: membership.description,
//             });
//             // Create invoice
//             const invoice = await stripe.invoices.create({
//               customer: session.customer as string,
//               collection_method: "send_invoice",
//               days_until_due: 0,
//             });
//             // Only finalize if invoice.id exists
//             if (!invoice.id) {
//               console.error(
//                 "❌ Invoice ID is undefined, cannot finalize invoice."
//               );
//             } else {
//               await stripe.invoices.finalizeInvoice(invoice.id);
//               console.log("📄 Invoice sent to customer:", session.customer);
//             }
//           } catch (err: any) {
//             console.error("❌ Failed to send invoice:", err.message);
//           }
//         }
//         break;
//       }
//       case "invoice.payment_failed": {
//         const invoice = event.data.object as Stripe.Invoice;
//         const subscriptionId: string | null =
//           invoice.parent?.subscription_details?.metadata?.subscriptionId ||
//           (typeof (invoice as any).subscription === "string" ? (invoice as any).subscription : null);
//         if (subscriptionId) {
//           console.log("⚠️ Payment failed for subscription:", subscriptionId);
//           // Optionally: update subscription status in DB
//           // await Subscription.findByIdAndUpdate(subscriptionId, { status: 'past_due' });
//         } else {
//           console.log(
//             "⚠️ Payment failed, but no subscription attached to invoice"
//           );
//         }
//         break;
//       }
//       default:
//         console.log(`ℹ️ Unhandled event type: ${event.type}`);
//     }
//     res.json({ received: true });
//   } catch (err: any) {
//     console.error("❌ Webhook handling error:", err.message);
//     res.status(500).send("Webhook handling failed");
//   }
// }
