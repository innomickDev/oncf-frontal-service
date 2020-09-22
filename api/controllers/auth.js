'use strict';
const auth = require("../helpers/auth")
const webUrl = require("../../config/global")
const optionHelper = require("../helpers/optionParameterHelper")
const actionHelper = require("../helpers/actionHelper")
const customResponse = require("../../config/globalResponse").customResponse
const errorResponse = require("../../config/errorResponse").customError
const logStart = require('../helpers/logger')
const logEnd = require('../helpers/logger')
const { uuid } = require('uuidv4')
const validationHelper = require('../helpers/validationHelper')
const identityHelper = require('../helpers/dataHelper')
/**
 * @description: controller for FrontOffice Login
 * @param {*} req 
 * @param {*} res 
 */
const login = async function (req, res) {

  // below process has  to make some changes in future
  // below fid is frontoffice login callId
  let fid = uuid()
  logStart.LogCallStart(fid, "FrontOffice Login", "Express Js", "FrontOffice Login api is started successfully")
  const { email, password } = req.swagger.params['body'].value
  //below body is from servers of oncf where customer will login
  const frontBody = JSON.stringify({
    head: {
      namespace: "Oncf.ma/DataContracts/2019/04/Identity/Gateway/v1",
      version: "v1"
    },
    body: {
      login: email,
      pwd: password,
      includeProfile: false,
      unlockUrl: "http://oncf-identity-gateway.azurewebsites.net/"
    }
  })
  const frontOption = optionHelper.createOption(`${webUrl.FRONT_URL}Authenticate`, null, frontBody, null)
  const frontResponse = await actionHelper.frontEndActionLogin(frontOption)
  console.log(frontResponse)
  if (frontResponse.isSuccess) {
    // below logEnd needs to change in future
    logEnd.LogCallEnd(fid, "FrontOfficeLogin", "ExpressJs", frontResponse.error.errorCode, frontResponse.error.errorMessage)
    // below body is for sending email of customer to their server of oncf
    const body = JSON.stringify({
      head: {
        namespace: "Oncf.ma/DataContracts/2019/04/Identity/Gateway/v1",
        version: "v1"
      },
      body: {
        login: email
      }
    })
    const option = optionHelper.createOption(`${webUrl.FRONT_URL}GetUserProfile`, null, body, null)
    const userResponse = await actionHelper.frontEndActionHandler(option)
    if(userResponse && !userResponse.isSuccess){
      logEnd.LogCallEnd(fid, "FrontOfficeLogin", "ExpressJs", frontResponse.error.errorCode, frontResponse.error.errorMessage)
      return res.send(errorResponse.errorHandler(frontResponse.error.errorCode, 
        identityHelper.identityErrorMessage(frontResponse.error.errorCode)));
    }
    let permissionArray = []
    permissionArray.push('customer')
    const token = auth.issueToken({ codeClient: userResponse.data.codeClient, token: frontResponse.data.token, role: JSON.stringify((permissionArray)), email: email });
    if (userResponse.isSuccess && userResponse.data) {
      const cusBody = JSON.stringify({
        customerClientLoginRequest: {
          header: {
            namespace: "",
            version: ""
          },
          body: {
            code: userResponse.data.codeClient,
            email: email,
            tokenExpiration: new Date().setDate(new Date().getDate() + 1)
          }
        }
      })
      const option = optionHelper.createOption(`${webUrl.BASE_URL}RecordCustomerLogin `, null, cusBody, null)
      const response = await actionHelper.actionHandler(option, 'customerClientResponse')
    }
    frontResponse.data.token = token;
    customResponse.isSuccess = true;
    customResponse.data = frontResponse.data;
    customResponse.error = { error: userResponse.error.errorCode, 
      errorDescription: identityHelper.identityErrorMessage(userResponse.error.errorCode) }
    return res.send(customResponse);
  }
  else {//below process needs to change in future
    logEnd.LogCallEnd(fid, "FrontOfficeLogin", "ExpressJs", frontResponse.error.errorCode, frontResponse.error.errorMessage)
    return res.send(errorResponse.errorHandler(frontResponse.error.errorMessage, 
      identityHelper.identityErrorMessage(frontResponse.error.errorCode)));
  }
}

/**
 * @description: controller for Front Office Logout
 * @param {*} req 
 * @param {*} res  
 */
const logout = async function (req, res) {
  // below process has  to make some changes in future
  // below reqid is callId for log function
  let reqid = uuid()
  logStart.LogCallStart(reqid, "Front Office Logout", "Express Js", "Front Office Logout api is started successfully")
  const { code, email } = req.swagger.params['body'].value;
  if (!(validationHelper.validateEmail(email))) {
    return res.send(errorResponse.errorHandler(errorResponse.badRequest, "INVALID_REQUEST_PARAMETER"))
  }
  const user = await auth.getUserCode(req);
  const body = JSON.stringify({
    customerClientLogoutRequest: {
      header: {
        namespace: "",
        version: ""
      },
      body: {
        code: code,
        email: email
      }
    },
    token: user.token,
    rootCallId: reqid
  })
  const extraHeader = {
    "Accept-Language": req.swagger.params['Accept-Language'].raw
  }
  const options = optionHelper.createOption(`${webUrl.BASE_URL}RecordCustomerLogout `, extraHeader, body, null)
  const response = await actionHelper.actionHandler(options, 'customerClientResponse')
  if (response.isSuccess) {
    // below logEnd needs to change in future
    // below reqid is callId for log function
    logEnd.LogCallEnd(reqid, "Front Office Logout", "ExpressJs", response.error.errorCode, response.error.errorMessage)
    customResponse.isSuccess = true;
    customResponse.data = response.data;
    customResponse.error = { error: "", errorDescription: "" }
    return res.send(customResponse);
  } else {
    //below process needs to change in future
    // below reqid is callId for log function
    logEnd.LogCallEnd(reqid, "Front Office Logout", "ExpressJs", response.error.errorCode, response.error.errorMessage)
    return res.send(response.errorData);
  }
}

/**
 * @description: below module.exports is for exporting all the controllers above
*/
module.exports = {
  login,
  logout
}