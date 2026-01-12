import sql from "@/app/api/utils/sql";

/**
 * GET /api/products
 * Fetch all products with optional filtering by category
 * Query params: category (slug), featured (boolean), limit
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (categorySlug) {
      query += ` AND c.slug = $${paramCount}`;
      params.push(categorySlug);
      paramCount++;
    }

    if (featured === "true") {
      query += ` AND p.is_featured = true`;
    }

    query += ` ORDER BY p.created_at DESC`;

    if (limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit));
    }

    const products = await sql(query, params);

    return Response.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
