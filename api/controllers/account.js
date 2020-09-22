'use strict';
const webUrl = require("../../config/global")
const optionHelper = require("../helpers/optionParameterHelper")
const actionHelper = require("../helpers/actionHelper")
const customResponse = require("../../config/globalResponse").customResponse
const errorResponse = require("../../config/errorResponse").customError
const logStart = require('../helpers/logger')
const logEnd = require('../helpers/logger')
const { uuid } = require('uuidv4')
const validationHelper = require('../helpers/validationHelper')
const auth = require('../helpers/auth')
const dob = "1900-01-01T10:00:00+01:00"
const identityHelper = require('../helpers/dataHelper')

/**
 * @description: controller for FrontOffie ChangePassword
 * @param {*} req 
 * @param {*} res  
 */
const accountChangePassword = async function (req, res) {
    // below process has  to make some changes in future
    // below facpid means front office accountChangePassword's callId for logging
    let facpid = uuid()
    logStart.LogCallStart(facpid, "FrontOffice ChangePassword", "Express Js", "FrontOffice ChangePassword api is started successfully")
    let { email, oldPassword, newPassword } = req.swagger.params['body'].value;
    if (!(validationHelper.validateEmail(email))) {
        //return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
        return res.send(errorResponse.errorHandler(errorResponse.Validation,identityHelper.identityErrorMessage(1)));
    }
    const body = JSON.stringify({
        head: {
            namespace: "Oncf.ma/DataContracts/2019/04/Payment/Gateway/v1",
            version: "v1"
        },
        body: {
            login: email,
            oldPwd: oldPassword,
            newPwd: newPassword
        }
    })
    const option = optionHelper.createOption(`${webUrl.FRONT_URL}ChangePassword`, null, body, null);
    const response = await actionHelper.frontEndActionHandler(option)
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below facpid means front office accountChangePassword's callId for logging
        logEnd.LogCallEnd(facpid, "FrontOffice ChangePassword", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: response.error.errorCode, 
            errorDescription: identityHelper.identityErrorMessage(response.error.errorCode) }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below facpid means front office accountChangePassword's callId for logging
        logEnd.LogCallEnd(facpid, "FrontOffice ChangePassword", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        //return res.send(errorResponse.errorHandler(errorResponse.resourceNotFound, "SOMETHING_WRONG"));
        return res.send(errorResponse.errorHandler(response.error.errorCode, 
            identityHelper.identityErrorMessage(response.error.errorCode)));
    }
}

/**
 * @description: controller for ConfirmForgottenPassword
 * @param {*} req 
 * @param {*} res  
 */
const confirmForgottenPassword = async function (req, res) {
    // below process has  to make some changes in future
    // below ffpid means  Front Office ConfirmForgottenPassword's callId for logging
    let ffpid = uuid()
    logStart.LogCallStart(ffpid, "FrontOffice ConfirmForgottenPassword", "Express Js", "FrontOffice ConfirmForgottenPassword api is started successfully")
    let { confirmationCode, email, newPassword } = req.swagger.params['body'].value;
    if (!(validationHelper.validateEmail(email))) {
        //return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
        return res.send(errorResponse.errorHandler(errorResponse.Validation, identityHelper.identityErrorMessage(1)));
    }
    const body = JSON.stringify({
        head: {
            namespace: "oncf.ma/OperationContracts/2019/04/Ecommerce/Gateway/v1",
            ReturnedLines: "0",
            version: "v1",
            ErrorCode: "",
            ErrorMessage: ""
        },
        body: {
            login: email,
            confirmationCode,
            newPassword
        }
    })
    const option = optionHelper.createOption(`${webUrl.FRONT_URL}ConfirmForgottenPassword`, null, body, null);
    const response = await actionHelper.frontEndActionHandler(option)
    console.log(response);
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below ffpid means  Front Office ConfirmForgottenPassword's callId for logging
        logEnd.LogCallEnd(ffpid, "FrontOffice ConfirmForgottenPassword", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: "", errorDescription: "" }
        customResponse.error = { error: response.error.errorCode, 
            errorDescription: identityHelper.identityErrorMessage(response.error.errorCode) }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below ffpid means  Front Office ConfirmForgottenPassword's callId for logging
        logEnd.LogCallEnd(ffpid, "FrontOffice ConfirmForgottenPassword", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        //return res.send(errorResponse.errorHandler(errorResponse.resourceNotFound, "SOMETHING_WRONG"));
        return res.send(errorResponse.errorHandler(response.error.errorCode, 
            identityHelper.identityErrorMessage(response.error.errorCode)));
    }
}

