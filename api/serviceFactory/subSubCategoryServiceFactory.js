const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const actionHelper = require("../helpers/actionHelper")
const optionHelper = require("../helpers/optionParameterHelper")
const request = require("request");
const globalConst = require("../../config/global")
const eCache = require("./eCache")
const log4js = require("log4js");

log4js.configure({
    appenders: { category: { type: 'file', filename: 'cache.log' } },
    categories: { default: { appenders: ['category'], level: 'error' } }
});

const logger = log4js.getLogger('subSubCategories');

const getSubSubCategoriesList = function() {
    const subSubCategoryPath = eCache.getDataFilePath("subSubCategories");
    const data = fs.readFileSync(subSubCategoryPath, "utf8")
    const result = JSON.parse(data)
    return {subSubCategoryClients: result}
}

// below functions are for searching the data from respective json files and returning the particular object to server in myclaims api
const getSubSubCategoryBySubCategoryCode = function(subCode){
    const subSubCategoryByCategoryObject = _.filter(getSubSubCategoriesList().subSubCategoryClients, {subCategoryCode: String(subCode)})
    return {subSubCategoryClients:subSubCategoryByCategoryObject}
}

const getSubSubCategoryByCode = function(subSubCode){
    const subSubCategoryObject = _.find(getSubSubCategoriesList().subSubCategoryClients, {code: String(subSubCode)})
    return subSubCategoryObject
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
    const options = optionHelper.createOption(`${globalConst.BASE_URL}GetListSubSubCategory`, null, body, null)
    const response = await actionHelper.actionHandler(options, 'subSubCategoryClientResponse')
    //save data to files
    //.log(response)
    if (response.isSuccess && response.data && response.data.subSubCategoryClients) {
        eCache.setCache("subSubCategories", response.data.subSubCategoryClients);
    } 
    else if(response.data == null){
        eCache.setCache("subSubCategories", []);
    }   
    else {
        logger.level = "error"
        logger.error("error on setting subSubCategories cache at" + new Date().toDateString());
    }
}
//synchronize()
module.exports = {
    getSubSubCategoriesList,
    getSubSubCategoryBySubCategoryCode,
    getSubSubCategoryByCode,
    synchronize
}