(function(params) {
  function useState(initVal) {
    useStateRunCount++;
    var index = useStateRunCount;
    var f = currentFun;
    var currentStatePairs = hookStateMap.get(f); //查出当前运行的函数的状态对

    if (currentStatePairs[index]) {
      return currentStatePairs[index];
    } else {
      var pair = [
        initVal,
        function(val) {
          currentStatePairs[index][0] = val;
          currentFun = f;
          useStateRunCount = -1;
          var ret = f();
          console.log(ret);
        }
      ];
      currentStatePairs[index] = pair;
      return pair;
    }
  }

  // 由函数查出其对应的状态对 [count,setCount] 们
  // 查出来的是类似这样的数组 [[a,setA], [b,setB], [c,setC]]
  var hookStateMap = new Map();

  var currentFun = null; //记录当前正在被以hook方式调用的函数
  var useStateCount = -1; //记录useState在f中的调用次数

  function hook(f) {
    var statePairs = [];
    hookStateMap.set(f, statePairs);
    currentFun = f;
    useStateRunCount = -1;
    var ret = f();
    console.log(ret);
  }

  window.hook = hook;
  window.useState = useState;
})();

function useWindowWidth() {
  var ary = useState(window.innerWidth);
  // useEffect(() => {
  window.addEventListener("resize", () => {
    ary[1](window.innerWidth);
  });
  // })

  return ary;
}

/**
 * 以react hook的方式运行f
 * 调用 setXxxx的时候会以新的状态重新运行f并打印出f的返回值
 * @params fun
 * @returns undefined
 **/
hook(function() {
  var [count, setCount] = useState(1);
  var [step, setStep] = useWindowWidth();

  console.log(count, step);

  window.setStep = setStep;
  window.setCount = setCount;

  return count + step;
});

hook(function() {
  var [foo, setFoo] = useState(1);
  var [bar, setBar] = useState(2);
  var [baz, setBaz] = useState(3);

  window.setFoo = setFoo;
  window.setBar = setBar;
  window.setBaz = setBaz;

  console.log(foo, bar, baz);
});

// hook(function() {
//   var [foo, setFoo] = useState(0)
//   var [bar, setBar] = useState(1)

//   return count - step
// })
