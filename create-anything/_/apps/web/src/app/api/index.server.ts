// API placeholder file to satisfy React Router build requirements
// This ensures the build process can find API routes

export async function loader() {
  return new Response(JSON.stringify({ status: 'API placeholder' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
