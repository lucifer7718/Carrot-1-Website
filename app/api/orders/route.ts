import { NextResponse } from "next/server";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

async function sendOrderEmails({
  order,
  customerName,
  email,
  phone,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
}: {
  order: any;
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}) {
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
    addressLine1,
    addressLine2 || "",
    `${city}, ${state} - ${postalCode}`,
    "India",
  ]
    .filter(Boolean)
    .join("<br/>");

  const adminEmail = process.env.ADMIN_ORDER_EMAIL;

  if (adminEmail) {
    try {
      await sendEmail({
        to: adminEmail,
        subject: `New Order Received - ${order.orderNumber}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#111827;">
            <h2 style="margin-bottom:8px;">New order received</h2>
            <p style="margin-bottom:20px;">A new order has been placed on your store.</p>

            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:20px;">
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>

            <h3 style="margin-bottom:12px;">Shipping Address</h3>
            <p style="line-height:1.7;margin-bottom:20px;">${fullAddress}</p>

            <h3 style="margin-bottom:12px;">Order Items</h3>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="text-align:left;">
                  <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Item</th>
                  <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Size</th>
                  <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Qty</th>
                  <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
            </table>
          </div>
        `,
      });
      console.log("ADMIN ORDER EMAIL SENT");
    } catch (error) {
      console.error("ADMIN_ORDER_EMAIL_ERROR", error);
    }
  }

  try {
    await sendEmail({
      to: email,
      subject: `Order Confirmed - ${order.orderNumber}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#111827;">
          <h2 style="margin-bottom:8px;">Thank you for your order, ${customerName}!</h2>
          <p style="margin-bottom:20px;">
            We have received your order and it is now being processed.
          </p>

          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:20px;">
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Total:</strong> ${formatPrice(order.total)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>

          <h3 style="margin-bottom:12px;">Shipping Address</h3>
          <p style="line-height:1.7;margin-bottom:20px;">${fullAddress}</p>

          <h3 style="margin-bottom:12px;">Order Summary</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="text-align:left;">
                <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Item</th>
                <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Size</th>
                <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Qty</th>
                <th style="padding:10px 0;border-bottom:1px solid #d1d5db;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>

          <p style="margin-top:24px;line-height:1.7;">
            We will contact you if we need any additional information regarding your order.
          </p>
        </div>
      `,
    });
    console.log("CUSTOMER ORDER EMAIL SENT");
  } catch (error) {
    console.error("CUSTOMER_ORDER_EMAIL_ERROR", error);
  }
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

    if (
      !customerName ||
      !email ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty" },
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

    after(async () => {
      await sendOrderEmails({
        order,
        customerName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_ORDER_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 }
    );
  }
}