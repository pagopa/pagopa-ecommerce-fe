/* eslint-disable
    no-console,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unsafe-assignment
*/

import { renderHook, waitFor } from "@testing-library/react";
import { useNpgSdk } from "../useNpgSdk";

const SDK_URL = "https://assets.cdn.platform.pagopa.it/npg-uat/hfsdk.js";
const INTEGRITY_URL =
  "https://assets.cdn.platform.pagopa.it/npg-uat/hfsdk.integrity.json";

jest.mock("../../utils/buildConfig", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../utils/config/config", () => ({
  getConfigOrThrow: () => ({
    ECOMMERCE_NPG_SDK_URL: SDK_URL,
    ECOMMERCE_NPG_SDK_INTEGRITY_URL: INTEGRITY_URL,
  }),
}));

const getNpgScript = () =>
  Array.from(document.head.querySelectorAll("script")).find(
    (s) => s.getAttribute("src") === SDK_URL
  ) ?? null;

const hookArgs = { onBuildError: jest.fn() };

describe("useNpgSdk loader (SRI)", () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    document.head.querySelectorAll("script").forEach((s) => s.remove());
    jest.restoreAllMocks();
    delete (global as any).fetch;
  });

  it("loads the SDK with integrity + crossorigin when the hash is fetched", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ integrityHash: "sha384-abc123" }),
    });

    renderHook(() => useNpgSdk(hookArgs));

    await waitFor(() => expect(getNpgScript()).not.toBeNull());
    const script = getNpgScript();
    expect((global as any).fetch).toHaveBeenCalledWith(INTEGRITY_URL);
    expect(script?.getAttribute("src")).toBe(SDK_URL);
    expect(script?.getAttribute("integrity")).toBe("sha384-abc123");
    expect(script?.getAttribute("crossorigin")).toBe("anonymous");
  });

  it("does not load the SDK when the integrity endpoint returns a non-OK response", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    });

    renderHook(() => useNpgSdk(hookArgs));

    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    expect(getNpgScript()).toBeNull();
  });

  it("does not load the SDK when the integrity fetch rejects", async () => {
    (global as any).fetch = jest.fn().mockRejectedValue(new Error("network"));

    renderHook(() => useNpgSdk(hookArgs));

    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    expect(getNpgScript()).toBeNull();
  });

  it("does not load the SDK when the integrity hash is missing from the response", async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    renderHook(() => useNpgSdk(hookArgs));

    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    expect(getNpgScript()).toBeNull();
  });
});
