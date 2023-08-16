class Response {
  sendResponse = (res, message = null, data = null, status = 200) => {
    return res.status(status).json({ status, message, data });
  };
}

module.exports = Response;