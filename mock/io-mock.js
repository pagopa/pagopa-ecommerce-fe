/**
 * Development server built as an express application,
 * able to run frontend (thanks to parcel-bundler) and an API server with json response example.
 */

const express = require("express");
const port = 8080;
const app = express();

app.get("/ecommerce/webview/v1/transactions/:transactionId", (req, res) => {

  if (req.params.transactionId.endsWith("61"))
    res.send(mockTransactionData("NOTIFICATION_REQUESTED", "NPG", "EXECUTED", "OK"));

  else if (req.params.transactionId.endsWith("62"))
    res.send(mockTransactionData("NOTIFICATION_REQUESTED", "NPG", "EXECUTED", "KO"));

  else if (req.params.transactionId.endsWith("63"))
    res.send(mockTransactionData("NOTIFICATION_ERROR", "NPG", "EXECUTED", "OK"));

  else if (req.params.transactionId.endsWith("64"))
    res.send(mockTransactionData("NOTIFICATION_ERROR", "NPG", "EXECUTED", "KO"));

  else if (req.params.transactionId.endsWith("65"))
    res.send(mockTransactionData("NOTIFIED_KO", "NPG", "EXECUTED", "KO"));

  else if (req.params.transactionId.endsWith("66"))
    res.send(mockTransactionData("REFUNDED", "NPG", "EXECUTED", "OK"));

  else if (req.params.transactionId.endsWith("67"))
    res.send(mockTransactionData("REFUND_REQUESTED", "NPG", "EXECUTED", "OK"));

  else if (req.params.transactionId.endsWith("68"))
    res.send(mockTransactionData("REFUND_ERROR", "NPG", "EXECUTED", "OK"));

  else if (req.params.transactionId.endsWith("69"))
    res.send(mockTransactionData("EXPIRED_NOT_AUTHORIZED", "NPG", "EXECUTED", "OK"));

  else if (req.params.transactionId.endsWith("70"))
    res.send(mockTransactionData("CANCELED", "NPG", "EXECUTED", "OK"));

  else if (req.params.transactionId.endsWith("71"))
    res.send(mockTransactionData("CANCELLATION_EXPIRED", "NPG", "EXECUTED", "OK"));

  else if (req.params.transactionId.endsWith("72"))
    res.send(mockTransactionData("CLOSURE_ERROR", "NPG", "EXECUTED", undefined));

  else if (req.params.transactionId.endsWith("73"))
    res.send(mockTransactionData("CLOSURE_REQUESTED", "NPG", "CANCELED", undefined));

  else if (req.params.transactionId.endsWith("74"))
    res.send(mockTransactionData("AUTHORIZATION_COMPLETED", "NPG", "AUTHORIZED", undefined));

  else if (req.params.transactionId.endsWith("75"))
    res.send(mockTransactionData("UNAUTHORIZED", "NPG", "DENIED_BY_RISK", undefined));

  else if (req.params.transactionId.endsWith("76"))
    res.send(mockTransactionData("CLOSED", "NPG", undefined, "NOT_RECEIVED"));

  else if (req.params.transactionId.endsWith("77"))
    res.send(mockTransactionData("CLOSED", "NPG", undefined, "EXECUTED"));

  else if (req.params.transactionId.endsWith("78"))
    res.send(mockTransactionData("EXPIRED", "NPG", "EXECUTED", "OK"));

  else if (req.params.transactionId.endsWith("79"))
    res.send(mockTransactionData("AUTHORIZATION_REQUESTED", "NPG", undefined, undefined));

  else 
    res.send(mockTransactionData("NOTIFIED_OK", "NPG", "EXECUTED", "OK"));

});

app.listen(port, () => {
  console.log(`Mock started on port ${port}`)
});

function mockTransactionData(status, gateway, gatewayAuthorizationStatus, outcome) {
  return {
    "authToken": "eyJhbGciOiJIUzUxMiJ9.eyJ0cmFuc2FjdGlvbklkIjoiMTdhYzhkZTMtMjAzMy00YzQ2LWI1MzQtZjE5MTk2NmNlODRjIiwicnB0SWQiOiI3Nzc3Nzc3Nzc3NzMzMDIwMDAwMDAwMDAwMDAwMCIsImVtYWlsIjoibmFtZS5zdXJuYW1lQHBhZ29wYS5pdCIsInBheW1lbnRUb2tlbiI6IjRkNTAwZTk5MDg3MTQyMDJiNTU3NTFlZDZiMWRmZGYzIiwianRpIjoiODUxNjQ2NDQzMjUxMTQxIn0.Fl3PoDBgtEhDSMFR3unkAow8JAe2ztYDoxlu7h-q_ygmmGvO7zP5dlztELUQCofcmYwhB4L9EgSLNT-HbiJgKA",
    "clientId": "IO",
    "feeTotal": 99999999,
    "payments": [
        {
            "amount": 1000,
            "isAllCCP": false,
            "paymentToken": "paymentToken1",
            "reason": "reason1",
            "rptId": "77777777777302012387654312384",
            "transferList": [
                {
                    "digitalStamp": true,
                    "paFiscalCode": "66666666666",
                    "transferAmount": 100,
                    "transferCategory": "transferCategory1"
                },
                {
                    "digitalStamp": false,
                    "paFiscalCode": "77777777777",
                    "transferAmount": 900,
                    "transferCategory": "transferCategory2"
                }
            ]
        }
    ],
    "status": status,
    "transactionId": "1234",
    "sendPaymentResultOutcome": outcome,
    "gateway": gateway,
    "gatewayAuthorizationStatus": gatewayAuthorizationStatus
  }
}