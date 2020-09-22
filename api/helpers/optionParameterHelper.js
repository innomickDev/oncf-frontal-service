const createOption = (url,extraHeaders,body,query) => {
    //default header parameter
    const headers = {
        'Content-Type': 'application/json',
        'namespace':"Oncf.ma/DataContracts/2020/02/Complaints/Gateway/v1",
        'version':"v1",
        "cache-control":"no-cache"
    }
    //if extra header required merge default header with extra header
    if(extraHeaders){
        Object.assign(headers,extraHeaders)
    }
    //create option wth provided url and method("GET","POST")
    const option = {
        url,
        method:"POST",
        headers
    }
    //if data need to send in body add body key to object
    if(body){
        option.body = body
    }
    //if data need to send in query add qs key to object
    if(query){
        option.qs = query
    }
    return option
}

module.exports =  {
    createOption
}