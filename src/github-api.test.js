import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";

describe("fetchContributions", () => {
  it("returns total commit count from GitHub GraphQL response", async () => {
    const mockResponse = {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 1234,
              weeks: [
                {
                  contributionDays: [
                    { contributionCount: 5, date: "2025-02-16" },
                    { contributionCount: 3, date: "2025-02-17" },
                  ],
                },
              ],
            },
          },
        },
      },
    };

    // Mock global fetch
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const { fetchContributions } = await import("./github-api.js");
    const result = await fetchContributions("testuser", "fake-token");

    assert.equal(result.totalContributions, 1234);
    assert.ok(Array.isArray(result.weeks));
    assert.equal(result.weeks[0].contributionDays[0].contributionCount, 5);

    globalThis.fetch = originalFetch;
  });
});
