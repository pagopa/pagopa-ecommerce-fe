# pagopa-ecommerce-fe

This repository contain webviews used for ecommerce payments flow (checkout-App IO)

## About The Project

### Built With

- [Bootstrap](https://getbootstrap.com)
- [JQuery](https://jquery.com)
- [Parcel](https://parceljs.org)
- [Typescript](https://www.typescriptlang.org)
- [Azure Pipeline](https://azure.microsoft.com)

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

In order to build and run this project are required:

- [yarn](https://yarnpkg.com/)
- [node (18.17.1)](https://nodejs.org/it/)

### Installation

1. Install node packages
   ```sh
   yarn install
   ```
2. Generate api client
   ```sh
   yarn generate
   ```
3. Build
   ```sh
   yarn build
   ```
4. tests
   ```sh
   yarn test
   ```
5. Linter
   ```sh
   yarn lint
   ```

### Usage

In order to run the application on a local dev server with mock API responses:

- ```sh
     yarn dev
  ```
  the application is available at http://localhost:1234

Test use cases:

- _CHECKOUT_

  1. start checkout mock [pagopa-checkout-be-mock](https://github.com/pagopa/pagopa-checkout-be-mock)
  2. open on browser http://localhost:1234/ecommerce-fe/esito#clientId=CHECKOUT&sessionToken=test&transactionId=1234

- _APP IO_
  1. start script `yarn start-io-mock` on other terminal
  2. open on browser http://localhost:1234/ecommerce-fe/esito#clientId=IO&sessionToken=test&transactionId=1234

## IO Mock outcome result

The ecommerce transaction get transaction endpoint `/checkout/webview/v1/transactions/:transactionId/outcomes` is driven by the following mockFlow values:

| MOCK FLOW                                | Transaction Id Suffix | OUTCOME                     |
| ---------------------------------------- | --------------------- | ----------------------------|
| Succes                                   | 000                   | SUCCESS (0)                 |
| Generic error                            | 001                   | GENERIC_ERROR (1)           |
| Auth error                               | 002                   | AUTH_ERROR (2)              |
| Invalid data                             | 003                   | INVALID_DATA (3)            |
| Timeout                                  | 004                   | TIMEOUT (4)                 |
| Invalid card                             | 007                   | INVALIDA_CARD (7)           |
| Canceled by user                         | 008                   | CANCELED_BY_USER (8)        |
| Excessive amount                         | 010                   | EXCESSIVE_AMOUNT (10)       |
| Taken in charge                          | 017                   | TAKE_IN_CHARGE (17)         |
| Refunded                                 | 018                   | REFUNDED (18)               |
| Psp Error                                | 025                   | PSP ERROR (25)              |
| Backend Error                            | 099                   | REFUNDED (99)               |
| Balance not available                    | 116                   | BALANCE_NOT_AVAILABLE (116) |
| CVV Error                                | 117                   | CVV_ERROR (117)             |
| Limit exceeded                           | 121                   | LIMIT EXCEEDED (121)        |


| Variable name | Description | type |
|----------------|-------------|------|
|ECOMMERCE_API_RETRY_NUMBERS_LINEAR| number of calls at regular intervals| number

## Polling

The function exponentialPollingWithPromisePredicateFetch uses the variableBackoff formula to calculate the polling intervals based on the attempt number:

-  For attempts less than or equal to RETRY_NUMBERS_LINEAR, it returns a fixed delay.

-  For attempts greater than that, the delay increases linearly according to the formula.

- 
```sh
const variableBackoff = (attempt: number): Millisecond => {
   if (attempt <= RETRY_NUMBERS_LINEAR) {
      return delay as Millisecond;
   }

   return (delay * (attempt - RETRY_NUMBERS_LINEAR)) as Millisecond;
};
```