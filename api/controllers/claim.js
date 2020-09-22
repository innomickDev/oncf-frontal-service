'use strict';
const webUrl = require("../../config/global")
const optionHelper = require("../helpers/optionParameterHelper")
const actionHelper = require("../helpers/actionHelper")
const customResponse = require("../../config/globalResponse").customResponse
const errorResponse = require("../../config/errorResponse").customError
const dataModifier = require("../helpers/modifyData")
const auth = require("../helpers/auth")
const logStart = require('../helpers/logger')
const logEnd = require('../helpers/logger')
const { uuid } = require('uuidv4')
const claimSource = require('../../config/global').claim_source
const stationHelper = require('../helpers/dataHelper')
const categoryHelper = require('../helpers/dataHelper')
const subCategoryHelper = require('../helpers/dataHelper')
const subSubCategoryHelper = require('../helpers/dataHelper')
const validationHelper = require('../helpers/validationHelper')

/**
 * @description: controller for CreateClaim
 * @param {*} req 
 * @param {*} res 
 */
const createClaim = async function (req, res) {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "CreateClaim", "Express Js", "CreateClaim api is started successfully")
    const { departureStationCode, arrivalStationCode, trainNumber,
        travelDate, categoryCode, subCategoryCode, subSubCategoryCode,
        claimSubject, claimDetails, ticketAttachment, claimAttachment, isONCFUser, userEmail, userCode }
        = req.swagger.params['body'].value
    //below condition is for input validation 
    if (!((validationHelper.validateInt(categoryCode, subCategoryCode, subSubCategoryCode))
        && (validationHelper.validateAttachment(ticketAttachment)))) {
        return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
    }
    const user = await auth.getUserCode(req);
    const body = JSON.stringify({
        createClaimClientRequest: {
            header: {
                namespace: "Oncf.ma/DataContracts/2020/02/Complaints/Gateway/v1",
                version: "1.0"
            },
            body: {
                userCode: userCode, // user id for which cr
                departureStationCode,
                arrivalStationCode,
                trainNumber,
                travelDate,
                categoryCode,
                subCategoryCode,
                subSubCategoryCode: subSubCategoryCode ? subSubCategoryCode : "",
                claimSubject,
                claimDetails,
                referanceNo: "",
                isONCFUser,
                isAnswered: false,
                agentCode: "",
                isAttachmentUpdate: false,
                ticketAttachment,
                claimAttachment: claimAttachment ? claimAttachment : "",
                userEmail,
                claimChannel: claimSource
            }
        },
        token: user.token,
        rootCallId: reqid
    })
    const extraHeader = {
        "Accept-Language": req.swagger.params['Accept-Language'].raw
    }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}IntiateClaimClient`, extraHeader, body, null)
    const response = await actionHelper.actionHandler(option, 'claimClientResponse')
    console.log(response);
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "CreateClaim", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: "", errorDescription: "" }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "CreateClaim", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(response.errorData);
    }
}

/**
 * @description: controller for UpdateClaim
 * @param {*} req 
 * @param {*} res 
 */
const updateClaim = async function (req, res) {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "UpdateClaim", "Express Js", "UpdateClaim api is started successfully")
    const { code, claimDetails } = req.swagger.params['body'].value
    //below condition is for input validation 
    if (!(validationHelper.codeValidate(code))) {
        return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
    }
    const user = await auth.getUserCode(req);
    const body = JSON.stringify({
        updateClaimClientRequest: {
            header: {
                namespace: "",
                version: ""
            },
            body: {
                code: code,
                claimDetails: claimDetails,
                claimChannel: claimSource
            }
        },
        token: user.token,
        rootCallId: reqid
    })
    const extraHeader = {
        "Accept-Language": req.swagger.params['Accept-Language'].raw
    }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}UpdateClaimClient`, extraHeader, body, null)
    const response = await actionHelper.actionHandler(option, 'updateClaimClientResponse')
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "UpdateClaim", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: "", errorDescription: "" }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "UpdateClaim", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(response.errorData);
    }
}

/**
 * @description: controller for GetTicketAttachment
 * @param {*} req 
 * @param {*} res 
 */
