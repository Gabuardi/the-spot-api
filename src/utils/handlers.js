function sqlResponseHandler(err, result, response, successCallback) {
  if (err) {
    response.status(400).json({name: err.name, code: err.code, info: err.originalError.info});
  } else {
    successCallback(response, result);
  }
}

export {sqlResponseHandler}
