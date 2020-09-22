'use strict';
const webUrl= require("../../config/global")
const optionHelper = require("../helpers/optionParameterHelper")
const actionHelper = require("../helpers/actionHelper")
const customResponse = require("../../config/globalResponse").customResponse
const errorResponse = require("../../config/errorResponse").customError
const logStart = require('../helpers/logger')
const logEnd = require('../helpers/logger')
const {uuid} = require('uuidv4')
const auth = require("../helpers/auth")
const dataHelper = require('../serviceFactory/subSubCategoryServiceFactory')
const validationHelper = require('../helpers/validationHelper')
const cache = require('../../config/global').isCache

/**
 * @description: controller for GetSubSubCategories
 * @param {*} req 
 * @param {*} res 
 */
const getSubSubCategories = async function(req, res){
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "GetSubSubCategories", "Express Js", "GetSubSubCategories api is started successfully")
    const searchs = req.swagger.params.searchs.value;
    const subCategoryCode = req.swagger.params.subCategoryCode.value;
    const page = req.swagger.params.page.value;
    const pageSize = req.swagger.params.pageSize.value;
    const sortField = req.swagger.params.sortField.value;
    const sortDirection = req.swagger.params.sortDirection.value;
    if((cache)){
        const result = dataHelper.getSubSubCategoriesList()
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
    else{
    const body = JSON.stringify({
        getSubSubCategoryClientsRequest:{
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
                search:searchs,
                subCategoryCode: subCategoryCode
                }
            },
        rootCallId: reqid
        })
    const extraHeader = {
            "Accept-Language":req.swagger.params['Accept-Language'].raw
        }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}GetListSubSubCategory`, extraHeader, body, null)
    const response = await actionHelper.actionHandler(option,'subSubCategoryClientResponse')
    if(response.isSuccess){
         // below logEnd needs to change in future
         // below reqid is callId for log function
        logEnd.LogCallEnd(reqid,"GetSubSubCategories", "ExpressJs",response.error.errorCode,response.error.errorMessage)
        //subSubCategoryResponse = dataModifier.modifyData(subSubCategoryResponse,"subSubCategoryClients")
        customResponse.isSuccess=true;
        customResponse.data = response.data;
        customResponse.error = {error :"",errorDescription : ""}
        return res.send(customResponse);
    }else{
         //below process needs to change in future
         // below reqid is callId for log function
         logEnd.LogCallEnd(reqid,"GetSubSubCategories", "ExpressJs", response.error.errorCode,response.error.errorMessage)
        return res.send(response.errorData);
    }
}
}

/**
 * @description: controller for GetSubSubCategoryBySubCategoryCode
 * @param {*} req 
 * @param {*} res 
 */
const getSubSubCategoryBySubCategoryCode = async function(req, res){
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "GetSubSubCategoryBySubCategoryCode", "Express Js", "GetSubSubCategoryBySubCategoryCode api is started successfully")
    const user = await auth.getUserCode(req)
    const subCategoryCode = req.swagger.params.subCategoryCode.value;
    if(!(validationHelper.codeValidate(subCategoryCode)))
     {
         return res.send(errorResponse.errorHandler(errorResponse.badRequest,"INVALID_REQUEST_PARAMETER"))
     }
     if((cache)){
        const subSubCategoryresult = dataHelper.getSubSubCategoryBySubCategoryCode(subCategoryCode)
        if(subSubCategoryresult.subSubCategoryClients == "")
        {
            return res.send(errorResponse.errorHandler(errorResponse.resourceNotFound,"NO_DATA_FOUND"))
        }
        if(subSubCategoryresult){
            customResponse.isSuccess=true;
            customResponse.data = subSubCategoryresult;
            customResponse.error = {error :"",errorDescription : ""}
            return res.send(customResponse);
        }
        else{
            return res.send(errorResponse.errorHandler(errorResponse.resourceNotFound,"SOMETHING_WENT_WRONG"))
        }
     }
     else{
    const bodyData = JSON.stringify({
        getSubSubCategoryClientBySubCategoryCodeRequest:{
            header:{
                namespace:"",
                version:""
            },
            body:{ 
                subCategoryCode:subCategoryCode
            }
        },
        token: user.token,
        rootCallId: reqid
    })
    const extraHeader = {
        "Accept-Language":req.swagger.params['Accept-Language'].raw
    }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}GetListSubSubCategoryBySubCategoryCode`,extraHeader,bodyData,null)
    const response = await actionHelper.actionHandler(option,'subSubCategoryClientResponse')
    if(response.isSuccess)
    {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid,"GetSubSubCategoryBySubCategoryCode", "ExpressJs",response.error.errorCode,response.error.errorMessage)
        customResponse.isSuccess=true;
        customResponse.data = response.data;
        customResponse.error = {error :"",errorDescription : ""}
        return res.send(customResponse);
    }
    else
    {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid,"GetSubSubCategoryBySubCategoryCode", "ExpressJs", response.error.errorCode,response.error.errorMessage) 
        return res.send(response.errorData);
    }
}
}

/**
 * @description: below module.exports is for exporting all the controllers above
*/
module.exports =
{
    getSubSubCategories,
    getSubSubCategoryBySubCategoryCode
}