const getTicketAttachment = async function (req, res) {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "GetTicketAttachment", "Express Js", "GetTicketAttachment api is started successfully")
    const user = await auth.getUserCode(req);
    const code = req.swagger.params.code.value;
    if (!(validationHelper.codeValidate(code))) {
        return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
    }
    const body = JSON.stringify({
        getTicketAttachmentClientRequest: {
            header: {
                namespace: "Oncf.ma/DataContracts/2020/02/Complaints/Gateway/v1",
                version: "1.0"
            },
            body: {
                code: code
            }
        },
        token: user.token,
        rootCallId: reqid
    })
    const extraHeader = {
        "Accept-Language": req.swagger.params['Accept-Language'].raw
    }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}GetTicketAttachment`, extraHeader, body, null)
    const response = await actionHelper.actionHandler(option, 'ticketAttachmentResponse')
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "GetTicketAttachment", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: "", errorDescription: "" }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "GetTicketAttachment", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(response.errorData);
    }
}

/**
 * @description: controller for GetClaimAttachment
 * @param {*} req 
 * @param {*} res 
 */
const getClaimAttachment = async function (req, res) {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "GetClaimAttachment", "Express Js", "GetClaimAttachment api is started successfully")
    const user = await auth.getUserCode(req);
    const code = req.swagger.params.code.value;
    if (!(validationHelper.codeValidate(code))) {
        return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
    }
    const body = JSON.stringify({
        getClaimAttachmentClientRequest: {
            header: {
                namespace: "Oncf.ma/DataContracts/2020/02/Complaints/Gateway/v1",
                version: "1.0"
            },
            body: {
                code: code
            }
        },
        token: user.token,
        rootCallId: reqid
    })
    const extraHeader = {
        "Accept-Language": req.swagger.params['Accept-Language'].raw
    }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}GetClaimAttachment`, extraHeader, body, null)
    const response = await actionHelper.actionHandler(option, 'claimAttachmentResponse')
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "GetClaimAttachment", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: "", errorDescription: "" }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "GetClaimAttachment", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(response.errorData);
    }
}

/**
 * @description: controller for UpdateTicketAttachment
 * @param {*} req 
 * @param {*} res 
 */
const updateTicketAttachment = async function (req, res) {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "UpdateTicketAttachment", "Express Js", "UpdateTicketAttachment api is started successfully")
    const user = await auth.getUserCode(req);
    const { code, attachment } = req.swagger.params['body'].value;
    if (!((validationHelper.codeValidate(code)) && (validationHelper.validateAttachment(attachment)))) {
        return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
    }
    const body = JSON.stringify({
        updateTicketAttachmentClientRequest: {
            header: {
                version: "1.0",
                namespace: "Oncf.ma/DataContracts/2020/02/Complaints/Gateway"
            },
            body: {
                code: code,
                attachment: attachment
            }
        },
        token: user.token,
        rootCallId: reqid
    })
    const extraHeader = {
        "Accept-Language": req.swagger.params['Accept-Language'].raw
    }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}UpdateTicketAttachment`, extraHeader, body, null)
    const response = await actionHelper.actionHandler(option, 'updateTicketAttachmentResponse')
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "UpdateTicketAttachment", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: "", errorDescription: "" }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "UpdateTicketAttachment", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(response.errorData);
    }
}

/**
 * @description: controller for UpdateClaimAttachment
 * @param {*} req 
 * @param {*} res 
 */
const updateClaimAttachment = async function (req, res) {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "UpdateClaimAttachment", "Express Js", "UpdateClaimAttachment api is started successfully")
    const user = await auth.getUserCode(req);
    const { code, attachment } = req.swagger.params['body'].value;
    if (!((validationHelper.codeValidate(code)) && (validationHelper.validateAttachment(attachment)))) {
        return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
    }
    const body = JSON.stringify({
        updateClaimAttachmentClientRequest: {
            header: {
                version: "",
                namespace: ""
            },
            body: {
                code: code,
                attachment: attachment
            }
        },
        token: user.token,
        rootCallId: reqid
    })
    const extraHeader = {
        "Accept-Language": req.swagger.params['Accept-Language'].raw
    }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}UpdateClaimAttachmentClient`, extraHeader, body, null)
    const response = await actionHelper.actionHandler(option, 'updateClaimAttachmentResponse')
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "UpdateClaimAttachment", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: "", errorDescription: "" }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "UpdateClaimAttachment", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(response.errorData);
    }
}

