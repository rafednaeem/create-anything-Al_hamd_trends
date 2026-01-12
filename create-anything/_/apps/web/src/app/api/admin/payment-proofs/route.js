import sql from "@/app/api/utils/sql";

/**
 * PUT /api/admin/payment-proofs
 * Verify or reject payment proof (Admin only)
 */
export async function PUT(request) {
  try {
    const { proofId, status, adminEmail } = await request.json();

    if (!proofId || !status) {
      return Response.json(
        { error: "Proof ID and status are required" },
        { status: 400 },
      );
    }

    // Update payment proof status
    await sql`
      UPDATE payment_proofs
      SET 
        verification_status = ${status},
        verified_by = ${adminEmail || null},
        verified_at = CURRENT_TIMESTAMP
      WHERE id = ${proofId}
    `;

    // If approved, update order payment status
    if (status === "approved") {
      await sql`
        UPDATE orders o
        SET payment_status = 'confirmed'
        FROM payment_proofs pp
        WHERE pp.order_id = o.id AND pp.id = ${proofId}
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error verifying payment proof:", error);
    return Response.json(
      { error: "Failed to verify payment proof" },
      { status: 500 },
    );
  }
}
