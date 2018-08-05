var express = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const btoa = require("btoa");
const wml_credentials = new Map();
var router = express.Router();

wml_credentials.set("url", "https://us-south.ml.cloud.ibm.com");
wml_credentials.set("username", "c84b1419-dfe1-4437-b537-363189896df6");
wml_credentials.set("password", "8218d4dc-4df5-4f50-9c07-8e48e1cbfcab");

/* GET users listing. */
router.post('/performance', function(request, response, next) {

    var id = request.body.id;
    var product_id = request.body.product_id;
    var department = request.body.departament;
    var year = request.body.year;
    var production = request.body.production;
    var performance = request.body.performance;
    var product_name = request.body.product_name;

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

                var id = request.body.id;
                var product_id = request.body.product_id;
                var department = request.body.departament;
                var year = request.body.year;
                var production = request.body.production;
                var performance = request.body.performance;
                var product_name = request.body.product_name;


                // NOTE: manually define and pass the array(s) of values to be scored in the next line
                const payload = ' {"fields": ["id", "product_id", "department", "year", "production", "performance", "product_name"],' +
                    ' "values": [['+id+','+product_id+','+department+','+year+','+production+','+performance+','+product_name+','+']]}';
                //const scoring_url = "https://us-south.ml.cloud.ibm.com/v3/wml_instances/fa2dcdb1-236a-467c-af71-017eb3a83511/deployments/df386eb2-7859-4551-b2c4-ca2a444d131e/online";

             /*const payload= {
                 "fields": [
                     "id",
                     "product_id",
                     "departament",
                     "year",
                     "production",
                     "performance",
                     "product_name"
                 ],
                 "values": [
                     id,
                     product_id,
                     department,
                     year,
                     production,
                     performance,
                     product_name
                 ]
             };*/


                //const scoring_url = "https://us-south.ml.cloud.ibm.com/v3/wml_instances/fa2dcdb1-236a-467c-af71-017eb3a83511/deployments/0f700e4b-1abd-4f67-b3f2-9f6cabacf5cc/online";
                const scoring_url = "https://us-south.ml.cloud.ibm.com/v3/wml_instances/fa2dcdb1-236a-467c-af71-017eb3a83511/deployments/f3a6a3e6-f809-467d-8b37-09629a92426e/online";


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
    //oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Authorization", token);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.send(payload);
}

module.exports = router;
