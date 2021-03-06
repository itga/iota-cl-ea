const fs = require('fs');

const express = require('express');
const IOTA = require('iota.lib.js');

const app = express();

module.exports = app;

var iota = new IOTA(JSON.parse(fs.readFileSync('node.json').toString()));

function throwError(res, statusCode, message) {
    res.status(statusCode).send({ error: message });
}

function throwInvalidRequest(res) {
    throwError(res, 400, "Invalid request!");
}

app.get('/account-data', function(req, res) {
    trytesSeed = iota.utils.toTrytes(req.query.seed);
    iota.api.getAccountData(trytesSeed, function(error, response) {
        if (error) {
            console.error(error);
            throwInvalidRequest(res);
        } else {
            res.send(response);
        }
    });
});

app.get('/broadcast-and-store', function(req, res) {
    trytes = req.query.trytes.split(",");
    iota.api.broadcastAndStore(trytes, function(error, response) {
        if (error) {
            console.error(error);
            throwInvalidRequest(res);
        } else {
            res.send(response);
        }
    });
});

app.get('/send-trytes', function(req, res) {
    try {
        trytes = req.query.trytes.split(",");
        depth = parseInt(req.query.depth);
        minWeightMagnitude = parseInt(req.query.minWeightMagnitude);
    } catch (error) {
        console.error(error);
        throwInvalidRequest(res);
    }
    iota.api.sendTrytes(trytes, depth, minWeightMagnitude, function(error, response) {
        if (error) {
            console.error(error);
            throwInvalidRequest(res);
        } else {
            res.send(response);
        }
    });
});

app.get('/transaction-object', function(req, res) {
    transactions = req.query.transactions.split(",");
    iota.api.getTransactionsObjects(transactions, function(error, response) {
        if (error) {
            console.error(error);
            throwInvalidRequest(res);
        } else {
            res.send(response);
        }
    });
});

app.get('/transaction-object-query', function(req, res) {
    var searchValues = {};
    searchValues.bundles = (req.query.bundles != undefined) ? req.query.bundles.split(",") : [];
    searchValues.addresses = (req.query.addresses != undefined) ? req.query.addresses.split(",") : [];
    searchValues.tags = (req.query.tags != undefined) ? req.query.tags.split(",") : [];
    searchValues.approvees = (req.query.approvees != undefined) ? req.query.approvees.split(",") : [];

    iota.api.findTransactionObjects(searchValues, function(error, response) {
        if (error) {
            console.error(error);
            throwInvalidRequest(res);
        } else {
            res.send(response);
        }
    });
});

app.get('/info', function(req, res) {
    iota.api.getNodeInfo(function(error, response) {
        if (error) {
            console.error(error);
            throwError(res, 500, "Request to IOTA node failed!");
        } else {
            res.send(response);
        }
    });
});

app.get('/', function (req, res) {
    res.send("");
});