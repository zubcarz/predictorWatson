var express = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const btoa = require("btoa");
const wml_credentials = new Map();
var router = express.Router();

wml_credentials.set("url", "https://us-south.ml.cloud.ibm.com");
wml_credentials.set("username", "c84b1419-dfe1-4437-b537-363189896df6");
wml_credentials.set("password", "8218d4dc-4df5-4f50-9c07-8e48e1cbfcab");

/* GET users listing. */
router.post('/production', function(request, response, next) {

    var department = request.body.departament;
    var year = request.body.year;
    var production = request.body.production;
    var performance = request.body.performance;
    var product_name = request.body.product_name;

    var department = "Santander";
    var year = 2007;
    var production =1000;
    var performance = 14;
    var product_name = "lulo";

    apiGet(wml_credentials.get("url"), wml_credentials.get("username"), wml_credentials.get("password"),
        function (res) {

            var parsedGetResponse;
            try {
                parsedGetResponse = JSON.parse(this.responseText);
            } catch(ex) {
                // TODO: handle parsing exception
                console.log("Error parsed json");
            }
            if (parsedGetResponse && parsedGetResponse.token) {
                const token = parsedGetResponse.token
                const wmlToken = "Bearer " + token;


                // NOTE: manually define and pass the array(s) of values to be scored in the next line

                const payload = ' {"fields": ["departament", "year", "production", "performance", "product_name"],' +
                    '"values": [["'+department+'",'+year+','+production+','+performance+',"'+product_name+'"]]}';
                const scoring_url = "https://us-south.ml.cloud.ibm.com/v3/wml_instances/fa2dcdb1-236a-467c-af71-017eb3a83511/deployments/8aee2c5d-49c3-4cf5-bc33-9aecae1e5ec0/online";

                console.log(payload);

                apiPost(scoring_url, wmlToken, payload, function (resp) {
                    var parsedPostResponse;
                    try {
                        parsedPostResponse = JSON.parse(this.responseText);
                    } catch (ex) {
                        // TODO: handle parsing exception
                    }
                    console.log("Scoring response");
                    console.log(parsedPostResponse);
                    response.send(parsedPostResponse);
                }, function (error) {
                    console.log(error);
                });

            } else {
                console.log("Failed to retrieve Bearer token");
            }
        }, function (err) {
            console.log(err);
        });
});

function apiGet(url, username, password, loadCallback, errorCallback){
    const oReq = new XMLHttpRequest();
    const tokenHeader = "Basic " + btoa((username + ":" + password));
    const tokenUrl = url + "/v3/identity/token";

    oReq.addEventListener("load", loadCallback);
    oReq.addEventListener("error", errorCallback);
    oReq.open("GET", tokenUrl);
    oReq.setRequestHeader("Authorization", tokenHeader);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.send();
}

function apiPost(scoring_url, token, payload, loadCallback, errorCallback){
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", loadCallback);
    oReq.addEventListener("error", errorCallback);
    oReq.open("POST", scoring_url);
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Authorization", token);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.send(payload);
}

module.exports = router;
