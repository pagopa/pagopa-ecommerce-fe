import { Box } from "@mui/material";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { getConfigOrThrow } from "../../../../utils/config/config";
import { npgSessionsFields } from "../../../../utils/api/methods/paymentMethodHelper";
import {
  getSessionItem,
  SessionItems,
  setSessionItem,
} from "../../../../utils/storage/sessionStorage";
import { CreateSessionResponse } from "../../../../../generated/definitions/payment-ecommerce-webview-v1/CreateSessionResponse";
import { clearNavigationEvents } from "../../../../utils/eventListeners";
import { FormButtons } from "../../../../components/FormButtons/FormButtons";
import { useNpgSdk } from "../../../../hooks/useNpgSdk";
import type { FieldId, FieldStatus, FormStatus } from "./types";
import { IdFields } from "./types";
import { IframeCardField } from "./IframeCardField";

interface Props {
  loading?: boolean;
  onCancel: () => void;
  onSubmit?: (bin: string) => void;
  hideCancel?: boolean;
}

const initialFieldStatus: FieldStatus = {
  isValid: undefined,
  errorCode: null,
  errorMessage: null,
};

const initialFieldsState: FormStatus = Object.values(
  IdFields
).reduce<FormStatus>(
  (acc, idField) => ({ ...acc, [idField]: initialFieldStatus }),
  {} as FormStatus
);

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function IframeCardForm(props: Props) {
  const { onCancel, hideCancel } = props;
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState<CreateSessionResponse>();
  const [activeField, setActiveField] = React.useState<FieldId | undefined>(
    undefined
  );
  const [formStatus, setFormStatus] =
    React.useState<FormStatus>(initialFieldsState);
  const ref = React.useRef<ReCAPTCHA>(null);
  const [isAllFieldsLoaded, setIsAllFieldsLoaded] = React.useState(false);

  const buildRef = React.useRef<any>(null);

  const formIsValid = (fieldFormStatus: FormStatus) =>
    Object.values(fieldFormStatus).every((el) => el.isValid);

  const { ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH } =
    getConfigOrThrow();

  const onError = React.useCallback(() => {
    // eslint-disable-next-line no-console
    console.log("executing on error ");
    setLoading(false);
    ref.current?.reset?.();
    // TODO check outcome path
    window.location.replace(
      `${ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH}/outcomes?outcome=1`
    );
  }, [ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH]);

  const onSuccess = React.useCallback(
    (orderId: string, correlationId: string) => {
      // TODO check outcome path
      window.location.replace(
        `${ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH}/outcomes?outcome=0&orderId=${orderId}&correlationId=${correlationId}`
      );
    },
    [ECOMMERCE_IO_CARD_DATA_CLIENT_REDIRECT_OUTCOME_PATH]
  );

  const onReadyForPayment = React.useCallback(() => {
    clearNavigationEvents();
    const orderId = getSessionItem(SessionItems.orderId);
    const correlationId = getSessionItem(SessionItems.correlationId);
    if (orderId && correlationId) {
      onSuccess(orderId, correlationId);
    } else {
      // eslint-disable-next-line no-console
      console.log(`Order id or correlation id null not valid`);
      onError();
    }
  }, [onError, onSuccess]);

  const onPaymentRedirect = React.useCallback(
    (_: string) => {
      // eslint-disable-next-line no-console
      console.log(
        "Unexpected NPG onPaymentRedirect (REDIRECT_TO_EXTERNAL_DOMAIN) callback received!"
      );
      onError();
    },
    [onError]
  );

  const onBuildError = React.useCallback(() => {
    onError();
  }, [onError]);

  const onChange = React.useCallback((id: FieldId, status: FieldStatus) => {
    if (Object.keys(IdFields).includes(id)) {
      setActiveField(id);
      setFormStatus((fields) => ({
        ...fields,
        [id]: status,
      }));
    }
  }, []);

  const onAllFieldsLoaded = React.useCallback(() => {
    setLoading(false);
    setIsAllFieldsLoaded(true);
  }, []);

  const { sdkReady, buildSdk } = useNpgSdk({
    onChange,
    onReadyForPayment,
    onPaymentRedirect,
    onBuildError,
    onAllFieldsLoaded,
  });

  React.useEffect(() => {
    // eslint-disable-next-line functional/no-let
    let mounted = true;
    if (!form) {
      setLoading(true);
      void (async () => {
        const res = await npgSessionsFields();
        if (!mounted) {
          return;
        }
        pipe(
          res,
          O.match(onError, (npgSessionFields: CreateSessionResponse) => {
            setSessionItem(SessionItems.orderId, npgSessionFields.orderId);
            setSessionItem(
              SessionItems.correlationId,
              npgSessionFields.correlationId
            );
            setForm(npgSessionFields);
          })
        );
      })();
    }
    return () => {
      mounted = false;
    };
  }, [onError]);

  React.useEffect(() => {
    if (!sdkReady) {
      return;
    }
    if (!form) {
      return;
    }
    if (buildRef.current) {
      return;
    }
    try {
      const instance = buildSdk();
      // eslint-disable-next-line functional/immutable-data
      buildRef.current = instance;
    } catch (e) {
      onBuildError();
    }
  }, [sdkReady, form, buildSdk, onBuildError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (buildRef.current?.confirmData) {
        buildRef.current.confirmData(() => setLoading(true));
      } else {
        onBuildError();
      }
    } catch (_e) {
      onBuildError();
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <form id="iframe-card-form" onSubmit={handleSubmit}>
        <Box>
          <Box>
            <IframeCardField
              label={t("inputCardPage.formFields.number")}
              fields={form?.paymentMethodData.form}
              id={"CARD_NUMBER"}
              errorCode={formStatus.CARD_NUMBER?.errorCode}
              errorMessage={formStatus.CARD_NUMBER?.errorMessage}
              isValid={formStatus.CARD_NUMBER?.isValid}
              activeField={activeField}
              isAllFieldsLoaded={isAllFieldsLoaded}
            />
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            sx={{ gap: 2 }}
          >
            <Box sx={{ flex: "1 1 0" }}>
              <IframeCardField
                label={t("inputCardPage.formFields.expirationDate")}
                fields={form?.paymentMethodData.form}
                id={"EXPIRATION_DATE"}
                errorCode={formStatus.EXPIRATION_DATE?.errorCode}
                errorMessage={formStatus.EXPIRATION_DATE?.errorMessage}
                isValid={formStatus.EXPIRATION_DATE?.isValid}
                activeField={activeField}
                isAllFieldsLoaded={isAllFieldsLoaded}
              />
            </Box>
            <Box width="50%">
              <IframeCardField
                label={t("inputCardPage.formFields.cvv")}
                fields={form?.paymentMethodData.form}
                id={"SECURITY_CODE"}
                errorCode={formStatus.SECURITY_CODE?.errorCode}
                errorMessage={formStatus.SECURITY_CODE?.errorMessage}
                isValid={formStatus.SECURITY_CODE?.isValid}
                activeField={activeField}
                isAllFieldsLoaded={isAllFieldsLoaded}
              />
            </Box>
          </Box>
          <Box>
            <IframeCardField
              label={t("inputCardPage.formFields.name")}
              fields={form?.paymentMethodData.form}
              id={"CARDHOLDER_NAME"}
              errorCode={formStatus.CARDHOLDER_NAME?.errorCode}
              errorMessage={formStatus.CARDHOLDER_NAME?.errorMessage}
              isValid={formStatus.CARDHOLDER_NAME?.isValid}
              activeField={activeField}
              isAllFieldsLoaded={isAllFieldsLoaded}
            />
          </Box>
        </Box>
        <FormButtons
          idCancel="cancel"
          idSubmit="submit"
          loadingSubmit={loading}
          type="submit"
          submitTitle="paymentNoticePage.formButtons.submit"
          cancelTitle="paymentNoticePage.formButtons.cancel"
          disabledSubmit={loading || !formIsValid(formStatus)}
          handleSubmit={handleSubmit}
          handleCancel={onCancel}
          hideCancel={hideCancel}
        />
      </form>
    </>
  );
}
