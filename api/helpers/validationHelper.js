const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const regBase64 = /^[a-zA-Z0-9\+/]*={0,3}$/i;
const base64Type = {
    maxSize: 10485760,
    bmpType: "/9J/4",
    jpgType: "/9J/4",
    pngType: "IVBOR",
    pdfType: "JVBER",
    gifType: "ROIGO"
}

const validateEmail = function (email) {
    return regEmail.test(String(email).toLowerCase());
}

const validateInt = function (catCode, subCode, subSubCode) {
    if (catCode > 0 && subCode > 0) {
        return true;
    } else {
        return false
    }
}

const validateAttachment = function (base64Value) {
    var fileSize = String(base64Value).length
    var fileType = String(base64Value).substring(0, 5).toUpperCase();
    if ((fileSize) % 4 == 0 && String(base64Value).match(regBase64) && (fileSize < base64Type.maxSize)) {
        if ((base64Type.bmpType == fileType) || (base64Type.jpgType == fileType) || (base64Type.pdfType == fileType)
            || (base64Type.gifType == fileType) || (base64Type.pngType == fileType)) {
            return true
        }
        else {
            return false
        }
    }
    return false
}

const codeValidate = function (id) {
    if (parseInt(id) > 0) {
        return true
    }
    else {
        return false
    }
}

module.exports = {
    validateEmail,
    validateInt,
    validateAttachment,
    codeValidate
}