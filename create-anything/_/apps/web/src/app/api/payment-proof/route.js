import sql from "@/app/api/utils/sql";
import { upload } from "@/app/api/utils/upload";

/**
 * POST /api/payment-proof
 * Upload payment proof for an order
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const orderNumber = formData.get("orderNumber");
    const file = formData.get("file");

    if (!orderNumber || !file) {
      return Response.json(
        { error: "Order number and file are required" },
        { status: 400 },
      );
    }

    // Get order
    const orders = await sql`
      SELECT * FROM orders
      WHERE order_number = ${orderNumber}
      LIMIT 1
    `;

    if (orders.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orders[0];

    // Upload file
    const fileUrl = await upload(file);

    // Save payment proof
    await sql`
      INSERT INTO payment_proofs (order_id, proof_image_url)
      VALUES (${order.id}, ${fileUrl})
    `;

    // Update order payment status
    await sql`
      UPDATE orders
      SET payment_status = 'proof_uploaded'
      WHERE id = ${order.id}
    `;

    return Response.json({
      success: true,
      fileUrl,
    });
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    return Response.json(
      { error: "Failed to upload payment proof" },
      { status: 500 },
    );
  }
}
