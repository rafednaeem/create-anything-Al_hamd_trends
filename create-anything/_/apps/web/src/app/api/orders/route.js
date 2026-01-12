import sql from "@/app/api/utils/sql";

/**
 * Generate a unique order number
 */
function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * POST /api/orders
 * Create a new order from cart
 */
export async function POST(request) {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      city,
      postalCode,
      paymentMethod,
      notes,
      cartItems,
      totalAmount,
    } = await request.json();

    // Validation
    if (!customerName || !customerPhone || !deliveryAddress || !paymentMethod) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!cartItems || cartItems.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    // Create order and order items in a transaction
    const [orderResult] = await sql.transaction([
      sql`
        INSERT INTO orders (
          order_number,
          customer_name,
          customer_phone,
          customer_email,
          delivery_address,
          city,
          postal_code,
          total_amount,
          payment_method,
          notes
        ) VALUES (
          ${orderNumber},
          ${customerName},
          ${customerPhone},
          ${customerEmail || null},
          ${deliveryAddress},
          ${city || null},
          ${postalCode || null},
          ${totalAmount},
          ${paymentMethod},
          ${notes || null}
        )
        RETURNING *
      `,
      // Insert order items
      ...cartItems.map(
        (item) => sql`
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          product_price,
          quantity,
          subtotal
        )
        SELECT 
          (SELECT id FROM orders WHERE order_number = ${orderNumber}),
          ${item.product_id},
          ${item.name},
          ${item.price},
          ${item.quantity},
          ${parseFloat(item.price) * item.quantity}
      `,
      ),
    ]);

    return Response.json({
      success: true,
      order: orderResult[0],
      orderNumber,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}

/**
 * GET /api/orders
 * Get order by order number
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return Response.json(
        { error: "Order number is required" },
        { status: 400 },
      );
    }

    const orders = await sql`
      SELECT * FROM orders
      WHERE order_number = ${orderNumber}
      LIMIT 1
    `;

    if (orders.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orders[0];

    // Get order items
    const items = await sql`
      SELECT * FROM order_items
      WHERE order_id = ${order.id}
    `;

    // Get payment proof if exists
    const proofs = await sql`
      SELECT * FROM payment_proofs
      WHERE order_id = ${order.id}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    return Response.json({
      order,
      items,
      paymentProof: proofs.length > 0 ? proofs[0] : null,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
