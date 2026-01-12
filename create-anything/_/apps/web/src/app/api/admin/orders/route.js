import sql from "@/app/api/utils/sql";

/**
 * GET /api/admin/orders
 * Get all orders (Admin only)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND o.order_status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    const orders = await sql(query, params);

    return Response.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/orders
 * Update order status (Admin only)
 */
export async function PUT(request) {
  try {
    const { orderId, orderStatus, paymentStatus } = await request.json();

    if (!orderId) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (orderStatus) {
      updates.push(`order_status = $${paramCount}`);
      values.push(orderStatus);
      paramCount++;
    }

    if (paymentStatus) {
      updates.push(`payment_status = $${paramCount}`);
      values.push(paymentStatus);
      paramCount++;
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE orders
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(orderId);

    const result = await sql(query, values);

    return Response.json({
      success: true,
      order: result[0],
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
