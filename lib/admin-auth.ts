// Server-only admin check, mirroring the existing /api/admin/summary pattern:
// compares the ADMIN_PASSWORD env against the x-admin-password request header.
export function isAdminRequest(request: Request): boolean {
  const provided = request.headers.get("x-admin-password");
  return Boolean(process.env.ADMIN_PASSWORD) && provided === process.env.ADMIN_PASSWORD;
}
