const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const actionHelper = require("../helpers/actionHelper")
const optionHelper = require("../helpers/optionParameterHelper")
const globalConst = require("../../config/global")
const eCache = require("./eCache.js");
const log4js = require("log4js");

log4js.configure({
    appenders: { stations: { type: 'file', filename: 'cache.log' } },
    categories: { default: { appenders: ['stations'], level: 'error' } }
});

const logger = log4js.getLogger('stations');

const getStationsList = function() {
    const stationDataPath = eCache.getDataFilePath("stations");
    const data = fs.readFileSync(stationDataPath, "utf8")
    const result = JSON.parse(data)
    return {listGare: result}
}

const getDepartureStationByCode = function(depCode){
    const departStationObject = _.find(getStationsList().listGare, {codeGare: String(depCode)})
    return departStationObject
}

const getArrivalStationByCode = function(arrCode){
    const arrStationObject = _.find(getStationsList().listGare, {codeGare: String(arrCode)})
    return arrStationObject
}

const getStationByCode = function(statCode){
    const stationObject = _.find(getStationsList().listGare, {codeGare: String(statCode)})
    return stationObject
}

const synchronize = async function() {
    // set request parameters
    //return false;
    const body = JSON.stringify({
        gareRequest: {
            head: {
                namespace: "",
                version: ""
            },
            body: {

            }
        }
    })
    //console.log(globalConst)
    const option = optionHelper.createOption(`${globalConst.ECOMMERCE_URL}GetListGare`, null, body, null)
    //console.log(option)
    const response = await actionHelper.stationActionHandler(option, 'gareResponse')
    //console.log(response)
    if (response.isSuccess && response.data && response.data.listGare) {
        eCache.setCache("stations", response.data.listGare);
    } 
    else if(response.data == null){
        eCache.setCache("stations", []);
    }   
    else {
        logger.level = "error"
        logger.error("error on setting cache at" + new Date().toDateString());
    }
}

//synchronize();

module.exports = {
    getStationsList,
    synchronize,
    getDepartureStationByCode,
    getArrivalStationByCode,
    getStationByCode
}