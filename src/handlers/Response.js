// class Response{
//  sendResponse = (res, obj) => {
//     if (!obj.status) {
//       obj.status = 200;
//     }
//     if (!obj.data && !obj.message) {
//       return res
//         .status(405)
//         .json({ status: 405, message: "Data/Message is required" });
//     }
//     return res.status(obj.status).json(obj);
//   };
// }
//   module.exports = Response;
  

class Response {
    sendResponse = (res, message = null, data = null, status = 200) => {
      return res.status(status).json({ status, message, data });
    };
  }
  
  module.exports = Response;