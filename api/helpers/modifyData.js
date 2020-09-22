const modifyData = (dataList,keyName) => {
    for(let data of dataList[keyName]){
        const dataKeys = Object.keys(data)
        for(key of dataKeys){   
            if(key.includes("LabelEn")){
                let keyName = key.split("LabelEn")[0];
                const newData = new Object();
                if(key.includes("LabelEn")){
                    newData["labelEn"] = data[key]
                }
                data[keyName] = newData;
                delete data[key]
            }
            if(key.includes("LabelFr")){
                let keyName = key.split("LabelFr")[0];
                let newData = new Object();
                if(key.includes("LabelFr")){
                    newData = data[key]
                }
                data[keyName]["labelFr"] = newData;
                delete data[key] 
            }
            if(key.includes("LabelAr")){
                let keyName = key.split("LabelAr")[0];
                let newData = new Object();
                if(key.includes("LabelAr")){
                    newData = data[key]
                }
                data[keyName]["labelAr"] = newData;
                delete data[key]
            }
        }
    }
    return dataList
}


const modifyDataByObject = data => {
    const dataKeys = Object.keys(data)
    for(key of dataKeys){   
        if(key.includes("LabelEn")){
            let keyName = key.split("LabelEn")[0];
            const newData = new Object();
            if(key.includes("LabelEn")){
                newData["labelEn"] = data[key]
            }
            data[keyName] = newData;
            delete data[key]
        }
        if(key.includes("LabelFr")){
            let keyName = key.split("LabelFr")[0];
            let newData = new Object();
            if(key.includes("LabelFr")){
                newData = data[key]
            }
            data[keyName]["labelFr"] = newData;
            delete data[key]
        }
        if(key.includes("LabelAr")){
            let keyName = key.split("LabelAr")[0];
            let newData = new Object();
            if(key.includes("LabelAr")){
                newData = data[key]
            }
            data[keyName]["labelAr"] = newData;
            delete data[key]
        }
    }
    return data;
}
module.exports ={
    modifyData,
    modifyDataByObject
}