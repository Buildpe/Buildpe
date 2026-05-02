import { tokenStorage } from '../../Services/Authapi';

// Reads the "role" claim directly from the JWT payload
// JwtUtil stores: claims.put("role", user.getRole().getName())
// So payload.role is "ADMIN" or "USER" — no ROLE_ prefix in the token itself
export function getAdminRole() {
  try {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.role || null; // "ADMIN" or "USER"
  } catch {
    return null;
  }
}
