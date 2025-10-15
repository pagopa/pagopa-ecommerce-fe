import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { npgSessionsFields } from "../paymentMethodHelper";
import { CreateSessionResponse } from "../../../../../generated/definitions/payment-ecommerce-v1/CreateSessionResponse";

jest.mock("../../client", () => ({
  ecommerceIOClientV1: {
    createSessionWebview: jest.fn(),
  },
}));

import { ecommerceIOClientV1 } from "../../client";

const asMock = <T extends (...args: Array<any>) => any>(fn: T) =>
  fn as jest.MockedFunction<T>;

// helper for Right/Left
const mkRight = <S extends number, V>(status: S, value?: V) =>
  E.right({
    status,
    value,
    headers: {},
  }) as any;

const mkLeft = (err: unknown) => E.left(err) as any;

describe("npgSessionsFields", () => {
  const createSessionWebview = asMock(ecommerceIOClientV1.createSessionWebview);

  const SessionItems = {
    sessionToken: "sessionToken",
    clientId: "clientId",
    paymentMethodId: "paymentMethodId",
  } as const;

  const setSS = (token = "tok", client = "cid", pm = "pmid") => {
    sessionStorage.setItem(SessionItems.sessionToken, token);
    sessionStorage.setItem(SessionItems.clientId, client);
    sessionStorage.setItem(SessionItems.paymentMethodId, pm);
  };

  beforeEach(() => {
    jest.resetAllMocks();
    sessionStorage.clear();
  });

  test("returns Some(CreateSessionResponse) when Right(200)", async () => {
    setSS("token-123", "client-abc", "pm-42");

    const payload: CreateSessionResponse = {
      orderId: "E1744128769418vl8H",
      correlationId: "d515ddfb-b931-4f26-8fde-7122a7a3524f",
      paymentMethodData: {
        paymentMethod: "CARDS",
        form: [
          {
            type: "TEXT",
            class: "CARD_FIELD",
            id: "CARD_NUMBER",
            src: "https://stg-ta.nexigroup.com/phoenix-0.0/v3/?id=CARD_NUMBER",
          },
        ],
      },
    } as any;

    createSessionWebview.mockResolvedValue(mkRight(200 as const, payload));

    const res = await npgSessionsFields();

    expect(O.isSome(res)).toBe(true);
    expect(O.getOrElse(() => ({} as any))(res)).toEqual(payload);

    expect(createSessionWebview).toHaveBeenCalledWith({
      eCommerceSessionToken: "token-123",
      "x-client-id": "client-abc",
      id: "pm-42",
    });
  });

  test("returns None when Right(status !== 200)", async () => {
    setSS();

    createSessionWebview.mockResolvedValue(
      mkRight(400 as const, { message: "bad request" })
    );

    const res = await npgSessionsFields();
    expect(O.isNone(res)).toBe(true);
  });

  test("returns None when Left (typed error)", async () => {
    setSS();

    createSessionWebview.mockResolvedValue(mkLeft(new Error("decode error")));

    const res = await npgSessionsFields();
    expect(O.isNone(res)).toBe(true);
  });

  test("returns None when Promise.reject", async () => {
    setSS();

    createSessionWebview.mockRejectedValue(new Error("network down"));

    const res = await npgSessionsFields();
    expect(O.isNone(res)).toBe(true);
  });

  test("use empty strings if absent in sessionStorage (Right 200)", async () => {
    const payload: CreateSessionResponse = {
      orderId: "order-empty",
      correlationId: "corr-empty",
      paymentMethodData: { paymentMethod: "CARDS", form: [] },
    } as any;

    createSessionWebview.mockResolvedValue(mkRight(200 as const, payload));

    const res = await npgSessionsFields();

    expect(O.isSome(res)).toBe(true);
    expect(createSessionWebview).toHaveBeenCalledWith({
      eCommerceSessionToken: "",
      "x-client-id": "",
      id: "",
    });
  });
});
