const lowerTrim = (data) => {
    for (let keys in data){
        data[keys] =  data[keys].trim().toLowerCase()
    }
    return data
}

module.exports = {
    lowerTrim
}