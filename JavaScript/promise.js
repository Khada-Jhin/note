var Async = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 5) {
        resolve("async1执行完成");
      } else {
        reject("数字太大");
      }
    }, 3000);
  });
  return p;
};
var Async2 = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 5) {
        resolve("async2执行完成");
      } else {
        reject("数字太大");
      }
    }, 3000);
  });
  return p;
};

var Async3 = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 5) {
        resolve("async3执行完成");
      } else {
        reject("数字太大");
      }
    }, 3000);
  });
  return p;
};

Async()
  .then(function(data) {
    console.log(data);
    return Async2();
  })
  .then(function(data) {
    console.log(data);
    return Async3();
  })
  .then(function(data) {
    console.log(data);
  });

// 以上是链式调用

var Async = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 5) {
        resolve("async1执行完成");
      } else {
        reject("数字太大");
      }
    }, 3000);
  });
  return p;
};

Async().then(
  function(data) {
    console.log("resolved");
    console.log(data);
  },
  function(rec, data) {
    console.log("rejected");
    console.log(rec);
  }
);

//以上是手写的一个promise

var Async = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 5) {
        resolve("async1执行完成");
      } else {
        reject("数字太大");
      }
    }, 3000);
  });
  return p;
};

Async()
  .then(function(data) {
    console.log("resolved");
    console.log(data);
    console.log(somedata); //这里somedata未定义
  })
  .catch(function(rec, data) {
    console.log("rejected");
    console.log(rec);
  });

//以上是.catch 的使用   js遇到报错会停止,而这样能让代码完整的执行完

var Async = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 11) {
        console.log("astnce1");
        resolve("async1执行完成");
      } else {
        reject("数字太大");
      }
    }, 3000);
  });
  return p;
};
var Async2 = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 11) {
        console.log("astnce2");
        resolve("async2执行完成");
      } else {
        reject("数字太大");
      }
    }, 3000);
  });
  return p;
};

var Async3 = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 11) {
        console.log("astnce3");
        resolve("async3执行完成");
      } else {
        reject("数字太大");
      }
    }, 3000);
  });
  return p;
};

Promise.all([Async(), Async2(), Async3()]).then(function(results) {
  console.log(results);
});

// 以上是promise.all

var Async = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 11) {
        console.log("astnce1");
        resolve("async1执行完成");
      } else {
        reject("数字太大");
      }
    }, 1000);
  });
  return p;
};
var Async2 = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 11) {
        console.log("astnce2");
        resolve("async2执行完成");
      } else {
        reject("数字太大");
      }
    }, 3000);
  });
  return p;
};

var Async3 = function() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(() => {
      var num = Math.random() * 10;
      if (num < 11) {
        console.log("astnce3");
        resolve("async3执行完成");
      } else {
        reject("数字太大");
      }
    }, 3000);
  });
  return p;
};

Promise.race([Async(), Async2(), Async3()]).then(function(results) {
  console.log(results);
});

// 以上是 promise.race  和 all 的区别只在async1里面的延迟时间我修改成了1秒

// all方法的效果实际上是「谁跑的慢，以谁为准执行回调」，那么相对的就有另一个方法「谁跑的快，以谁为准执行回调」，这就是race方法

var pro = function() {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      var n = Math.random() * 10;
      if (n < 5) {
        console.log("成功");
        resolve("成功执行");
      } else {
        console.log("失败");
        reject("执行失败");
      }
    },1000);
  });
};
pro().then(function (data) {
  console.log(data);
  
}).catch(function (res) {
  console.log(res);
  
})
