import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStatusEmailContent(order: {
  orderNumber: string;
  customerName: string;
  status: string;
  total: number;
  courierName?: string | null;
  trackingNumber?: string | null;
}) {
  const status = String(order.status).toUpperCase();

  const subjectMap: Record<string, string> = {
    PENDING: `Order Received - ${order.orderNumber}`,
    PAID: `Payment Received - ${order.orderNumber}`,
    SHIPPED: `Your Order Has Been Shipped - ${order.orderNumber}`,
    DELIVERED: `Order Delivered - ${order.orderNumber}`,
    CANCELLED: `Order Cancelled - ${order.orderNumber}`,
  };

  const messageMap: Record<string, string> = {
    PENDING: "We have received your order and it is currently pending review.",
    PAID: "We have received your payment and your order is now confirmed.",
    SHIPPED: "Good news — your order has been shipped and is on the way.",
    DELIVERED: "Your order has been delivered successfully.",
    CANCELLED:
      "Your order has been cancelled. If you have any questions, please contact our support team.",
  };

  const extraTrackingHtml =
    status === "SHIPPED" && (order.courierName || order.trackingNumber)
      ? `
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:20px;">
          <h3 style="margin:0 0 12px 0;">Shipping Details</h3>
          ${
            order.courierName
              ? `<p style="margin:0 0 8px 0;"><strong>Courier:</strong> ${order.courierName}</p>`
              : ""
          }
          ${
            order.trackingNumber
              ? `<p style="margin:0;"><strong>Tracking Number:</strong> ${order.trackingNumber}</p>`
              : ""
          }
        </div>
      `
      : "";

  return {
    subject: subjectMap[status] || `Order Update - ${order.orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#111827;">
        <h2 style="margin-bottom:8px;">Order status updated</h2>
        <p style="margin-bottom:20px;">Hello ${order.customerName},</p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:20px;">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Current Status:</strong> ${order.status}</p>
          <p><strong>Order Total:</strong> ${formatPrice(order.total)}</p>
        </div>

        ${extraTrackingHtml}

        <p style="line-height:1.7;margin-bottom:20px;">
          ${messageMap[status] || "Your order status has been updated."}
        </p>

        <p style="line-height:1.7;">
          Thank you for shopping with us.
        </p>
      </div>
    `,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("GET_ORDER_BY_ID_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to load order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();

    console.log("PATCH ORDER BODY:", body);

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    let normalizedStatus: OrderStatus | undefined = undefined;

    if (body.status !== undefined && body.status !== null && body.status !== "") {
      const statusValue = String(body.status).toUpperCase().trim();

      if (
        statusValue === OrderStatus.PENDING ||
        statusValue === OrderStatus.PAID ||
        statusValue === OrderStatus.SHIPPED ||
        statusValue === OrderStatus.DELIVERED ||
        statusValue === OrderStatus.CANCELLED
      ) {
        normalizedStatus = statusValue as OrderStatus;
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid order status" },
          { status: 400 }
        );
      }
    }

    const updateData: {
      customerName?: string;
      email?: string;
      phone?: string;
      addressLine1?: string;
      addressLine2?: string | null;
      city?: string;
      state?: string;
      postalCode?: string;
      status?: OrderStatus;
      trackingNumber?: string | null;
      courierName?: string | null;
    } = {};

    if (body.customerName !== undefined) {
      updateData.customerName = String(body.customerName).trim();
    }

    if (body.email !== undefined) {
      updateData.email = String(body.email).trim();
    }

    if (body.phone !== undefined) {
      updateData.phone = String(body.phone).trim();
    }

    if (body.addressLine1 !== undefined) {
      updateData.addressLine1 = String(body.addressLine1).trim();
    }

    if (body.addressLine2 !== undefined) {
      updateData.addressLine2 = String(body.addressLine2).trim() || null;
    }

    if (body.city !== undefined) {
      updateData.city = String(body.city).trim();
    }

    if (body.state !== undefined) {
      updateData.state = String(body.state).trim();
    }

    if (body.postalCode !== undefined) {
      updateData.postalCode = String(body.postalCode).trim();
    }

    if (body.trackingNumber !== undefined) {
      updateData.trackingNumber = String(body.trackingNumber).trim() || null;
    }

    if (body.courierName !== undefined) {
      updateData.courierName = String(body.courierName).trim() || null;
    }

    if (normalizedStatus !== undefined) {
      updateData.status = normalizedStatus;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: true,
      },
    });

    const oldStatus = String(existingOrder.status).toUpperCase();
    const newStatus = String(updatedOrder.status).toUpperCase();
    const statusChanged = oldStatus !== newStatus;

    console.log("OLD STATUS:", oldStatus);
    console.log("NEW STATUS:", newStatus);
    console.log("STATUS CHANGED:", statusChanged);
    console.log("UPDATED ORDER EMAIL:", updatedOrder.email);

    if (statusChanged && updatedOrder.email) {
      try {
        const emailContent = getStatusEmailContent({
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.customerName,
          status: String(updatedOrder.status),
          total: Number(updatedOrder.total),
          courierName: updatedOrder.courierName,
          trackingNumber: updatedOrder.trackingNumber,
        });

        console.log("SENDING STATUS EMAIL TO:", updatedOrder.email);
        console.log("EMAIL SUBJECT:", emailContent.subject);

        const emailResult = await sendEmail({
          to: updatedOrder.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });

        console.log("STATUS EMAIL SENT SUCCESS:", emailResult);
      } catch (emailError) {
        console.error("ORDER_STATUS_EMAIL_ERROR:", emailError);
      }
    } else {
      console.log("STATUS EMAIL SKIPPED");
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UPDATE_ORDER_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_ORDER_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete order" },
      { status: 500 }
    );
  }
}