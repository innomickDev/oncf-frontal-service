const fs = require("fs");
const path = require('path')
//const CACHE_PATH = "../../factory/cache/";

getDataFilePath = function (instanceName) {
    if (instanceName) {
        //const versionPath = CACHE_PATH + instanceName + "/versions.json"
        const versionPath = path.join(__dirname, '../', '../', 'factory/', 'cache/', instanceName, '/versions.json')
        const versionContent = JSON.parse(fs.readFileSync(versionPath, "utf-8"));
        //return CACHE_PATH + instanceName + "/src/" + versionContent.currentVersionName;
        return path.join(__dirname, '../', '../', 'factory/', 'cache/', instanceName, '/src/', versionContent.currentVersionName);
    }
}
setCache = function (instanceName, data) {
    if (instanceName && data) {
        const fileName = instanceName + "-" + new Date().getTime() + ".json";
        filePath = path.join(__dirname, '../', '../', 'factory/', 'cache/', instanceName, '/src/', fileName);
        //const filePath = CACHE_PATH + instanceName + "/src/";
        fs.writeFileSync(filePath , JSON.stringify(data));
        return setVersion(fileName, instanceName);
    }
}
setVersion = function (fileName, instanceName) {
    if (fileName && instanceName) {
        //const versionPath = CACHE_PATH + instanceName + "/versions.json"
        const versionPath = path.join(__dirname, '../', '../', 'factory/', 'cache/', instanceName, '/versions.json')
        const versionContent = JSON.parse(fs.readFileSync(versionPath, "utf-8"));
        versionContent.currentVersionName = fileName;
        if (versionContent.versionHistory.length < 1) {
            versionContent.versionHistory = [{
                name: fileName,
                syncDateTime: new Date(),
                order: 1
            }]
        } else {
            versionContent.versionHistory.push({
                name: fileName,
                syncDateTime: new Date(),
                order: versionContent.versionHistory[versionContent.versionHistory.length - 1].order + 1
            })
        }
        fs.writeFileSync(versionPath, JSON.stringify(versionContent));
        removeCache(instanceName, 5);
        //return true;
    } else {
        return false;
    }
}

removeCache = function (instanceName, count) {
    //const versionPath = CACHE_PATH + instanceName + "/versions.json"
    const versionPath = path.join(__dirname, '../', '../', 'factory/', 'cache/', instanceName, '/versions.json')
    const versionContent = JSON.parse(fs.readFileSync(versionPath, "utf-8"));
    if (versionContent.versionHistory.length > count) {
        versionContent.versionHistory.slice(0, 1).map(hist => {
            // fs.unlinkSync(CACHE_PATH + instanceName + "/src/" + hist.name);
            fs.unlinkSync(path.join(__dirname, '../', '../', 'factory/', 'cache/', instanceName, '/src/', hist.name))
        });
        versionContent.versionHistory.splice(0, 1);
        fs.writeFileSync(versionPath, JSON.stringify(versionContent));
        return true;
    }
}

module.exports = {
    setVersion,
    getDataFilePath,
    setCache,
    removeCache
}