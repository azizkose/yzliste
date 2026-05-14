// Auth protection is handled by middleware (middleware.ts PROTECTED_PATHS).
// Duplicate server-side getUser() here consumed the JWT refresh token, causing
// client-side useCurrentUser() to hang — HOTFIX-03 pattern.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
