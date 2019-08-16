let framework = require('./tcp-http-server.js');

function convert_datetime(request) {
    if (request.Data.format === undefined) {
        return framework.JSONResponse(204);
    }
    var format = request.Data.format;
    var current_datetime = Date.now();
    return framework.JSONResponse(200, { "datetime": current_datetime });
}

function Main() {
    let app = framework.NewHTTPFramework();
    app.Init();
    app.SetRouter("POST", "/api/datetime", convert_datetime);
    app.Run();
}

Main();