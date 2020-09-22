const fs = require('fs')
const _ = require('lodash')
const actionHelper = require("../helpers/actionHelper")
const optionHelper = require("../helpers/optionParameterHelper")
const globalConst = require("../../config/global")
const eCache = require("./eCache");
const log4js = require("log4js");
log4js.configure({
    appenders: { category: { type: 'file', filename: 'cache.log' } },
    categories: { default: { appenders: ['category'], level: 'error' } }
});

const logger = log4js.getLogger('categories');

const getCategoriesList = function() {
    const categoryDataPath = eCache.getDataFilePath("categories")
    const data = fs.readFileSync(categoryDataPath, "utf8")
    const result = JSON.parse(data)
    return {categoryClients: result}
}

const getCategoryByCode = function(catCode){
    const categoryObject = _.find(getCategoriesList().categoryClients, {code: String(catCode)})
    return categoryObject
}

const synchronize = async function() {
    // set request parameters
    const body = JSON.stringify({
        getCategoryClientsRequest: {
            header: {
                namespace: "",
                version: ""
            },
            body: {

            }
        }
    })
    const options = optionHelper.createOption(`${globalConst.BASE_URL}GetListCategory`, null, body, null)
    const response = await actionHelper.actionHandler(options, 'categoryClientResponse')
        //save data to files
    if (response.isSuccess && response.data && response.data.categoryClients) {
        eCache.setCache("categories", response.data.categoryClients);
    }
    else if(response.data == null){
        eCache.setCache("categories", []);
    }    
    else {

        logger.level = "error"
        logger.error("error on setting cache at" + new Date().toDateString());
    }
}
//synchronize();

module.exports = {
    getCategoriesList,
    getCategoryByCode,
    synchronize
}