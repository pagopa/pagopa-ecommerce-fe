/**
 * Development server built as an express application,
 * able to run frontend (thanks to parcel-bundler) and an API server with json response example.
 */

const express = require("express");
const port = 8080;
const app = express();

app.get("/ecommerce/webview/v1/transactions/:transactionId", (req, res) => {

    const transactionId = req.params.transactionId;
    console.log("Transaction ID recieved: " + transactionId);

    const paymentSuccess =  {
        status: "NOTIFIED_OK",
        gateway: "NPG",
        gatewayAuthorizationStatus: "EXECUTED",
        outcome: "OK"
    }
  
    const suffixMap = {
        "61": {
            status: "NOTIFICATION_REQUESTED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "OK"
        },
        "62": {
            status: "NOTIFICATION_REQUESTED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "KO"
        },
        "63": {
            status: "NOTIFICATION_ERROR",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "OK"
        },
        "64": {
            status: "NOTIFICATION_ERROR",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "KO"
        },
        "65": {
            status: "NOTIFIED_KO",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "KO"
        },
        "66": {
            status: "REFUNDED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "OK"
        },
        "67": {
            status: "REFUND_REQUESTED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "OK"
        },
        "68": {
            status: "REFUND_ERROR",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "OK"
        },
        "69": {
            status: "EXPIRED_NOT_AUTHORIZED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "OK"
        },
        "70": {
            status: "CANCELED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "OK"
        },
        "71": {
            status: "CANCELLATION_EXPIRED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "OK"
        },
        "72": {
            status: "CLOSURE_ERROR",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: undefined
        },
        "73": {
            status: "CLOSURE_REQUESTED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "CANCELED",
            outcome: undefined
        },
        "74": {
            status: "AUTHORIZATION_COMPLETED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "AUTHORIZED",
            outcome: undefined
        },
        "75": {
            status: "UNAUTHORIZED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "DENIED_BY_RISK",
            outcome: undefined
        },
        "76": {
            status: "CLOSED",
            gateway: "NPG",
            gatewayAuthorizationStatus: undefined,
            outcome: "NOT_RECEIVED"
        },
        "77": {
            status: "CLOSED",
            gateway: "NPG",
            gatewayAuthorizationStatus: undefined,
            outcome: "EXECUTED"
        },
        "78": {
            status: "EXPIRED",
            gateway: "NPG",
            gatewayAuthorizationStatus: "EXECUTED",
            outcome: "OK"
        },
        "79": {
            status: "AUTHORIZATION_REQUESTED",
            gateway: "NPG",
            gatewayAuthorizationStatus: undefined,
            outcome: undefined
        }
    };

    const suffix = transactionId.slice(-2);
    const params = suffixMap[suffix] || paymentSuccess;

    res.send(
        mockTransactionData(
            params.status, 
            params.gateway, 
            params.gatewayAuthorizationStatus,
            params.outcome
        ));

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