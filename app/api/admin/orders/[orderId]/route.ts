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

function getStatusMeta(status: string) {
  const normalized = String(status).toUpperCase();

  const map: Record<
    string,
    {
      label: string;
      subject: string;
      title: string;
      message: string;
      badgeBg: string;
      badgeColor: string;
      accent: string;
    }
  > = {
    PENDING: {
      label: "Pending",
      subject: "Your order has been received",
      title: "We’ve received your order",
      message:
        "Your order is now in our system and is waiting to be processed. We’ll update you again as soon as it moves forward.",
      badgeBg: "#FFF7ED",
      badgeColor: "#C2410C",
      accent: "#F97316",
    },
    PAID: {
      label: "Paid",
      subject: "Payment received for your order",
      title: "Payment received",
      message:
        "We’ve successfully received your payment. Your order is now confirmed and will be prepared for shipment.",
      badgeBg: "#ECFDF3",
      badgeColor: "#047857",
      accent: "#10B981",
    },
    SHIPPED: {
      label: "Shipped",
      subject: "Your order is on the way",
      title: "Your order has been shipped",
      message:
        "Good news — your order is now on the way. You can use the shipping details below to track the delivery.",
      badgeBg: "#EFF6FF",
      badgeColor: "#1D4ED8",
      accent: "#2563EB",
    },
    DELIVERED: {
      label: "Delivered",
      subject: "Your order has been delivered",
      title: "Order delivered",
      message:
        "Your order has been marked as delivered. We hope you love it and enjoy your purchase.",
      badgeBg: "#F0FDF4",
      badgeColor: "#15803D",
      accent: "#22C55E",
    },
    CANCELLED: {
      label: "Cancelled",
      subject: "Your order has been cancelled",
      title: "Order cancelled",
      message:
        "Your order has been cancelled. If this was unexpected or you need help, please reply to this email.",
      badgeBg: "#FEF2F2",
      badgeColor: "#B91C1C",
      accent: "#EF4444",
    },
  };

  return (
    map[normalized] || {
      label: normalized,
      subject: "Your order status was updated",
      title: "Order status updated",
      message: "There is a new update on your order.",
      badgeBg: "#F3F4F6",
      badgeColor: "#374151",
      accent: "#111827",
    }
  );
}

function getStatusEmailContent(order: {
  orderNumber: string;
  customerName: string;
  status: string;
  total: number;
  courierName?: string | null;
  trackingNumber?: string | null;
}) {
  const meta = getStatusMeta(order.status);

  const trackingBlock =
    String(order.status).toUpperCase() === "SHIPPED" &&
    (order.courierName || order.trackingNumber)
      ? `
        <tr>
          <td style="padding:0 32px 24px 32px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;background:#F8FAFC;border:1px solid #E5E7EB;border-radius:16px;">
              <tr>
                <td style="padding:20px 20px 8px 20px;font-size:16px;line-height:24px;font-weight:700;color:#111827;">
                  Shipping details
                </td>
              </tr>
              ${
                order.courierName
                  ? `
                    <tr>
                      <td style="padding:0 20px 8px 20px;font-size:14px;line-height:22px;color:#4B5563;">
                        <strong style="color:#111827;">Courier:</strong> ${order.courierName}
                      </td>
                    </tr>
                  `
                  : ""
              }
              ${
                order.trackingNumber
                  ? `
                    <tr>
                      <td style="padding:0 20px 20px 20px;font-size:14px;line-height:22px;color:#4B5563;">
                        <strong style="color:#111827;">Tracking Number:</strong> ${order.trackingNumber}
                      </td>
                    </tr>
                  `
                  : ""
              }
            </table>
          </td>
        </tr>
      `
      : "";

  return {
    subject: `${meta.subject} • ${order.orderNumber}`,
    html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${meta.subject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F3F4F6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${meta.subject}. Order ${order.orderNumber} is now ${meta.label}.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;background-color:#F3F4F6;margin:0;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;max-width:640px;background:#FFFFFF;border-radius:24px;overflow:hidden;">
            
            <tr>
              <td style="padding:28px 32px;background:linear-gradient(135deg, ${meta.accent} 0%, #111827 100%);">
                <div style="font-size:13px;line-height:20px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.75);font-weight:700;">
                  Carrot
                </div>
                <div style="padding-top:12px;font-size:28px;line-height:36px;font-weight:700;color:#FFFFFF;">
                  ${meta.title}
                </div>
                <div style="padding-top:10px;font-size:15px;line-height:24px;color:rgba(255,255,255,0.88);max-width:460px;">
                  Hi ${order.customerName}, ${meta.message}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <span style="display:inline-block;padding:8px 14px;border-radius:999px;background:${meta.badgeBg};color:${meta.badgeColor};font-size:13px;line-height:18px;font-weight:700;">
                  ${meta.label}
                </span>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 32px 24px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;">
                  <tr>
                    <td style="padding:20px 20px 12px 20px;font-size:16px;line-height:24px;font-weight:700;color:#111827;">
                      Order summary
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 20px 10px 20px;font-size:14px;line-height:22px;color:#4B5563;">
                      <strong style="color:#111827;">Order Number:</strong> ${order.orderNumber}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 20px 10px 20px;font-size:14px;line-height:22px;color:#4B5563;">
                      <strong style="color:#111827;">Current Status:</strong> ${meta.label}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 20px 20px 20px;font-size:14px;line-height:22px;color:#4B5563;">
                      <strong style="color:#111827;">Order Total:</strong> ${formatPrice(order.total)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            ${trackingBlock}

            <tr>
              <td style="padding:0 32px 24px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;background:#FFFBEB;border:1px solid #FDE68A;border-radius:16px;">
                  <tr>
                    <td style="padding:18px 20px;font-size:14px;line-height:24px;color:#78350F;">
                      Please keep this email for your records. If you have any questions about your order, reply to this email and our team will help you.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 32px 32px 32px;font-size:13px;line-height:22px;color:#6B7280;">
                Thanks for shopping with <strong style="color:#111827;">Carrot</strong>.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
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
    console.error("ADMIN_GET_ORDER_BY_ID_ERROR", error);
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

    console.log("ADMIN PATCH ORDER BODY:", body);

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

    console.log("ADMIN OLD STATUS:", oldStatus);
    console.log("ADMIN NEW STATUS:", newStatus);
    console.log("ADMIN STATUS CHANGED:", statusChanged);
    console.log("ADMIN UPDATED ORDER EMAIL:", updatedOrder.email);

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

        console.log("ADMIN SENDING STATUS EMAIL TO:", updatedOrder.email);
        console.log("ADMIN EMAIL SUBJECT:", emailContent.subject);

        const emailResult = await sendEmail({
          to: updatedOrder.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });

        console.log("ADMIN STATUS EMAIL SENT SUCCESS:", emailResult);
      } catch (emailError) {
        console.error("ADMIN ORDER STATUS EMAIL ERROR:", emailError);
      }
    } else {
      console.log("ADMIN STATUS EMAIL SKIPPED");
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("ADMIN_UPDATE_ORDER_ERROR", error);
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
    console.error("ADMIN_DELETE_ORDER_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete order" },
      { status: 500 }
    );
  }
}