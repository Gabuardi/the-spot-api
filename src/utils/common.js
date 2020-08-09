function createDecodedData (encodedData, objectGenerator){
    let decodedData = [];
    encodedData.forEach(el => {
        let data = objectGenerator(el);
        decodedData.push(data);
    });
    return decodedData;
};

function ifParamArray (toCheck){

};

function filteredData (data, queryParams) {
    return data.filter((movie) => {
        return Object.keys(queryParams).every((key) => {
            if(typeof (movie[key]) == 'object') {
                movie[key].forEach(v => {
                    return v == queryParams[key];
                })
            }else {
                return movie[key] == queryParams[key];
            }
        })
    })
};

function ifDuplicate (array) {
    let tempArray = [];
    array.forEach(el => {
        if(!tempArray.includes(el))tempArray.push(el);
    });
    return tempArray;
};

function filterArrayValues (data, type) {
    let values = [];
    data.forEach(el => {
       Object.keys(el).forEach(k => {
           if (k == type) {
               el[k].forEach(p => {
                   values.push(p);
               });
            };
       });
    });
    return(ifDuplicate(values));
};

function generateFilterOptions (data, type){
    let values = [];
    data.forEach(el => {
        Object.keys(el).forEach(k => {
            if(k == type)values.push(el[k]);
        });
    });
    return ifDuplicate(values);
};

export {createDecodedData, filteredData, filterArrayValues, generateFilterOptions}