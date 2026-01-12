import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * Helper function to get user ID (session-based or guest)
 */
async function getUserId(request) {
  const session = await auth();
  if (session?.user?.id) {
    return session.user.id;
  }

  // For guests, use a session ID from cookies or create one
  const cookies = request.headers.get("cookie") || "";
  const sessionMatch = cookies.match(/guest_session=([^;]+)/);

  if (sessionMatch) {
    return `guest_${sessionMatch[1]}`;
  }

  // Generate a new guest session ID
  return `guest_${crypto.randomUUID()}`;
}

/**
 * GET /api/cart
 * Fetch cart items for current user/guest
 */
export async function GET(request) {
  try {
    const userId = await getUserId(request);

    const cartItems = await sql`
      SELECT 
        c.id,
        c.quantity,
        p.id as product_id,
        p.name,
        p.price,
        p.image_url,
        p.stock_quantity
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ${userId}
      ORDER BY c.created_at DESC
    `;

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);

    const response = Response.json({
      cartItems,
      total: total.toFixed(2),
      count: cartItems.length,
    });

    // Set guest session cookie if it's a guest
    if (userId.startsWith("guest_")) {
      const sessionId = userId.replace("guest_", "");
      response.headers.set(
        "Set-Cookie",
        `guest_session=${sessionId}; Path=/; Max-Age=2592000; SameSite=Lax`,
      );
    }

    return response;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

/**
 * POST /api/cart
 * Add item to cart
 */
export async function POST(request) {
  try {
    const userId = await getUserId(request);
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Check if item already exists in cart
    const existing = await sql`
      SELECT * FROM cart_items
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;

    if (existing.length > 0) {
      // Update quantity
      await sql`
        UPDATE cart_items
        SET quantity = quantity + ${quantity}
        WHERE user_id = ${userId} AND product_id = ${productId}
      `;
    } else {
      // Add new item
      await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${productId}, ${quantity})
      `;
    }

    const response = Response.json({ success: true });

    // Set guest session cookie if it's a guest
    if (userId.startsWith("guest_")) {
      const sessionId = userId.replace("guest_", "");
      response.headers.set(
        "Set-Cookie",
        `guest_session=${sessionId}; Path=/; Max-Age=2592000; SameSite=Lax`,
      );
    }

    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return Response.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

/**
 * PUT /api/cart
 * Update cart item quantity
 */
export async function PUT(request) {
  try {
    const userId = await getUserId(request);
    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || quantity === undefined) {
      return Response.json(
        { error: "Cart item ID and quantity are required" },
        { status: 400 },
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await sql`
        DELETE FROM cart_items
        WHERE id = ${cartItemId} AND user_id = ${userId}
      `;
    } else {
      await sql`
        UPDATE cart_items
        SET quantity = ${quantity}
        WHERE id = ${cartItemId} AND user_id = ${userId}
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return Response.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

/**
 * DELETE /api/cart
 * Remove item from cart
 */
export async function DELETE(request) {
  try {
    const userId = await getUserId(request);
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("id");

    if (!cartItemId) {
      return Response.json(
        { error: "Cart item ID is required" },
        { status: 400 },
      );
    }

    await sql`
      DELETE FROM cart_items
      WHERE id = ${cartItemId} AND user_id = ${userId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return Response.json(
      { error: "Failed to remove from cart" },
      { status: 500 },
    );
  }
}
