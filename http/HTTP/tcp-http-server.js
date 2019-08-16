let net = require('net');

exports.JSONResponse = function (status_code, obj) {
  try {
    obj = JSON.stringify(obj);
  } catch (error) {
    return "HTTP/1.1 500\r\nContent-Type: application/json\r\n\r\n" + error;
  }
  return "HTTP/1.1 " + status_code + "\r\nContent-Type: application/json\r\n\r\n" + obj;
}

exports.NewHTTPFramework = function () {
  let server = net.createServer()
  return {
    Router: {},
    SetRouter: function (method, path, handler) {
      path = Buffer.from(path, "base64").toString();
      this.Router[method + "_" + path] = handler; // set router
    },
    Init: function () {
      server.on('connection', conn => {
        conn.on('data', d => {
          d = d.toString().split("\r\n\r\n"); // seprate request headers and body
          let headers = d[0].split("\r\n"); // seprate request headers
          let body = d[1]; // body data (string)
          let method_uri = headers[0].split(" "); // temprary variable
          let method = method_uri[0];
          let uri = Buffer.from(method_uri[1], "base64").toString();
          let unique_uri = method + "_" + uri;

          /* 404 check */

          if (this.Router[unique_uri] === undefined) {
            conn.write(exports.JSONResponse(404, "404 Not Found."));
            return;
          }

          /* request body process */

          if (body.length === 0) {// if no request content then return empty Data to handler
            return null;
          }
          let data = {};
          try {
            data = JSON.parse(body); // parse body to json object
          } catch (error) {
            // 400 bad request, because of incorrect json format
            conn.write(exports.JSONResponse(400, error));
            conn.end();
            return;
          }

          /* get handler function */

          conn.write(
            this.Router[unique_uri](
              {
                Method: method,
                URI: method_uri[1],
                Headers: headers,
                Data: data,
              }
            )
          ); // retrieve reoute handler, given necessary request data

          conn.end(); // close connection while handler return
        });
      });
    },
    Run: function (address, port) {
      if (address === undefined || port === undefined) {
        address = "0.0.0.0";
        port = 8000;
      }
      server.listen(port, address, () => {
        console.log('listening on - ', address, ":", port);
      })
    }
  }
}