const request = require("request");
const fs = require("fs");
const GLOBAL_CONST = require("../../config/global")
const env = require("dotenv")
env.config({ path: '../.././.env' });
const errorResponse = require("../../config/errorResponse").customError
//const AGENT_OPTIONS = {
    //cert: fs.readFileSync(process.env.SERVICE_PATH_CERTIFICATE_BUNDLE),
    //key: fs.readFileSync(process.env.SERVICE_PATH_CERTIFICATE_KEY),
   // passphrase: process.env.SERVICE_PATH_CERTIFICATE_PASSPHRASE,
   //// ca: fs.readFileSync(process.env.SERVICE_PATH_CERTIFICATE_CA)
// }
//this below actionhandler is used for backoffice (BO)
const actionHandler = (options, responseName) => {
    if (GLOBAL_CONST.IS_PRODUCTION) {
        console.log(AGENT_OPTIONS);
        options.agentOptions = AGENT_OPTIONS;
    }

    return new Promise((resolve, reject) => {
        request(options, (err, response, body) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            if (body) {
                try {
                    body = JSON.parse(body)
                    const error = body[responseName].header
                    if (error.errorCode === 0) {
                        resolve({
                            isSuccess: true,
                            data: body[responseName].body,
                            error
                        });
                    } else {
                        resolve({
                            isSuccess: false,
                            errorData: errorResponse.errorHandler(error.errorCode, error.errorMessage),
                            error
                        })
                    }
                } catch (e) {
                    resolve({
                        isSuccess: false,
                        errorData: errorResponse.errorHandler(errorResponse.resourceNotFound, body),
                        error: { errorCode: errorResponse.resourceNotFound, errorMessage: body }
                    })
                }
            }
        });
    });
};

//this below frontEndActionHandler is for frontoffice (FO)
const frontEndActionHandler = options => {
    if (GLOBAL_CONST.IS_PRODUCTION) {
        options.agentOptions = AGENT_OPTIONS;
    }
    return new Promise((resolve, reject) => {
        request(options, (err, response, body) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            try {
                const responseBody = JSON.parse(body);
                const error = responseBody.head
                if ((error.errorCode) === 0) {
                    if (responseBody.body) {
                        resolve({
                            isSuccess: true,
                            data: responseBody.body,
                            error
                        })
                    } else {
                        resolve({
                            isSuccess: true,
                            data: null,
                            error
                        })
                    }
                } else {
                    resolve({
                        isSuccess: false,
                        errorData: errorResponse.errorHandler(responseBody.head.errorCode, responseBody.head.errorMessage),
                        error
                    })
                }
            } catch (e) {
                resolve({
                    isSuccess: false,
                    errorData: errorResponse.errorHandler(errorResponse.resourceNotFound, body),
                    error: { errorCode: errorResponse.resourceNotFound, errorMessage: body }
                })
            }

        });
    })
}
// front office login fucntion created on client Demand to check 3 parameters
const frontEndActionLogin = options => {
    if (GLOBAL_CONST.IS_PRODUCTION) {
        options.agentOptions = AGENT_OPTIONS;
    }
    return new Promise((resolve, reject) => {
        request(options, (err, response, body) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            try {
                const responseBody = JSON.parse(body);
                const error = responseBody.head
                if (error.errorCode == 0 && responseBody.body.authSuccess && responseBody.body.token) {
                    if (responseBody.body) {
                        resolve({
                            isSuccess: true,
                            data: responseBody.body,
                            error
                        })
                    } else {
                        resolve({
                            isSuccess: false,
                            data: null,
                            error
                        })
                    }
                } else {
                    resolve({
                        isSuccess: false,
                        errorData: errorResponse.errorHandler(responseBody.head.errorCode, responseBody.head.errorMessage),
                        error
                    })
                }
            } catch (e) {
                resolve({
                    isSuccess: false,
                    errorData: errorResponse.errorHandler(errorResponse.resourceNotFound, body),
                    error: { errorCode: errorResponse.resourceNotFound, errorMessage: body }
                })
            }

        });
    })
}

const stationActionHandler = (options, responseName) => {
    if (GLOBAL_CONST.IS_PRODUCTION) {
        options.agentOptions = AGENT_OPTIONS;
    }
    return new Promise((resolve, reject) => {
        request(options, (err, response, body) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            if (body) {
                try {
                    body = JSON.parse(body)
                    const error = body[responseName].head
                    if (error.errorCode == 0) {
                        resolve({
                            isSuccess: true,
                            data: body[responseName].body,
                            error
                        });
                    } else {
                        resolve({
                            isSuccess: false,
                            errorData: errorResponse.errorHandler(error.errorCode, error.errorMessage),
                            error
                        })
                    }
                } catch (e) {
                    resolve({
                        isSuccess: false,
                        errorData: errorResponse.errorHandler(errorResponse.resourceNotFound, body),
                        error: { errorCode: errorResponse.resourceNotFound, errorMessage: body }
                    })
                }
            }
        });
    });
};

module.exports = {
    actionHandler,
    frontEndActionHandler,
    frontEndActionLogin,
    stationActionHandler
};