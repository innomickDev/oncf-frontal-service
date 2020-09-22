const customResponse = require("./globalResponse").customResponse

/**
 * Genearate Custom Error When Something went wrong
 */
exports.customError = {
    success: 0,
    badRequest:400,
    notAuthorized:401,
    forbidden:403,
    resourceNotFound :404,
    authenticationError: 401,
    internalServerError:500,
    serviceUnavailable:503,    
    Validation : 1,
    TechnicalProblem : 2,
    CompteVerouille : 8,
    LockAccount : 9,
    UserNotFound : 10,
    FailedAuthentication : 11,
    OtherError : 999,
    Securite  : 9999,
    errorHandler: (type, message) => {
        customResponse.data = {};
        customResponse.error = {
        error:type,
        errorDescription: message
        }
        customResponse.isSuccess=false;
        return customResponse;
    }
}