/**
 * Config module
 *
 * Single point of access for the application configuration. Handles validation on required environment variables.
 * The configuration is evaluate eagerly at the first access to the module. The module exposes convenient methods to access such value.
 */

import * as t from "io-ts";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";

export type IConfig = t.TypeOf<typeof IConfig>;
export const IConfig = t.interface({
  ECOMMERCE_ENV: NonEmptyString,
  ECOMMERCE_API_TIMEOUT: t.number,
  ECOMMERCE_API_HOST: NonEmptyString,
  ECOMMERCE_CHECKOUT_API_PATH: NonEmptyString,
  ECOMMERCE_CHECKOUT_API_V2_PATH: NonEmptyString,
  ECOMMERCE_IO_API_V1_PATH: NonEmptyString,
  ECOMMERCE_GDI_CHECK_TIMEOUT: t.number,
  ECOMMERCE_NPG_SDK_URL: NonEmptyString,
  ECOMMERCE_IO_CLIENT_REDIRECT_OUTCOME_PATH: NonEmptyString,
  ECOMMERCE_CHECKOUT_CLIENT_REDIRECT_OUTCOME_PATH: NonEmptyString,
  ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES: t.number,
  ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS: t.number,
  ECOMMERCE_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS: t.number,
  ECOMMERCE_API_RETRY_NUMBERS_LINEAR: t.number,
});

// No need to re-evaluate this object for each call
const errorOrConfig: t.Validation<IConfig> = IConfig.decode({
  // eslint-disable-next-line no-underscore-dangle
  ...(window as any)._env_,
  // eslint-disable-next-line no-underscore-dangle
  ECOMMERCE_API_RETRY_NUMBERS_LINEAR: (window as any)._env_
    .ECOMMERCE_API_RETRY_NUMBERS_LINEAR
    ? parseInt(
        // eslint-disable-next-line no-underscore-dangle
        (window as any)._env_.ECOMMERCE_API_RETRY_NUMBERS_LINEAR,
        10
      )
    : 5,
  ECOMMERCE_API_TIMEOUT: parseInt(
    // eslint-disable-next-line no-underscore-dangle
    (window as any)._env_.ECOMMERCE_API_TIMEOUT,
    10
  ),
  ECOMMERCE_GDI_CHECK_TIMEOUT: parseInt(
    // eslint-disable-next-line no-underscore-dangle
    (window as any)._env_.ECOMMERCE_GDI_CHECK_TIMEOUT,
    10
  ),
  // eslint-disable-next-line no-underscore-dangle
  ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES: (window as any)._env_
    .ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES
    ? parseInt(
        // eslint-disable-next-line no-underscore-dangle
        (window as any)._env_.ECOMMERCE_GET_TRANSACTION_POLLING_RETRIES,
        10
      )
    : 20,
  // eslint-disable-next-line no-underscore-dangle
  ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS: (window as any)._env_
    .ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS
    ? parseInt(
        // eslint-disable-next-line no-underscore-dangle
        (window as any)._env_.ECOMMERCE_GET_TRANSACTION_POLLING_DELAY_MILLIS,
        10
      )
    : 3000,
  // eslint-disable-next-line no-underscore-dangle
  ECOMMERCE_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS: (window as any)._env_
    .ECOMMERCE_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS
    ? parseInt(
        // eslint-disable-next-line no-underscore-dangle
        (window as any)._env_.ECOMMERCE_SHOW_CONTINUE_IO_BTN_DELAY_MILLIS,
        10
      )
    : 2000,
});

/**
 * Read the application configuration and check for invalid values.
 * Configuration is eagerly evalued when the application starts.
 *
 * @returns either the configuration values or a list of validation errors
 */
export function getConfig(): t.Validation<IConfig> {
  return errorOrConfig;
}

/**
 * Read the application configuration and check for invalid values.
 * If the application is not valid, raises an exception.
 *
 * @returns the configuration values
 * @throws validation errors found while parsing the application configuration
 */
export function getConfigOrThrow(): IConfig {
  return pipe(
    errorOrConfig,
    E.getOrElseW((errors) => {
      throw new Error(`Invalid configuration: ${readableReport(errors)}`);
    })
  );
}
