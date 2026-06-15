import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { after } from "next/server";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

async function sendOrderEmails({ order }: { order: any }) {
  const orderItemsHtml = order.items
    .map(
      (item: any) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">${item.name}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">${item.size || "-"}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">${item.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">${formatPrice(item.price)}</td>
        </tr>
      `
    )
    .join("");

  const fullAddress = [
    order.addressLine1,
    order.addressLine2 || "",
    `${order.city}, ${order.state} - ${order.postalCode}`,
    "India",
  ]
    .filter(Boolean)
    .join("<br/>");

  const adminEmail = process.env.ADMIN_ORDER_EMAIL;

  if (adminEmail) {
    try {
      await sendEmail({
        to: adminEmail,
        subject: `New Order Received (Paid) - ${order.orderNumber}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#111827;">
            <h2>New paid order received</h2>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <h3>Shipping Address</h3>
            <p>${fullAddress}</p>
            <h3>Order Items</h3>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="text-align:left;">
                  <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Item</th>
                  <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Size</th>
                  <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Qty</th>
                  <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Price</th>
                </tr>
              </thead>
              <tbody>${orderItemsHtml}</tbody>
            </table>
          </div>
        `,
      });
    } catch (error) {
      console.error("ADMIN_PAID_ORDER_EMAIL_ERROR", error);
    }
  }

  try {
    await sendEmail({
      to: order.email,
      subject: `Order Confirmed (Paid) - ${order.orderNumber}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#111827;">
          <h2>Thank you for your order, ${order.customerName}!</h2>
          <p>Your payment has been received and your order is now confirmed.</p>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Total:</strong> ${formatPrice(order.total)}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <h3>Shipping Address</h3>
          <p>${fullAddress}</p>
          <h3>Order Summary</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="text-align:left;">
                <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Item</th>
                <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Size</th>
                <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Qty</th>
                <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Price</th>
              </tr>
            </thead>
            <tbody>${orderItemsHtml}</tbody>
          </table>
        </div>
      `,
    });
  } catch (error) {
    console.error("CUSTOMER_PAID_ORDER_EMAIL_ERROR", error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("VERIFY_BODY", JSON.stringify(body, null, 2));

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      console.log("VERIFY_MISSING_FIELDS", { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId });
      return NextResponse.json(
        { success: false, message: "Invalid payment data" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    console.log("VERIFY_SECRET_PRESENT", !!secret);
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "Razorpay secret key is missing" },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    console.log("VERIFY_SIGNATURES", {
      razorpayOrderId,
      razorpayPaymentId,
      generatedSignature,
      receivedSignature: razorpaySignature,
      match: generatedSignature === razorpaySignature,
    });

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
            status: "PAID",
            razorpayOrderId,
            paymentId: razorpayPaymentId,
    },
      include: { items: true },
    });

    after(async () => {
      await sendOrderEmails({ order: updatedOrder });
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderNumber: updatedOrder.orderNumber,
      orderId: updatedOrder.id,
    });
  } catch (error) {
    console.error("RAZORPAY_VERIFY_PAYMENT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}