/**
 * @description: controller for MyClaims
 * @param {*} req 
 * @param {*} res 
 */
const myClaims = async function (req, res) {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "MyClaims", "Express Js", "MyClaims api is started successfully")
    const user = await auth.getUserCode(req)
    const body = JSON.stringify({
        getMyClaimClientRequest: {
            header: {
                namespace: "",
                version: ""
            },
            body: {
                code: user.codeClient
            }
        },
        token: user.token,
        rootCallId: reqid
    })
    const extraHeader = {
        "Accept-Language": req.swagger.params['Accept-Language'].raw
    }

    const option = optionHelper.createOption(`${webUrl.BASE_URL}GetMyClaimClients`, extraHeader, body, null)
    //console.log(option);
    const response = await actionHelper.actionHandler(option, 'claimClientResponse')
    //below condition is to check the data for myCLaims is api is null or not
    // below reqid is callId for log function
    //console.log(response);
    if (response.data == null) {
        logEnd.LogCallEnd(reqid, "MyClaims", "ExpressJs", errorResponse.resourceNotFound, "NO CLAIMS FOUND")
        return res.send(errorResponse.errorHandler(errorResponse.resourceNotFound, "NO CLAIMS FOUND"));
    }
    //below is for getting all the meta data by code from json files
    const result = response.data.claimClients
    for (let i of result) {
        if (i.subSubCategoryCode != "") {
            i.subSubCategory = await subSubCategoryHelper.getSubSubCategoryByCode(i.subSubCategoryCode)
        }
        i.departureStation = await stationHelper.getDepartureStationByCode(i.departureStationCode)
        i.arrivalStation = await stationHelper.getArrivalStationByCode(i.arrivalStationCode)
        i.category = await categoryHelper.getCategoryByCode(i.categoryCode)
        i.subCategory = await subCategoryHelper.getSubCategoryByCode(i.subCategoryCode)

    }
    if (response.isSuccess && response.data != null) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "MyClaims", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        response.data = dataModifier.modifyData(response.data, "claimClients")
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: "", errorDescription: "" }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "MyClaims", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(response.errorData);
    }
}

/**
 * @description: controller for GetClaimByCode
 * @param {*} req 
 * @param {*} res 
 */
const getClaimByCode = async function (req, res) {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "GetClaimByCode", "Express Js", "GetClaimByCode api is started successfully")
    const user = await auth.getUserCode(req)
    const code = req.swagger.params.code.value;
    if (!validationHelper.codeValidate(code)) {
        return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
    }
    const body = JSON.stringify({
        getClaimClientByCodeRequest: {
            header: {
                namespace: "",
                version: ""
            },
            body: {
                code: code
            }
        },
        token: user.token,
        rootCallId: reqid
    })
    const extraHeader = {
        "Accept-Language": req.swagger.params['Accept-Language'].raw
    }
    const option = optionHelper.createOption(`${webUrl.BASE_URL}GetClaimByCode`, extraHeader, body, null)
    const response = await actionHelper.actionHandler(option, 'claimClientResponse')
    if (response.data == null) {
        return res.send(errorResponse.errorHandler(errorResponse.resourceNotFound, "NO CLAIMS FOUND"))
    }
    const result = response.data
    if (result.subSubCategoryCode != "") {

        result.subSubCategory = await subSubCategoryHelper.getSubSubCategoryByCode(result.subSubCategoryCode)
    }
    result.departureStation = await stationHelper.getDepartureStationByCode(result.departureStationCode)
    result.arrivalStation = await stationHelper.getArrivalStationByCode(result.arrivalStationCode)
    result.category = await categoryHelper.getCategoryByCode(result.categoryCode)
    result.subCategory = await subCategoryHelper.getSubCategoryByCode(result.subCategoryCode)

    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "GetClaimByCode", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        response.data = dataModifier.modifyDataByObject(response.data)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: "", errorDescription: "" }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "GetClaimByCode", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(response.errorData);
    }
}

/**
 * @description: below module.exports is for exporting all the controllers above
*/
module.exports = {
    createClaim,
    updateClaim,
    getTicketAttachment,
    getClaimAttachment,
    updateTicketAttachment,
    updateClaimAttachment,
    myClaims,
    getClaimByCode
}