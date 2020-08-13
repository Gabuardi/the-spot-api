const fs = require('fs');

// GIVEN A ENCODED DATA WILL GENERATE AN ARRAY PARSING THE ORIGINAL VALUE WITH THE GIVEN OBJECT
function createDecodedData(encodedData, objectGenerator) {
  let decodedData = [];
  encodedData.forEach(el => {
    let data = objectGenerator(el);
    decodedData.push(data);
  });
  return decodedData;
}

// GIVEN A PATHNAME WILL SEARCH THE FILE TO RETURN IT AS HTML TYPE
function readTemplate(file, type) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, type, (err, data) => {
      if (err) reject('File Not Found!');
      resolve(data);
    });
  });
}

function filteredData (data, queryParams) {
  return data.filter((movie) => {
    return Object.keys(queryParams).every((paramKey) => {
      if(typeof (movie[paramKey]) == 'object') {
        return movie[paramKey].some(movieKey => {
          if(typeof queryParams[paramKey] == 'object'){
            return (queryParams[paramKey].includes(movieKey));
          }else {
            return movieKey == queryParams[paramKey];
          }
        });
      }else {
        return movie[paramKey] == queryParams[paramKey];
      }
    })
  })
}

function ifDuplicate (array) {
  let tempArray = [];
  array.forEach(el => {
    if(!tempArray.includes(el))tempArray.push(el);
  });
  return tempArray;
}

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
}

function generateFilterOptions (data, type){
  let values = [];
  data.forEach(el => {
    Object.keys(el).forEach(k => {
      if(k == type)values.push(el[k]);
    });
  });
  return ifDuplicate(values);
}

module.exports = {createDecodedData, readTemplate, filteredData, filterArrayValues, generateFilterOptions};
