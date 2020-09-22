"use strict";
const jwt = require("jsonwebtoken");
var sharedSecret = "shh";
var issuer = "oncf.ma";
const jwtExpiry = '1d';
const errorResponse = require("../../config/errorResponse").customError
//Here we setup the security checks for the endpoints
//that need it (in our case, only /protected). This
//function will be called every time a request to a protected
//endpoint is received
const verifyToken = function (req, authOrSecDef, token, callback) {
  //these are the scopes/roles defined for the current endpoint
  var currentScopes = req.swagger.operation["x-security-scopes"];
  function sendError() {
    req.res.status(401)
    return req.res.send(errorResponse.errorHandler(errorResponse.resourceNotFound, "NOT_AUTHORIZED"));
  }
  //validate the 'Authorization' header. it should have the following format:
  //'Bearer tokenString'
  if (token && token.indexOf("Bearer ") == 0) {
    var tokenString = token.split(" ")[1];
    jwt.verify(tokenString, sharedSecret, (verificationError, decodedToken) => {
      //check if the JWT was verified correctly
      // console.log(verificationError == null ,Array.isArray(currentScopes),decodedToken,decodedToken.sub.role)
      if (
        verificationError == null &&
        Array.isArray(currentScopes) &&
        decodedToken &&
        decodedToken.sub.role
      ) {
        // check if the role is valid for this endpoint
        const userRole = JSON.parse(decodedToken.sub.role)
        // console.log(userRole,currentScopes)
        const roleMatch = userRole.filter(value => -1 !== currentScopes.indexOf(value))
        // var roleMatch = currentScopes.indexOf(decodedToken.sub.role) !== -1;
        // check if the issuer matches
        var issuerMatch = decodedToken.iss == issuer;
        // you can add more verification checks for the
        // token here if necessary, such as checking if
        // the username belongs to an active user 
        if (roleMatch.length > 0 && issuerMatch) {
          //add the token to the request so that we
          //can access it in the endpoint code if necessary
          req.auth = decodedToken;
          //if there is no error, just return null in the callback
          return callback(null);
        } else {
          //return the error in the callback if there is one 
          return callback(sendError());
        }
      } else {
        //return the error in the callback if the JWT was not verified
        return callback(sendError());
      }
    });
  } else {
    //return the error in the callback if the Authorization header doesn't have the correct format
    return callback(sendError());
  }
};

const issueToken = function (username, role) {
  var token = jwt.sign(
    {
      sub: username,
      iss: issuer,
      role: role,
    },
    sharedSecret,
    {
      expiresIn: jwtExpiry
    },
  );
  return token;
};
const issueRefreshToken = (userId, role, issuer) => {
  if (issuer) {

  }
  let token = jwt.sign(
    {
      sub: userId,
      iss: issuer,
      role: role,
    },
    sharedSecret,
  );
  return token;
};

const getUserCode = async (req) => {
  if (req.headers.authorization && req.headers.authorization.indexOf("Bearer ") == 0) {
    var tokenString = req.headers.authorization.split(" ")[1];
    return new Promise((resolve, reject) => {
      jwt.verify(tokenString, sharedSecret, (verificationError, decodedToken) => {
        //check if the JWT was verified correctly
        if (verificationError == null && decodedToken) {
          resolve(decodedToken.sub);
        } else {
          reject(null);
        }
      });
    });
  }
}
module.exports = {
  verifyToken,
  issueToken,
  issueRefreshToken,
  getUserCode,
}