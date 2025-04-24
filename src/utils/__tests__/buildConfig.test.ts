import npgHandlerFactory from "../../utils/buildConfig";
import {
  FieldId,
  FieldStatus,
  NpgEvtData,
  NpgEvtDataErroCode,
  NpgFlowState,
  NpgFlowStateEvtData,
} from "../../models/npgModel";

describe("NPG handler factory", () => {
  // eslint-disable-next-line functional/no-let
  let onChange: jest.Mock;
  // eslint-disable-next-line functional/no-let
  let onReadyForPayment: jest.Mock;
  // eslint-disable-next-line functional/no-let
  let onPaymentComplete: jest.Mock;
  // eslint-disable-next-line functional/no-let
  let onPaymentRedirect: jest.Mock;
  // eslint-disable-next-line functional/no-let
  let onBuildError: jest.Mock;
  // eslint-disable-next-line functional/no-let
  let handlers: ReturnType<typeof npgHandlerFactory>;

  beforeEach(() => {
    onChange = jest.fn();
    onReadyForPayment = jest.fn();
    onPaymentComplete = jest.fn();
    onPaymentRedirect = jest.fn();
    onBuildError = jest.fn();

    handlers = npgHandlerFactory({
      onChange,
      onReadyForPayment,
      onPaymentComplete,
      onPaymentRedirect,
      onBuildError,
    });
  });

  it("onBuildSuccess calls onChange with valid=true", () => {
    const evt: NpgEvtData = {
      id: "CARD_NUMBER" as FieldId,
      errorCode: NpgEvtDataErroCode.HF0001,
      errorMessage: "An error occurred",
    };
    handlers.onBuildSuccess(evt);
    expect(onChange).toHaveBeenCalledWith("CARD_NUMBER", {
      isValid: true,
      errorCode: null,
      errorMessage: null,
    } as FieldStatus);
  });

  it("onBuildError calls onChange with valid=false and propagates error", () => {
    const evt: NpgEvtData = {
      id: "EXPIRATION_DATE" as FieldId,
      errorCode: NpgEvtDataErroCode.HF0004,
      errorMessage: "invalid",
    };
    handlers.onBuildError(evt);
    expect(onChange).toHaveBeenCalledWith("EXPIRATION_DATE", {
      isValid: false,
      errorCode: "HF0004",
      errorMessage: "invalid",
    } as FieldStatus);
  });

  it("onConfirmError always calls onBuildError", () => {
    const evt: NpgEvtData = {
      id: "SECURITY_CODE" as FieldId,
      errorCode: NpgEvtDataErroCode.HF0007,
      errorMessage: "internal",
    };
    handlers.onConfirmError(evt);
    expect(onBuildError).toHaveBeenCalled();
  });

  describe("onBuildFlowStateChange", () => {
    const url = "https://auth.example.com";
    const evtData: NpgFlowStateEvtData = { data: { url } };

    it("READY_FOR_PAYMENT → onReadyForPayment", () => {
      handlers.onBuildFlowStateChange(evtData, NpgFlowState.READY_FOR_PAYMENT);
      expect(onReadyForPayment).toHaveBeenCalled();
    });

    it("PAYMENT_COMPLETE → onPaymentComplete", () => {
      handlers.onBuildFlowStateChange(evtData, NpgFlowState.PAYMENT_COMPLETE);
      expect(onPaymentComplete).toHaveBeenCalled();
    });

    it("REDIRECTED_TO_EXTERNAL_DOMAIN → onPaymentRedirect(url)", () => {
      handlers.onBuildFlowStateChange(
        evtData,
        NpgFlowState.REDIRECTED_TO_EXTERNAL_DOMAIN
      );
      expect(onPaymentRedirect).toHaveBeenCalledWith(url);
    });

    it("any other state → onBuildError", () => {
      handlers.onBuildFlowStateChange(evtData, NpgFlowState.GDI_VERIFICATION);
      expect(onBuildError).toHaveBeenCalled();
    });
  });
});
