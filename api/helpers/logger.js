const url = require('../../config/global')
const optionHelper = require("../helpers/optionParameterHelper")
const actionHelper = require("../helpers/actionHelper")

//we have to call this below function in each and every controller so we can get required result by used parameters
const LogCallStart = async function(id, methodName, assembly, message){
 const body = JSON.stringify({
     callId:id,
     methodName: methodName,
     assembly:assembly,
     message: message,
     rootCallId: id,
     loggerName: null
 })
 const option = optionHelper.createOption(`${url.LOGGING_URL}LogCallStart`,null,body,null)
 const response =  actionHelper.frontEndActionHandler(option)
//  console.log(body)
}

//we have to call this below function in each and every controller so we can get required result by used parameters
const LogCallEnd = async function(id,methodName, assembly, errorCode,errorMessage){ 
const body = JSON.stringify({
    callId: id,
    methodName:methodName,
    assembly:assembly,
    errorCode: errorCode,
    errorMessage:errorMessage,
    startTime: new Date().getTime(),
    numberInfo:errorCode,
    ex: errorMessage,
    rootCallId: id,
    loggerName: null
})
// console.log(body)
const option = optionHelper.createOption(`${url.LOGGING_URL}LogCallEnd`,null,body,null)
const response =  actionHelper.frontEndActionHandler(option)
 
}


module.exports = {
    LogCallStart,
    LogCallEnd,
}