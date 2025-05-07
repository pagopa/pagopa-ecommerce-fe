/**
 * Development server built as an express application,
 * able to run frontend (thanks to parcel-bundler) and an API server with json response example.
 */

const express = require("express");
const port = 8082;
const app = express();

app.get("/ecommerce/webview/v2/transactions/:transactionId/outcomes", (req, res) => {

    const transactionId = req.params.transactionId.replace(/\n|\r/g, "");
    console.log("Transaction ID received: " + transactionId);
  
    const suffixMap = {
        "000": {
            outcome: 0
        },
        "001": {
            outcome: 1
        },
        "002": {
            outcome: 2
        },
        "003": {
            outcome: 3
        },
        "004": {
            outcome: 4
        },
        "007": {
            outcome: 7
        },
        "008": {
            outcome: 8
        },
        "010": {
            outcome: 10
        },
        "017": {
            outcome: 17
        },
        "018": {
            outcome: 18
        },
        "025": {
            outcome: 25
        },
        "099": {
            outcome: 99
        },
        "116": {
            outcome: 116
        },
        "117": {
            outcome: 117
        },
        "121": {
            outcome: 121
        },
    };

    const finalStatusSuffix = transactionId.slice(-4,-3);
    const suffix = transactionId.slice(-3);
    const params = suffixMap[suffix];

    res.send(
        mockTransactionData(
            params.outcome,
            finalStatusSuffix === 0 ? true : false
        ));

});

app.listen(port, () => {
  console.log(`Mock started on port ${port}`)
});

function mockTransactionData(outcome, isFinalStatus) {
    const totalAmount = outcome === 0 ? 12000 : undefined;
    const fees = outcome === 0 ? 100 : undefined;
    return {
        outcome,
        isFinalStatus,
        totalAmount,
        fees
    }

}