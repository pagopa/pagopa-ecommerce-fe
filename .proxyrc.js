/**
 * Development server built as an express application.
 *
 * We run the frontend application (thanks to parcel-bundler)
 * and the API proxy server (thanks to http-proxy-middleware)
 * on localhost:1234 so we don't have to deal with CORS.
 *
 */

const {createProxyMiddleware} = require("http-proxy-middleware");

const apiHost = "http://127.0.0.1:8080";
const apiHostIO = "http://127.0.0.1:8082";
const ecommerceBasepathV1 = "/ecommerce/checkout/v1";
const ecommerceBasepathV2 = "/ecommerce/checkout/v2";
const ecommerceIOBasepathV1 = "/ecommerce/webview/v1";

module.exports = function (app) {
    app.use(createProxyMiddleware(ecommerceBasepathV1, {
        target: apiHost,
    }));
    app.use(createProxyMiddleware(ecommerceBasepathV2, {
        target: apiHost,
    }));
    app.use(createProxyMiddleware(ecommerceIOBasepathV1, {
        target: apiHostIO,
    }));

}
