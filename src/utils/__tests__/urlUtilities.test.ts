jest.mock("../../routes/models/routeModel", () => ({
  IO_CLIENT_REDIRECT_PATH: "/io",
  CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH: "/co",
  ROUTE_FRAGMENT: { PARAM1: "param1", PARAM2: "param2" },
  CLIENT_TYPE: { IO: "IO", CHECKOUT: "CHECKOUT" },
  EcommerceRoutes: {
    ROOT: "ecommerce-fe",
  },
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

import { getSessionItem } from "../../utils/storage/sessionStorage";
import {
  getUrlParameter,
  getBase64Fragment,
  getFragmentParameter,
  getFragments,
  redirectToClient,
  getFragmentsOrSessionStorageValue,
} from "../urlUtilities";
import { ViewOutcomeEnum } from "../api/transactions/types";
import { AmountEuroCents } from "../../../generated/definitions/payment-ecommerce-webview-v1/AmountEuroCents";

jest.mock("../../utils/storage/sessionStorage", () => ({
  getSessionItem: jest.fn(),
}));

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

describe("getFragmentsOrSessionStorage", () => {
  it("returns an object mapping fragments", () => {
    // eslint-disable-next-line functional/immutable-data
    mockLocation.href = "http://example.com#param1=one&param2=two";
    (getSessionItem as jest.Mock).mockImplementation((key) => {
      if (key === "item1") {
        return "itemValue1";
      }
      if (key === "item2") {
        return "itemValue2";
      }
      return null;
    });
    const fragments = getFragmentsOrSessionStorageValue(
      { route: "param1", sessionItem: "item1" } as any,
      { route: "param2", sessionItem: "item2" } as any
    );
    expect(fragments).toEqual({ param1: "one", param2: "two" });
  });

  it("returns an object mapping session item", () => {
    (getSessionItem as jest.Mock).mockImplementation((key) => {
      if (key === "item1") {
        return "value1";
      }
      if (key === "item2") {
        return "value2";
      }
      return null;
    });
    // eslint-disable-next-line functional/immutable-data
    mockLocation.href = "http://example.com";
    const fragments = getFragmentsOrSessionStorageValue(
      { route: "param1", sessionItem: "item1" } as any,
      { route: "param2", sessionItem: "item2" } as any
    );
    expect(fragments).toEqual({ param1: "value1", param2: "value2" });
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
