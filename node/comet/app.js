let repl = require("repl");
let express = require("express");
let app = express();
let responses = [];
app.use(express.static(__dirname));

app.get('/send-msg', async (req, res, next) => {
  console.log(req.query);
  res.end()
  responses.forEach(res => {
    res.end(req.query.msg)
  })
  responses = []
})

app.get("/comet", async (req, res, next) => {
  responses.push(res);
  setTimeout(() => {
    if (responses.includes(res)) {
      res.end();
      let idx = responses.indexOf(res);
      responses.splice(idx, 1);
    }
  }, 25e3);
});

app.listen(9091, () => {
  console.log(9091);
  repl.start({
    prompt: ">",
    eval: function(line, a, b, callback) {
      responses.forEach(res => {
        res.end(line);
      });
      callback(null, "msg has sended to " + responses.length + " all client.");
      responses = [];
    }
  });
});
