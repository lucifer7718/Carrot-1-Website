import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

function formatPrice(amount: number) {
  return Math.round(amount * 100);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerName = String(body.customerName || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const addressLine1 = String(body.addressLine1 || "").trim();
    const addressLine2 = String(body.address2 || "").trim();
    const city = String(body.city || "").trim();
    const state = String(body.state || "").trim();
    const postalCode = String(body.postalCode || "").trim();
    const total = Number(body.total || 0);
    const items = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !email || !phone || !addressLine1 || !city || !state || !postalCode) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    if (items.length === 0 || total <= 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty or total is invalid" },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();

    const lastOrder = await prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: `CRT-${year}-`,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextNumber = 1001;

    if (lastOrder?.orderNumber) {
      const parts = lastOrder.orderNumber.split("-");
      const lastSequence = Number(parts[2]);

      if (!Number.isNaN(lastSequence)) {
        nextNumber = lastSequence + 1;
      }
    }

    const orderNumber = `CRT-${year}-${nextNumber}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        email,
        phone,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        postalCode,
        country: "India",
        subtotal: total,
        shipping: 0,
        total,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: String(item.id),
            name: String(item.name || ""),
            price: Number(String(item.price || "").replace(/[^\d]/g, "")) || 0,
            quantity: Number(item.quantity || 1),
            size: String(item.size || "") || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    const amountInPaise = formatPrice(total);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.id,
      notes: {
        orderNumber: order.orderNumber,
        orderId: order.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
    });
  } catch (error) {
    console.error("RAZORPAY_CREATE_ORDER_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
