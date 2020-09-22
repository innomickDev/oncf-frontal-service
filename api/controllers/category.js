'use strict';
const webUrl = require("../../config/global")
const optionHelper = require("../helpers/optionParameterHelper")
const actionHelper = require("../helpers/actionHelper")
const customResponse = require("../../config/globalResponse").customResponse
const errorResponse  = require('../../config/errorResponse').customError
const logStart = require('../helpers/logger')
const logEnd = require('../helpers/logger')
const {uuid} = require('uuidv4')
const cache = require('../../config/global').isCache
const dataHelper = require('../serviceFactory/categoryServiceFactory')
const handle = require('../serviceFactory/handler')

/**
 * @description: controller for GetCategories
 * @param {*} req 
 * @param {*} res 
 */
const getCategories =async (req, res) => {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "GetCategories", "Express Js", "GetCategories api is started successfully")
    const searchs = req.swagger.params.searchs.value;
    const page = req.swagger.params.page.value;
    const pageSize = req.swagger.params.pageSize.value;
    const sortField = req.swagger.params.sortField.value;
    const sortDirection = req.swagger.params.sortDirection.value;
    if((cache)){
        const result = dataHelper.getCategoriesList()
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
    else
    {
    const body = JSON.stringify({
        getCategoryClientsRequest:{
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
    const options = optionHelper.createOption(`${webUrl.BASE_URL}GetListCategory `,extraHeader,body,null)
    const response = await actionHelper.actionHandler(options,'categoryClientResponse')
    if(response.isSuccess){
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid,"GetCategories", "ExpressJs",response.error.errorCode,response.error.errorMessage)
        customResponse.isSuccess=true;
        customResponse.data = response.data;
        customResponse.error = {error :"",errorDescription : ""}
        return res.send(customResponse);
    }else{
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid,"GetCategories", "ExpressJs", response.error.errorCode,response.error.errorMessage)
        return res.send(response.errorData);
    }
}
}

const runCronTab = function(req, res){
    handle.handle()
   return res.send(customResponse)
}

/**
 * @description: below module.exports is for exporting all the controllers above
*/
module.exports = {
    getCategories,
    runCronTab
}