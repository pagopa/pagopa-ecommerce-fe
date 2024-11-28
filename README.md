# pagopa-ecommerce-fe

This repository contain webviews used for ecommerce payments flow (checkout-App IO)

## About The Project

### Built With

* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [Parcel](https://parceljs.org)
* [Typescript](https://www.typescriptlang.org)
* [Azure Pipeline](https://azure.microsoft.com)

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
-  ```sh
   yarn dev
   ```
the application is available at http://localhost:1234

Test use cases: 

- *CHECKOUT* 
    1. start checkout mock [pagopa-checkout-be-mock](https://github.com/pagopa/pagopa-checkout-be-mock)
    2. open on browser http://localhost:1234/ecommerce-fe/esito#clientId=CHECKOUT&sessionToken=test&transactionId=1234

- *APP IO*
    1. start script ```yarn start-io-mock``` on other terminal
    2. open on browser http://localhost:1234/ecommerce-fe/esito#clientId=IO&sessionToken=test&transactionId=1234


## IO Mock outcome result
The ecommerce transaction get transaction endpoint `/checkout/webview/v1/transactions/:transactionId` is driven by the following mockFlow values:

| MOCK FLOW                                          | Transaction Id Suffix | OUTCOME              | 
|----------------------------------------------------|-----------------------|----------------------|
| NOTIFIED_OK                                        | other                 | SUCCESS (0)          |
| NOTIFICATION_REQUESTED - Outcome OK                | 61                    | SUCCESS (0)          |
| NOTIFICATION_REQUESTED - Outcome KO                | 62                    | PSP_ERROR (25)       |
| NOTIFICATION_ERROR - Outcome OK                    | 63                    | SUCCESS (0)          |
| NOTIFICATION_ERROR - Outcome KO                    | 64                    | PSP_ERROR (25)       |
| NOTIFIED_KO                                        | 65                    | PSP_ERROR (25)       |
| REFUNDED                                           | 66                    | PSP_ERROR (25)       |
| REFUND_REQUESTED                                   | 67                    | GENERIC_ERROR (1)    |
| REFUND_ERROR                                       | 68                    | GENERIC_ERROR (1)    |
| EXPIRED_NOT_AUTHORIZED                             | 69                    | TIMEOUT (4)          |
| CANCELED                                           | 70                    | CANCELED_BY_USER (8) |  
| CANCELLATION_EXPIRED                               | 71                    | CANCELED_BY_USER (8) |  
| CLOSURE_ERROR - NPG EXECUTED                       | 72                    | GENERIC_ERROR (1)    |
| CLOSURE_REQUESTED - NPG CANCELED                   | 73                    | CANCELED_BY_USER (8) |   
| AUTHORIZATION_COMPLETED - NPG AUTHORIZED           | 74                    | PSP_ERROR (25)       |
| UNAUTHORIZED - NPG DENIED_BY_RISK                  | 75                    | AUTH_ERROR (2)       |
| CLOSED - Outcome NOT_RECEIVED                      | 76                    | TAKING_CHARGE (17)   |
| CLOSED - Other                                     | 77                    | GENERIC_ERROR (1)    |
| EXPIRED - Outcome OK                               | 78                    | SUCCESS (0)          |
| AUTHORIZATION_REQUESTED                            | 79                    | TAKING_CHARGE (17)   |  