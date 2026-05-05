import { describe, it, expect } from "vitest";

const API_BASE = process.env.SMOKE_TEST_BASE_URL || "http://localhost:3000";

const ENDPOINTS = [
  { path: "/api/health", method: "GET" as const, body: undefined },
  {
    path: "/api/uret",
    method: "POST" as const,
    body: {
      platform: "trendyol",
      urunAdi: "Smoke test ürün",
      ekBilgi: "",
      ton: "tanitim",
      userId: "smoke-test-user",
    },
  },
  {
    path: "/api/sosyal",
    method: "POST" as const,
    body: {
      platform: "instagram",
      urunAdi: "Smoke test",
      ekBilgi: "",
      ton: "tanitim",
      sezon: "normal",
      userId: "smoke-test-user",
    },
  },
];

describe("API smoke tests", () => {
  it.each(ENDPOINTS)(
    "$method $path reachable (no 404, no 500)",
    async (ep) => {
      const res = await fetch(`${API_BASE}${ep.path}`, {
        method: ep.method,
        headers: ep.body ? { "Content-Type": "application/json" } : undefined,
        body: ep.body ? JSON.stringify(ep.body) : undefined,
      });
      expect(res.status).not.toBe(404);
      expect(res.status).not.toBe(500);
      expect([200, 400, 401, 402, 429, 503]).toContain(res.status);
    }
  );

  it("GET /api/health returns 200", async () => {
    const res = await fetch(`${API_BASE}/api/health`);
    expect(res.status).toBe(200);
  });
});
