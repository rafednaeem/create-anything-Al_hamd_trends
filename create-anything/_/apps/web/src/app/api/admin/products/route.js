import sql from "@/app/api/utils/sql";
import { upload } from "@/app/api/utils/upload";

/**
 * POST /api/admin/products
 * Create a new product (Admin only)
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const stockQuantity = formData.get("stockQuantity");
    const isFeatured = formData.get("isFeatured") === "true";
    const file = formData.get("file");

    if (!name || !price || !categoryId) {
      return Response.json(
        { error: "Name, price, and category are required" },
        { status: 400 },
      );
    }

    // Upload image if provided
    let imageUrl = null;
    if (file) {
      imageUrl = await upload(file);
    }

    const result = await sql`
      INSERT INTO products (
        name,
        description,
        price,
        category_id,
        image_url,
        stock_quantity,
        is_featured
      ) VALUES (
        ${name},
        ${description || null},
        ${price},
        ${categoryId},
        ${imageUrl},
        ${stockQuantity || 0},
        ${isFeatured}
      )
      RETURNING *
    `;

    return Response.json({
      success: true,
      product: result[0],
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/products
 * Update an existing product (Admin only)
 */
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const productId = formData.get("productId");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const stockQuantity = formData.get("stockQuantity");
    const isFeatured = formData.get("isFeatured") === "true";
    const file = formData.get("file");

    if (!productId) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (description !== null) {
      updates.push(`description = $${paramCount}`);
      values.push(description || null);
      paramCount++;
    }

    if (price) {
      updates.push(`price = $${paramCount}`);
      values.push(price);
      paramCount++;
    }

    if (categoryId) {
      updates.push(`category_id = $${paramCount}`);
      values.push(categoryId);
      paramCount++;
    }

    if (stockQuantity !== null) {
      updates.push(`stock_quantity = $${paramCount}`);
      values.push(stockQuantity || 0);
      paramCount++;
    }

    updates.push(`is_featured = $${paramCount}`);
    values.push(isFeatured);
    paramCount++;

    // Upload new image if provided
    if (file) {
      const imageUrl = await upload(file);
      updates.push(`image_url = $${paramCount}`);
      values.push(imageUrl);
      paramCount++;
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE products
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(productId);

    const result = await sql(query, values);

    return Response.json({
      success: true,
      product: result[0],
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/products?id=123
 * Delete a product (Admin only)
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await sql`
      DELETE FROM products
      WHERE id = ${productId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
