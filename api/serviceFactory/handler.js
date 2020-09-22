const station = require("./stationServiceFactory");
const category = require("./categoryServiceFactory");
const subCategory = require("./subCategoryServiceFactory");
const subSubCategory = require("./subSubCategoryServiceFactory");

const handle = async function () {
    let instances = [
        station,
        category,
        subCategory,
        subSubCategory
    ];
    await Promise.all(instances.map(async _instance => {
        await _instance.synchronize();
    }))
    return false;
}
//will be uncommented when cronTab spi is running
//handle()
module.exports = {
    handle
}