/**
 * @description: controller for Client Registration
 * @param {*} req 
 * @param {*} res  
 */
const clientRegistration = async function (req, res) {
    // below logStart has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "Client Registration", "Express Js", "Client Registration api is started successfully")
    let { title, civility, firstName, lastName, dateofbirth, mobileNumber, address, city, country, email, password }
        = req.swagger.params['body'].value;
    if (!(validationHelper.validateEmail(email))) {
        //return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
        return res.send(errorResponse.errorHandler(errorResponse.Validation, identityHelper.identityErrorMessage(1)));
    }
    const frontBody = JSON.stringify({
        head: {
            namespace: "Oncf.ma/DataContracts/2019/04/Payment/Gateway/v1",
            version: "v1"
        },
        body: {
            email: email,
            civilite: title,
            prenom: firstName,
            nom: lastName,
            dateNaissance: dob,
            adresse: address,
            ville: city,
            pays: country,
            login: email,
            pwd: password,
            provider: "",
            nomAr: "",
            prenomAr: "",
            emailConfirmation: true,
            tel: mobileNumber,
            telConfirmation: false,
            nomAffichage: "",
            codeClient: "",
            profilDemographique: "",
            profession: "",
            employeur: "",
            properties: null,
            activationUrl: webUrl.ACTIVATE_ACCOUNT
        }
    })
    const frontOption = optionHelper.createOption(`${webUrl.FRONT_URL}CreateUser`, null, frontBody, null);
    const frontResponse = await actionHelper.frontEndActionHandler(frontOption)
    if (frontResponse.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "Client Registration", "ExpressJs", frontResponse.error.errorCode, frontResponse.error.errorMessage)
        const body = JSON.stringify({
            customerClientRegistrationRequest:
            {
                header:
                {
                    namespace: "",
                    version: ""
                },
                body:
                {
                    email: email
                }
            }
        })
        const extraHeader = {
            "Accept-Language": req.swagger.params['Accept-Language'].raw
        }
        const option = optionHelper.createOption(`${webUrl.BASE_URL}RecordCustomerRegistration`, extraHeader, body, null);
        await actionHelper.actionHandler(option, 'customerClientResponse')
        customResponse.isSuccess = true;
        customResponse.data = frontResponse.data;
        customResponse.error = { error: frontResponse.error.errorCode, 
            errorDescription: identityHelper.identityErrorMessage(frontResponse.error.errorCode) }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "ClientRegistration", "ExpressJs", frontResponse.error.errorCode, frontResponse.error.errorMessage)
        return res.send(errorResponse.errorHandler(frontResponse.error.errorCode, 
            identityHelper.identityErrorMessage(frontResponse.error.errorCode)));
    }
}

/**
 * @description: controller for MyProfile
 * @param {*} req 
 * @param {*} res  
 */
const myProfile = async function (req, res) {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "MyProfile", "Express Js", "MyProfile api is started successfully")
    const user = await auth.getUserCode(req);
    const body = JSON.stringify({
        head:
        {
            namespace: "Oncf.ma/DataContracts/2019/04/Identity/Gateway/v1",
            version: "v1"
        },
        body:
        {
            login: user.email
        }
    })
    const option = optionHelper.createOption(`${webUrl.FRONT_URL}GetUserProfile`, null, body, null)
    const response = await actionHelper.frontEndActionHandler(option)
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "MyProfile", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: response.error.errorCode, 
            errorDescription: identityHelper.identityErrorMessage(response.error.errorCode) }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "MyProfile", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        //return res.send(response.errorData);
        return res.send(errorResponse.errorHandler(response.error.errorCode, 
            identityHelper.identityErrorMessage(response.error.errorCode)));
    }
}

/**
 * @description: controller for ForgotPassword
 * @param {*} req 
 * @param {*} res  
 */
