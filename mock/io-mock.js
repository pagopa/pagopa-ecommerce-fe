/**
 * Development server built as an express application,
 * able to run frontend (thanks to parcel-bundler) and an API server with json response example.
 */

const express = require("express");
const O = require("fp-ts/Option");

const port = 8082;
const app = express();

app.use(express.json());

app.get("/ecommerce/webview/v1/transactions/:transactionId/outcomes", (req, res) => {

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

    const finalStatusSuffix = transactionId.slice(-4, -3);
    const suffix = transactionId.slice(-3);
    const params = suffixMap[suffix];

    res.send(
        mockTransactionData(
            params.outcome,
            finalStatusSuffix === 0 ? true : false
        ));

});

app.post("/ecommerce/webview/v1/transactions", (req, res) => {
    const notice = req.body?.paymentNotices?.[0];
    const rptId = notice?.rptId;
    const amount = notice?.amount;

    if (rptId && amount) {
        //case 400 bad request
        switch (rptId) {
            case "00000000000000000000000000000":
                return res.status(400).json(
                    {
                        title: "Bad request",
                        status: 400,
                        detail: "Bad request mocked response",
                    }
                );
            case "00000000000000000000000000001":
                return res.status(401);
            case "00000000000000000000000000002":
                return res.status(404).json(
                    {
                        title: "Node error",
                        faultCodeCategory: "PAYMENT_DATA_ERROR",
                        faultCodeDetail: "PPT_DOMINIO_SCONOSCIUTO",
                    }
                );
            case "00000000000000000000000000003":
                return res.status(409).json(
                    {
                        title: "Node error",
                        faultCodeCategory: "PAYMENT_ONGOING",
                        faultCodeDetail: "PPT_PAGAMENTO_IN_CORSO",
                    }
                );
            case "00000000000000000000000000004":
                return res.status(502).json(
                    {
                        title: "Node error",
                        faultCodeCategory: "PAYMENT_UNAVAILABLE",
                        faultCodeDetail: "PPT_AUTORIZZAZIONE",
                    }
                );
            case "00000000000000000000000000005":
                return res.status(503).json(
                    {
                        title: "Node error",
                        faultCodeCategory: "DOMAIN_UNKNOWN",
                        faultCodeDetail: "PAA_ID_INTERMEDIARIO_ERRATO",
                    }
                );
            default:
                return res.status(200).send({
                    transactionId: "577725a90dfe4b89b434b16ccad69247",
                    payments: [
                        {
                            rptId: "77777777777302012387654312384",
                            paymentToken: "paymentToken1",
                            reason: "reason1",
                            amount: 600,
                            transferList: [
                                {
                                    paFiscalCode: "77777777777",
                                    digitalStamp: false,
                                    transferCategory: "transferCategory1",
                                    transferAmount: 500
                                },
                                {
                                    paFiscalCode: "11111111111",
                                    digitalStamp: true,
                                    transferCategory: "transferCategory2",
                                    transferAmount: 100
                                }
                            ]
                        }
                    ],
                    status: "ACTIVATED",
                    feeTotal: 99999999999,
                    clientId: "IO",
                    sendPaymentResultOutcome: "OK",
                    authorizationCode: "string",
                    errorCode: "string",
                    gateway: "NPG"
                });
        }

    } else {
        res.status(400).json({ error: "Missing rptId or amount" });
    }
});

app.post("/ecommerce/webview/v1/transactions/:transactionId/wallets", (req, res) => {
    const paymentMethodId = req.body.paymentMethodId;
    const amount = req.body.amount;
    const transactionId = req.params.transactionId.replace(/\n|\r/g, "");
    const infoReceived = { paymentMethodId, amount, transactionId }
    console.log("Info received: " + JSON.stringify(infoReceived));

    if (paymentMethodId && amount && transactionId) {
        res.status(201).send({
            walletId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            redirectUrl: "http://google.it"
        });
    } else {
        res.status(400).json({ error: "Missing info" });
    }
})

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