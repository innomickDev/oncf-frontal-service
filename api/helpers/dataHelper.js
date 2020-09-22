const webUrl = require('../../config/global')
const actionHelper = require('./actionHelper')
const optionHelper = require("./optionParameterHelper")
const _ = require('lodash')

const getCategoryByCode = async function (catCode) {
    const body = JSON.stringify({
        getCategoryClientsRequest: {
            header: {
                namespace: "",
                version: ""
            },
            body: {}
        },
    })
    const options = optionHelper.createOption(`${webUrl.BASE_URL}GetListCategory`, null, body, null)
    const response = await actionHelper.actionHandler(options, 'categoryClientResponse')
    const categoryObject = _.find(response.data.categoryClients, { code: String(catCode) })
    return categoryObject
}

const getDepartureStationByCode = async function (depCode) {
    const body = JSON.stringify({
        gareRequest: {
            head: {
                namespace: "Oncf.ma/DataContracts/2020/02/Ecommerce/Gateway/v1",
                version: "1.0"
            },
            body: {}
        }
    })
    const option = optionHelper.createOption(`${webUrl.ECOMMERCE_URL}GetListGare`, null, body, null)
    const response = await actionHelper.stationActionHandler(option, 'gareResponse')
    const stationObject = _.find(response.data.listGare, { codeGare: String(depCode) })
    return stationObject
}

const getArrivalStationByCode = async function (arrCode) {
    const body = JSON.stringify({
        gareRequest: {
            head: {
                namespace: "Oncf.ma/DataContracts/2020/02/Ecommerce/Gateway/v1",
                version: "1.0"
            },
            body: {}
        }
    })
    const option = optionHelper.createOption(`${webUrl.ECOMMERCE_URL}GetListGare`, null, body, null)
    const response = await actionHelper.stationActionHandler(option, 'gareResponse')
    const stationObject = _.find(response.data.listGare, { codeGare: String(arrCode) })
    return stationObject
}

const getSubCategoryByCode = async function (subCode) {
    const body = JSON.stringify({
        getSubCategoryClientsRequest: {
            header: {
                namespace: "",
                version: ""
            },
            body: {}
        }
    })
    const option = optionHelper.createOption(`${webUrl.BASE_URL}GetListSubCategory`, null, body, null)
    const response = await actionHelper.actionHandler(option, 'subCategoryClientResponse')
    const subCategoryObject = _.find(response.data.subCategoryClients, { code: String(subCode) })
    return subCategoryObject
}

const getSubSubCategoryByCode = async function (subSubCode) {
    const body = JSON.stringify({
        getSubSubCategoryClientsRequest: {
            header: {
                namespace: "",
                version: ""
            },
            body: {}
        }
    })
    const option = optionHelper.createOption(`${webUrl.BASE_URL}GetListSubSubCategory`, null, body, null)
    const response = await actionHelper.actionHandler(option, 'subSubCategoryClientResponse')
    const subSubCategoryObject = _.find(response.data.subSubCategoryClients, { code: String(subSubCode) })
    return subSubCategoryObject
}
const identityErrorMessage = function(errorCode){
    switch(errorCode){
        case 0 : 
            return "à Opération réussie";
        case 1 : 
            return "Validation échouée, Veuillez vérifier les informations saisies";
        case 2 : 
            return "à Une erreur est survenue, veuillez réessayer ultérieurement";
        case 8 : 
            return "à Votre compte est verrouillé, Veuillez l’activer"
        case 9 : 
            return "à Votre compte est bloqué, Veuillez l’activer"
        case 10 : 
            return "à Compte utilisateur introuvable"
        case 11 : 
            return "à Authentification échouée"
        case  999 :
            return "Une erreur est survenue, veuillez réessayer ultérieurement"
        case 9999: 
            return "Une erreur est survenue, veuillez réessayer ultérieurement."
    }
}

module.exports = {
    getCategoryByCode,
    getDepartureStationByCode,
    getArrivalStationByCode,
    getSubCategoryByCode,
    getSubSubCategoryByCode,
    identityErrorMessage

}