const forgotPassword = async function (req, res) {
    // below process has  to make some changes in future
    // below ffpid means frontoffice forgot password callId for log function
    let ffpid = uuid()
    logStart.LogCallStart(ffpid, "FrontOffice ForgotPassword", "Express Js", "FrontOffice ForgotPassword api is started successfully")
    const email = req.swagger.params.email.value;
    if (!(validationHelper.validateEmail(email))) {
        //return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
        return res.send(errorResponse.errorHandler(errorResponse.Validation, identityHelper.identityErrorMessage(1)));
    }
    const body = JSON.stringify({
        head: {
            namespace: "",
            version: ""
        },
        body:
        {
            login: email
        }
    })
    const option = optionHelper.createOption(`${webUrl.FRONT_URL}InitiateForgottenPassword`, null, body, null);
    const response = await actionHelper.frontEndActionHandler(option)
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below ffpid means frontoffice forgot password callId for log function
        logEnd.LogCallEnd(ffpid, "FrontOffice ForgotPassword", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: response.error.errorCode , 
            errorDescription: identityHelper.identityErrorMessage(response.error.errorCode) }
        return res.send(customResponse);
    }
    else {
        //below process needs to change in future
        // below ffpid means frontoffice forgot password callId for log function
        logEnd.LogCallEnd(ffpid, "FrontOffice ForgotPassword", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(errorResponse.errorHandler(response.error.errorCode, 
            identityHelper.identityErrorMessage(response.error.errorCode)));
    }
}

/**
 * @description: controller for ActivateAccount
 * @param {*} req 
 * @param {*} res 
 */
const activateAccount = async (req, res) => {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "ActivateAccount", "Express Js", "ActivateAccount api is started successfully")
    let { email, code } = req.swagger.params['body'].value;
    if (!validationHelper.validateEmail(email)) {
        return res.send(errorResponse.errorHandler(errorResponse.Validation, identityHelper.identityErrorMessage(1)))
    }
    const body = JSON.stringify({
        head: {
            namespace: "Oncf.ma/DataContracts/2019/04/Payment/Gateway/v1",
            version: "v1"
        },
        body: {
            login: email,
            code: code
        }
    })
    const option = optionHelper.createOption(`${webUrl.FRONT_URL}ActivateAccount`, null, body, null);
    const response = await actionHelper.frontEndActionHandler(option)
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "ActivateAccount", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: response.error.errorCode, 
            errorDescription: identityHelper.identityErrorMessage(response.error.errorCode) }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "ActivateAccount", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(errorResponse.errorHandler(response.error.errorCode, 
            identityHelper.identityErrorMessage(response.error.errorCode)));
    }
}
const unlockAccount  = async (req, res) => {
    // below process has  to make some changes in future
    // below reqid is callId for log function
    let reqid = uuid()
    logStart.LogCallStart(reqid, "UnlockAccount ", "Express Js", "UnlockAccount  api is started successfully")
    let { email, code } = req.swagger.params['body'].value;
    if (!validationHelper.validateEmail(email)) {
        return res.send(errorResponse.errorHandler(errorResponse.Validation, identityHelper.identityErrorMessage(1)))
    }
    const body = JSON.stringify({
        head: {
        namespace: "Oncf.ma/DataContracts/2019/04/Payment/Gateway/v1",
        version: "v1"
        },
        body: {
            login: email,
            code: code
        }
    })
    const option = optionHelper.createOption(`${webUrl.FRONT_URL}UnlockAccount`, null, body, null);
    const response = await actionHelper.frontEndActionHandler(option)
    if (response.isSuccess) {
        // below logEnd needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "UnlockAccount ", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        customResponse.isSuccess = true;
        customResponse.data = response.data;
        customResponse.error = { error: response.error.errorCode, 
            errorDescription: identityHelper.identityErrorMessage(response.error.errorCode) }
        return res.send(customResponse);
    } else {
        //below process needs to change in future
        // below reqid is callId for log function
        logEnd.LogCallEnd(reqid, "UnlockAccount ", "ExpressJs", response.error.errorCode, response.error.errorMessage)
        return res.send(errorResponse.errorHandler(response.error.errorCode, 
            identityHelper.identityErrorMessage(response.error.errorCode)));
    }
}

/**
 * @description: below module.exports is for exporting all the controllers above
*/
module.exports = {
    accountChangePassword,
    confirmForgottenPassword,
    clientRegistration,
    myProfile,
    forgotPassword,
    activateAccount,
    unlockAccount
}