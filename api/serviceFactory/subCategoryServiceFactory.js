const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const actionHelper = require("../helpers/actionHelper")
const optionHelper = require("../helpers/optionParameterHelper")
const request = require("request");
const globalConst = require("../../config/global")
const eCache = require("./eCache");
const log4js = require("log4js");
log4js.configure({
    appenders: { category: { type: 'file', filename: 'cache.log' } },
    categories: { default: { appenders: ['category'], level: 'error' } }
});

const logger = log4js.getLogger('subCategories');

const getSubCategoriesList = function() {
    const subCategoryPath = eCache.getDataFilePath('subCategories')
    const data = fs.readFileSync(subCategoryPath, "utf8")
    const result = JSON.parse(data)
    return {subCategoryClients: result}
}

// below functions are for searching the data from respective json files and returning the particular object to server in myclaims api
const getSubCategoryByCategoryCode = function(catCode){
    const subCategoryByCategoryObject = _.filter(getSubCategoriesList().subCategoryClients, {categoryCode: String(catCode)})
    return {subCategoryClients:subCategoryByCategoryObject}
}

const getSubCategoryByCode = function(subCode){
    const subCategoryObject = _.find(getSubCategoriesList().subCategoryClients, {code: String(subCode)})
    return subCategoryObject
}

const synchronize = async function() {
    // set request parameters
    const body = JSON.stringify({
        getSubCategoryClientsRequest: {
            header: {
                namespace: "",
                version: ""
            },
            body: {

            }
        }
    })
    const options = optionHelper.createOption(`${globalConst.BASE_URL}GetListSubCategory`, null, body, null)
    const response = await actionHelper.actionHandler(options, 'subCategoryClientResponse')

    //save data to files
    //console.log(response)
    if (response.isSuccess && response.data && response.data.subCategoryClients) {
        eCache.setCache("subCategories", response.data.subCategoryClients);
    } 
    else if(response.data == null){
        eCache.setCache("subCategories", []);
    }   
    else {
        logger.level = "error"
        logger.error("error on setting cache at" + new Date().toDateString());
    }
}

//synchronize();
module.exports = {
    getSubCategoriesList,
    getSubCategoryByCategoryCode,
    getSubCategoryByCode,
    synchronize
}