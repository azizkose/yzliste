import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("posthog-js", () => ({
  default: {
    init: vi.fn(),
    capture: vi.fn(),
    identify: vi.fn(),
    reset: vi.fn(),
    opt_in_capturing: vi.fn(),
    opt_out_capturing: vi.fn(),
  },
}));

import { analytics } from "@/lib/analytics";
import posthog from "posthog-js";

describe("analytics wrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("has all required event methods", () => {
    const methods = [
      "init", "acceptAnalytics", "rejectAnalytics", "pageView", "identify", "reset",
      "signupStarted", "signupCompleted", "loginCompleted", "logoutCompleted",
      "generationStarted", "generationCompleted", "generationFailed",
      "generationFeedback", "creditPurchaseStarted", "creditPurchaseCompleted",
      "creditExhausted", "shareClicked",
    ];
    for (const m of methods) {
      expect(typeof (analytics as Record<string, unknown>)[m], `analytics.${m} should be a function`).toBe("function");
    }
  });

  it("generationStarted captures with prompt_version", () => {
    analytics.generationStarted({ platform: "trendyol", type: "metin", prompt_version: "metin-v1.4" });
    expect(posthog.capture).toHaveBeenCalledWith("generation_started", {
      platform: "trendyol",
      type: "metin",
      prompt_version: "metin-v1.4",
    });
  });

  it("generationCompleted captures with prompt_version", () => {
    analytics.generationCompleted({ platform: "trendyol", type: "metin", credits_remaining: 5, prompt_version: "metin-v1.4" });
    expect(posthog.capture).toHaveBeenCalledWith("generation_completed", {
      platform: "trendyol",
      type: "metin",
      credits_remaining: 5,
      prompt_version: "metin-v1.4",
    });
  });

  it("loginCompleted captures method", () => {
    analytics.loginCompleted({ method: "email" });
    expect(posthog.capture).toHaveBeenCalledWith("login_completed", { method: "email" });
  });

  it("logoutCompleted captures event", () => {
    analytics.logoutCompleted();
    expect(posthog.capture).toHaveBeenCalledWith("logout_completed");
  });

  it("generationFeedback captures rating and type", () => {
    analytics.generationFeedback({ type: "metin", platform: "trendyol", rating: "up" });
    expect(posthog.capture).toHaveBeenCalledWith("generation_feedback", {
      type: "metin",
      platform: "trendyol",
      rating: "up",
    });
  });

  it("shareClicked captures content_type", () => {
    analytics.shareClicked({ content_type: "blog_post" });
    expect(posthog.capture).toHaveBeenCalledWith("share_clicked", { content_type: "blog_post" });
  });
});
