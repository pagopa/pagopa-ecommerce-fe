jest.mock("../../routes/models/routeModel", () => ({
  IO_CLIENT_REDIRECT_PATH: "/io",
  CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH: "/co",
  ROUTE_FRAGMENT: { PARAM1: "param1", PARAM2: "param2" },
  CLIENT_TYPE: { IO: "IO", CHECKOUT: "CHECKOUT" },
  EcommerceRoutes: {
    ROOT: "ecommerce-fe",
  },
}));

const mockConfig = {
  USE_ECOMMERCE_FE_ROOT_PATH: true,
};

jest.mock("../../utils/config/config", () => ({
  getConfigOrThrow: () => mockConfig,
}));

const originalLocation = window.location;
const mockLocation: Partial<Location> = {
  search: "",
  href: "",
  replace: jest.fn(),
};

beforeAll(() => {
  // eslint-disable-next-line functional/immutable-data
  Object.defineProperty(window, "location", {
    value: mockLocation,
    writable: true,
  });
});

afterAll(() => {
  // eslint-disable-next-line functional/immutable-data
  Object.defineProperty(window, "location", {
    value: originalLocation,
    writable: true,
  });
});

import {
  getUrlParameter,
  getBase64Fragment,
  getFragmentParameter,
  getFragments,
  redirectToClient,
} from "../urlUtilities";
import { ViewOutcomeEnum } from "../api/transactions/types";
import { AmountEuroCents } from "../../../generated/definitions/payment-ecommerce-webview-v1/AmountEuroCents";

describe("getUrlParameter", () => {
  it("returns empty string when parameter not present", () => {
    // eslint-disable-next-line functional/immutable-data
    mockLocation.search = "?foo=bar";
    expect(getUrlParameter("baz")).toBe("");
  });

  it("returns decoded value when present", () => {
    const val = encodeURIComponent("hello world");
    // eslint-disable-next-line functional/immutable-data
    mockLocation.search = `?param=${val}`;
    expect(getUrlParameter("param")).toBe("hello world");
  });

  it("handles multiple parameters", () => {
    // eslint-disable-next-line functional/immutable-data
    mockLocation.search = "?foo=1&bar=2";
    expect(getUrlParameter("bar")).toBe("2");
  });
});

describe("getFragmentParameter", () => {
  it("returns empty on invalid URI", () => {
    expect(getFragmentParameter("not a url", "x")).toBe("");
  });

  it("returns empty when fragment missing", () => {
    const uri = "http://example.com#";
    expect(getFragmentParameter(uri, "a")).toBe("");
  });

  it("returns fragment value when exists", () => {
    const uri = "http://example.com#foo=bar&baz=qux";
    expect(getFragmentParameter(uri, "foo")).toBe("bar");
    expect(getFragmentParameter(uri, "baz")).toBe("qux");
  });

  it("returns empty for nonexistent fragment", () => {
    const uri = "http://example.com#foo=bar";
    expect(getFragmentParameter(uri, "missing")).toBe("");
  });
});

describe("getBase64Fragment", () => {
  const encoded = Buffer.from("hello", "ascii").toString("base64");

  it("decodes base64 fragment", () => {
    const uri = `http://example.com#data=${encoded}`;
    expect(getBase64Fragment(uri, "data")).toBe("hello");
  });
});

describe("getFragments", () => {
  it("returns an object mapping fragments", () => {
    // eslint-disable-next-line functional/immutable-data
    mockLocation.href = "http://example.com#param1=one&param2=two";
    const fragments = getFragments("param1" as any, "param2" as any);
    expect(fragments).toEqual({ param1: "one", param2: "two" });
  });
});

describe("redirectToClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects IO client with transactionId", () => {
    jest.spyOn(Date.prototype, "getTime").mockReturnValue(1234);
    redirectToClient({
      clientId: "IO",
      transactionId: "tx1",
      outcome: ViewOutcomeEnum.SUCCESS,
    });
    expect(mockLocation.replace).toHaveBeenCalledWith(
      "/io/tx1/outcomes?outcome=" + ViewOutcomeEnum.SUCCESS
    );
  });

  it("redirects IO client without transactionId", () => {
    jest.spyOn(Date.prototype, "getTime").mockReturnValue(1234);
    redirectToClient({
      clientId: "IO",
      outcome: ViewOutcomeEnum.GENERIC_ERROR,
    });
    expect(mockLocation.replace).toHaveBeenCalledWith(
      "/io/outcomes?outcome=" + ViewOutcomeEnum.GENERIC_ERROR
    );
  });

  it("redirects CHECKOUT client", () => {
    jest.spyOn(Date.prototype, "getTime").mockReturnValue(5678);
    const transactionId = "testingId";
    redirectToClient({
      clientId: "CHECKOUT",
      outcome: ViewOutcomeEnum.SUCCESS,
      transactionId,
      totalAmount: 100 as AmountEuroCents,
      fees: 15 as AmountEuroCents,
    });
    expect(mockLocation.replace).toHaveBeenCalledWith(
      "/co?t=5678#transactionId=" +
        transactionId +
        "&outcome=" +
        ViewOutcomeEnum.SUCCESS +
        "&totalAmount=100&fees=15"
    );
  });

  it("defaults to CHECKOUT on unknown clientId", () => {
    jest.spyOn(Date.prototype, "getTime").mockReturnValue(9999);
    redirectToClient({ clientId: "UNKNOWN", outcome: ViewOutcomeEnum.TIMEOUT });
    expect(mockLocation.replace).toHaveBeenCalledWith(
      "/co?t=9999#outcome=" + ViewOutcomeEnum.TIMEOUT
    );
  });
});

describe("getRootPath", () => {
  it.each([
    {
      paramValue: true,
      expectedRootPath: "/ecommerce-fe/",
    },
    {
      paramValue: false,
      expectedRootPath: "/",
    },
  ])(
    "should return root path valued accordingly to parameter: [%s]",
    ({ paramValue, expectedRootPath }) => {
      // reset modules to change parameter value
      jest.resetModules();
      // eslint-disable-next-line functional/immutable-data
      mockConfig.USE_ECOMMERCE_FE_ROOT_PATH = paramValue;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const reloadedUrlUtilities = require("../urlUtilities");
      // and then perform test against the reloaded module with updated parameter value
      expect(reloadedUrlUtilities.getRootPath()).toEqual(expectedRootPath);
    }
  );
});
