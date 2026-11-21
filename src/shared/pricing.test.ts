import { describe, expect, it } from "vitest";
import { getQuote } from "@/shared/pricing";

describe("getQuote", () => {
  it("briefing example: Superior Balcony 14–17 May + celebration = €711", () => {
    const q = getQuote({ room_id: "superior_balcony", check_in: "2027-05-14", check_out: "2027-05-17", extra_id: "celebration_package" });
    expect(q.total).toBe(711);
  });
  it("Nov–Mar nights use the base rate (Classic Double €140)", () => {
    expect(getQuote({ room_id: "classic_double", check_in: "2026-12-01", check_out: "2026-12-02" }).total).toBe(140);
  });
});
