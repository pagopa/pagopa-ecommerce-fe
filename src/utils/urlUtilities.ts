import {
  IO_CLIENT_REDIRECT_PATH,
  CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH,
  ROUTE_FRAGMENT,
  CLIENT_TYPE,
} from "../routes/models/routeModel";
import { ViewOutcomeEnum } from "./api/transactions/types";

export function getUrlParameter(name: string) {
  const myname = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + myname + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * This function requires a valid base64-encoded URI with a query strings as the fragment URI
 * example: http://dev.checkout.it/gdi-check#param1=value1&param2=value2.
 * The function return an empty string if the uri parameter is not valid
 * or the param can't be found
 */
export function getBase64Fragment(uri: string, name: string): string {
  try {
    const out = getFragmentParameter(uri, name);
    return Buffer.from(out, "base64").toString("ascii");
  } catch (e) {
    return "";
  }
}

/**
 * This function requires a valid URI with a query strings as the fragment URI
 * example: http://dev.checkout.it/gdi-check#param1=value1&param2=value2.
 * The function return an empty string if the uri parameter is not valid
 * or the parameter can't be found
 */
export function getFragmentParameter(uri: string, name: string): string {
  try {
    const fragment = new URL(uri).hash.substring(1);
    const urlParams = new URLSearchParams(fragment);
    const gdiFragmentUrl = urlParams.get(name);
    if (gdiFragmentUrl === null) {
      return "";
    }
    return urlParams.get(name) || "";
  } catch (e) {
    return "";
  }
}

/**
 * returns all requested fragments in an object using the fragments as keys
 * example: http://dev.checkout.it/gdi-check#param1=value1&param2=value2&param3&....
 * The object values are set to empty string if its fragment is not found
 * or the parameter can't be found
 */
export function getFragments(
  ...fragments: Array<ROUTE_FRAGMENT>
): Record<ROUTE_FRAGMENT, string> {
  const uri = window.location.href;
  return fragments.reduce<Record<string, string>>(
    (acc, fragment) => ({
      ...acc,
      [fragment]: getFragmentParameter(uri, fragment),
    }),
    {}
  );
}

export const redirectToClient = ({
  transactionId,
  outcome,
  clientId,
}: {
  transactionId?: string;
  outcome: ViewOutcomeEnum;
  clientId: string;
}) => {
  const now = new Date().getTime()
  switch (clientId) {
    case CLIENT_TYPE.IO:
      return window.location.replace(
        `${IO_CLIENT_REDIRECT_PATH}${
          transactionId
            ? `/${transactionId}/outcomes?outcome=${outcome}`
            : `/outcomes?outcome=${outcome}`
        }`
      );
    case CLIENT_TYPE.CHECKOUT:
      return window.location.replace(
        `${CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH}?t=${now}#outcome=${outcome}`
      );
    // eslint-disable-next-line sonarjs/no-duplicated-branches
    default:
      return window.location.replace(
        `${CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH}?t=${now}#outcome=${outcome}`
      );
  }
};
