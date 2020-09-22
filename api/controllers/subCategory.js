'use strict';
const webUrl = require("../../config/global")
const optionHelper = require("../helpers/optionParameterHelper")
const actionHelper = require("../helpers/actionHelper")
const customResponse = require("../../config/globalResponse").customResponse
const errorResponse = require("../../config/errorResponse").customError
const logStart = require('../helpers/logger')
const logEnd = require('../helpers/logger')
const {uuid} = require('uuidv4')
const auth = require("../helpers/auth")
const dataHelper = require('../serviceFactory/subCategoryServiceFactory')
const cache = require('../../config/global').isCache
const validationHelper = require('../helpers/validationHelper')

/**
 * @description: controller for GetSubCategories
 * @param {*} req 
 * @param {*} res 
 */
const getSubCategories = async function(req, res){
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "GetSubCategories", "Express Js", "GetSubCategories api is started successfully")
    const searchs = req.swagger.params.searchs.value;
    const page = req.swagger.params.page.value;
    const pageSize = req.swagger.params.pageSize.value;
    const sortField = req.swagger.params.sortField.value;
    const sortDirection = req.swagger.params.sortDirection.value;
    if((cache)){
        const result = dataHelper.getSubCategoriesList()
        if(result){
            customResponse.isSuccess=true;
            customResponse.data = result;
            customResponse.error = {error :"",errorDescription : ""}
            return res.send(customResponse);
        }
        else{
            return res.send(errorResponse.errorHandler(errorResponse.resourceNotFound,"SOMETHING_WENT_WRONG"))
        }
    }
    else {
    const body = JSON.stringify({
        getSubCategoryClientsRequest:{
            header:{
                namespace:"",
                version:""
            },
            body:{
                pagination:{
                    page:page,
                    pageSize:pageSize,
                    sortField:sortField,
                    sortDirection:sortDirection
                },
                search:searchs
                }
            },
        rootCallId: reqid
        })
    const extraHeader = {
            "Accept-Language":req.swagger.params['Accept-Language'].raw
        }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}GetListSubCategory`,extraHeader,body,null)
    const response = await actionHelper.actionHandler(option,'subCategoryClientResponse')
    if(response.isSuccess){
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid,"GetSubCategories", "ExpressJs",response.error.errorCode,response.error.errorMessage)
       // response.data = dataModifier.modifyData(response.data,"subCategoryClients")
        customResponse.isSuccess=true;
        customResponse.data = response.data;
        customResponse.error = {error :"",errorDescription : ""}
        return res.send(customResponse);
    }else{
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid,"GetSubCategories", "ExpressJs", response.error.errorCode,response.error.errorMessage)
        return res.send(response.errorData);
    }
}
}

/**
 * @description: controller for GetSubCategoryByCategoryCode
 * @param {*} req 
 * @param {*} res 
 */
const getSubCategoryByCategoryCode = async function(req, res){
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "GetSubCategoryByCategoryCode", "Express Js", "GetSubCategoryByCategoryCode api is started successfully")
    const user = await auth.getUserCode(req)
    const categoryCode= req.swagger.params.categoryCode.value;
    if(!(validationHelper.codeValidate(categoryCode)))
     {
         return res.send(errorResponse.errorHandler(errorResponse.badRequest,"INVALID_REQUEST_PARAMETER"))
     }
     if((cache)){
        const subCategoryresult = dataHelper.getSubCategoryByCategoryCode(categoryCode)
        if(subCategoryresult.subCategoryClients == "")
        {
            return res.send(errorResponse.errorHandler(errorResponse.resourceNotFound,"NO_DATA_FOUND"))
        }
        if(subCategoryresult){
            customResponse.isSuccess=true;
            customResponse.data = subCategoryresult;
            customResponse.error = {error :"",errorDescription : ""}
            return res.send(customResponse);
        }
        else{
            return res.send(errorResponse.errorHandler(errorResponse.resourceNotFound,"SOMETHING_WENT_WRONG"))
        }
     }
     else{
    const requestBody = JSON.stringify({
        getSubCategoryClientByCategoryCodeRequest:{
            header:{
                namespace:"",
                version:""
            },
            body:{
                categoryCode:categoryCode
            }
        },
        token: user.token,
        rootCallId: reqid
    })
    const extraHeader = {
        "Accept-Language":req.swagger.params['Accept-Language'].raw
    }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}GetListSubCategoryByCategoryCode`,extraHeader,requestBody,null)
    const response = await actionHelper.actionHandler(option,'subCategoryClientResponse')
    if(response.isSuccess){
         // below logEnd needs to change in future
         // below reqid is callId for log function
         logEnd.LogCallEnd(reqid,"GetSubCategoryByCategoryCode", "ExpressJs",response.error.errorCode,response.error.errorMessage)
        customResponse.isSuccess=true;
        customResponse.data = response.data;
        customResponse.error = {error :"",errorDescription : ""}
        return res.send(customResponse);
    }else{
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid,"GetSubCategoryByCategoryCode", "ExpressJs", response.error.errorCode,response.error.errorMessage) 
        return res.send(response.errorData);
    }
}
}

/**
 * @description: below module.exports is for exporting all the controllers above
*/
module.exports ={
    getSubCategories,
    getSubCategoryByCategoryCode
}