import { useEffect, useState } from "react";
import { FieldId, FieldStatus } from "models/npgModel";
import { getConfigOrThrow } from "../utils/config/config";
import createBuildConfig from "../utils/buildConfig";
import { EcommerceRoutes } from "../routes/models/routeModel";

export type SdkBuild = {
  onChange?: (field: FieldId, fieldStatus: FieldStatus) => void;
  onReadyForPayment?: () => void;
  onPaymentComplete?: () => void;
  onPaymentRedirect?: (urlRedirect: string) => void;
  onBuildError: () => void;
  onAllFieldsLoaded?: () => void;
};

const noop = () => {
  // noop
};

export const useNpgSdk = ({
  onChange = () => null,
  onReadyForPayment = () => null,
  onPaymentComplete = () => null,
  onPaymentRedirect = () => null,
  onBuildError,
  onAllFieldsLoaded = () => null,
}: SdkBuild) => {
  const [sdkReady, setSdkReady] = useState(false);

  const createBuild = (): Build => {
    try {
      return new Build(
        createBuildConfig({
          onChange,
          onReadyForPayment,
          onPaymentRedirect,
          onPaymentComplete,
          onBuildError,
          onAllFieldsLoaded,
        })
      );
    } catch (_e) {
      onBuildError();
    }
  };

  useEffect(() => {
    const npgScriptEl = document.createElement("script");
    const npgDomainScript = getConfigOrThrow().ECOMMERCE_NPG_SDK_URL;
    npgScriptEl.setAttribute("src", npgDomainScript);
    npgScriptEl.setAttribute("type", "text/javascript");
    npgScriptEl.setAttribute("charset", "UTF-8");
    document.head.appendChild(npgScriptEl);
    npgScriptEl.addEventListener("load", () => setSdkReady(true));

    const { hostname, protocol, port } = window.location;

    const cssPath = `${protocol}//${hostname}${
      process.env.NODE_ENV === "development" ? `:${port}` : ""
    }/${EcommerceRoutes.ROOT}/npg/style.css`;

    const cssLink = document.createElement("link");
    cssLink.setAttribute("rel", "stylesheet");
    cssLink.setAttribute("href", cssPath);
    document.head.appendChild(cssLink);
  }, []);

  return { sdkReady, buildSdk: sdkReady ? createBuild : noop };
};
