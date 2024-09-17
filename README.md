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

- *ECOMMERCE* 
    1. start checkout mock [pagopa-checkout-be-mock](https://github.com/pagopa/pagopa-checkout-be-mock)
    2. open on browser http://localhost:1234/ecommerce-fe/esito#clientId=CHECKOUT&sessionToken=test&transactionId=1234