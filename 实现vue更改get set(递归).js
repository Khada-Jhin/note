//没考虑有环对象
function observer(obj) {
  function isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
  }

  var copy = {};

  for (let key in obj) {
    if (isObject(obj[key])) {
      copy[key] = observer(obj[key]);
    } else {
      copy[key] = obj[key];
    }

    Object.defineProperty(obj, key, {
      get: function() {
        return copy[key];
      },
      set: function(val) {
        console.log("you are setting me!");
        if (isObject(val)) {
          val = observer(val);
        }
        copy[key] = val;
      }
    });
  }
  return obj;
}
