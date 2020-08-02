function createDecodedData (encodedData, objectGenerator){
    let decodedData = [];
    encodedData.forEach(el => {
        let data = objectGenerator(el);
        decodedData.push(data);
    });
    return decodedData;
};

export {createDecodedData}