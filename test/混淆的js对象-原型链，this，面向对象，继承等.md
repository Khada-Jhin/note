# JS 对象细则

## by xieranmaya

### this

* 以 object.method() 的形式调用一个对象的属性所指向的函数时（此时一般称为该对象的方法），函数内部的 this 指向这个方法所属的对象
```js
var o = {
  a: 1,
  method: function() {
    console.log(this.a)
  }
}
o.method() // => 1

```

* 通过一个其它的变量来指向这个函数并通过这个变量来调用这个函数时，函数内部的 this 并不指其原来所属的对象
```js
// 接上段程序
var fn = o.method
fn() // => 至少不会打出1，打出window.a
相当于window.fn()
//理解：此时fn为全局变量，而全局变量相当于全局对象（在浏览器里即window对象）的属性，所以this指向全局对象
//当然，即使fn不为全局变量，fn里的this也指向window
```
* 即，以正常形式 obj.method() 的形式调用一个对象的方法时，其内部的 this 总是指向属性所属的对象，而不管这个函数本身属性于哪个对象
  * 也就是说，在 js 里，函数并不属于哪个对象，只是被一个对象的属性所指向（跟其它语言不一样，函数是属性一个对象或者一个类型的）
  * 全局变量其实是 window 对象的属性，所以用全局变量来指向一个函数并通过这个全局变量来调用这个函数时，其内部的 this 是 window（即全局对象）
  * 有 99.99999% 的可能，你不需要通过 this 来访问 window，因为任何时候都可以直接用window来访问window，完全不需要多此一举，这个问题只出现于面试题中
* 函数对象上的方法：call 和 apply，以【特殊的形式调用函数】的【同时可以改变函数内部this】的指向并以【各自特定的方式】传入参数
```js
function foo(a,b) {
  console.log(this)
  return a+b
}
// 相当于foo内部的this为{a:1},同时a b c分别为1 2 3
arr = [1,2]
console.log(foo.call({a:1},1,2))
console.log(foo.apply({a:1}, arr))
//等价于上面的写法，区别在于apply的第二个参数是一个数组，其数量可变
```
* call和apply在调用函数并设置其内部的this的指向时，这个被this指向的值必须为一个对象，而不能是一个原始类型的值，如果传入一个原始类型的值，会被包装为一个对象类型
* bind 用于返回一个（被bind的函数）与原函数功能相同但内部的 this 以及前面若干个参数固定为某些值的【新函数】，以致于你可以给返回的函数只传剩余的参数。由bind返回的函数再bind是无法改变里的this指向的，但，可以继续固定后面的参数
```js
function foo(a,b,c) {
  console.log(this)
  return a+b+c
}

boundedFoo = foo.bind([1,2,3], 10)

console.log(  boundedFoo(20, 30) )// => 60
// log 出 [1,2,3]

boundedFoo2 = boundedFoo.bind(null, 20)
console.log(boundedFoo2(40)) // => 70
// log 出 [1,2,3]
```
* call apply bind 的第一个参数如果传入原始类型，会被转换为包装类型
  * 什么是包装类型，什么是原始类型？
    * "abc",2,true,false 叫做原始类型 premitive value
      * 理论上来说原始类型【并不是真正的对象】，也没有任何属性与方法，之所在可以表现出对象的行为，是因为在执行相应的代码瞬间，被转换了为包装类型
      * 即执行类似"abc".toUpperCase()的时候，把"abc"转换为了其对应的包装类型，变成了真正的对象
    * new String('abc'), new Number(2), new Boolean(true)叫做包装类型 wrapped value
      * 注意一定要用 new 调用，不用 new 的话只是相当于类型转换
    * 或者以下方式：Object(somePremitiveValue)也可以将原始类型转换为包装类型
    * JS中这两个概念（原始/包装类型）一般只针对字符串，数，布尔这三种类型
      * 在es6里新增了symbol类型
    * 【一般来说，在能使用原始类型的情况下都使用原始类型】
      * 有些较老的书本中（典型的如红宝书以及权威指南中都是使用new Xxx()的，事实上目前前端社区并不推荐这种方式，繁琐不说，类型判断也成问题
    * 【数组】和【对象】以及【函数】不存在 “原始类型” 和 “包装类型” 的说法，它们本身就是完全的对象，所以理论上来说函数并不是原始类型，虽然typeof对其并不返回"object"而是返回"function"

### 原型链

* 在任何对象上查找某个属性时，会先在其自身上找，当查找不到时，会在此对象的 __proto__ 属性上去查找
* 可以用 Object.create(p) 创建一个 __proto__ 为 p 的对象，即返回的对象的 __proto__ 指向 p
* 可以通过 Object.getPrototypeOf(obj) 获得 obj 对象的【__proto__】
  * 其与对象的 __proto__ 属性其实是同一个东西，只是后者更加标准
  * 但在更早的浏览器中，这两者都是不可用的
* 可以通过Object.setPrototypeOf(obj1, obj2)设置obj1对象的__proto__为obj2
* 一个没有被明确指定 __proto__ 的对象，它的的 __proto__ 指向 Object.prototype

### 构造函数，面向对象，继承与类型

* 使用 new 操作符来调用一个函数将使得这个函数成为一个【构造函数】
  * 使用 new 操作符来调用函数时，仅能以【正常的方式】调用，不存在 new Foo.call/apply() 这样的写法（理论上这个代码相当于把call，apply当成了构造函数）
  * 如下代码是把 Button这个函数当成了构造函数：new Form.Button()
  * js中所谓的构造函数事实上跟正常函数没有区别，只在于其调用时前面加上new时其内的this指向一个新创建的空对象，而且这个空对象的原型（__proto__）指向该构造函数的prototype属性。而构造函数这个概念实质来自于其它的面向对象语言，意义为【构造】一个新的【对象】，所以才有 new Foo()
* 构造函数内部的 this 为一个 __proto__ 指向构造函数 prototype 属性的空对象
    * 构造函数如果不明确的返回一个值，则其内部的 this 将被返回（此为new 操作符的功能）
    * 构造函数返回的对象一般称为这个构造函数的【实例】（instance）
    * 在面向对象的理念中，一般来说，构造函数表示一个【类型】，简称“类（Class）”
* 事实上，JS中一切皆对象，每一类值（对象）都有其对应的构造函数：
  * 数值 类型 的构造函数是 Number
  * 字符串 类型 的构造函数是 String
  * 布尔 类型 的构造函数是 Boolean
  * 对象 类型 的构造函数是 Object
  * 数组 类型 的构造函数是 Array
  * 函数 类型 的构造函数是 Function
  * 正则表达式 类型的构造函数是 RegExp
  * null/undefined 不是对象，没有构造函数
* 由于有了原型链，我们可以使用原型链来实现面向对象的各个特性。

### 面向对象

* 基于JS语言以上的特点，我们可以用它来【模拟】面向对象编程的各个特性

* 什么是封装？
  * 即把【用来表示一个物事的所有数据】以及【能够对这些数据执行的操作（函数）】放在一起
* 相比于push(ary, item)，即使不懂编程的人可能也更喜欢ary.push(item)这种写法
* 这就是封装带来的好处之一：语义更清晰，可读性更好
* 同时这种写法把一个事物的能执行的操作放在了对象上，而不是使用全局函数，这也更方便我们为函数（方法）命名

* JS中，使用原型链来实现让所有同类的对象共享方法
    ```js
    function A(args){
      //总之从参数里弄出用于表达此类对象所需要的数据，然后放在this上面
      //比如说表达一个复数，必要的信息量即为实部和虚部，那就从参数中得到这两个值
      //然后放在this上
      //构造函数的参数具体如何设计，取绝于你想在程序中如何使用这个构造函数
      this.real = ...
      this.imag = ...
    }

    var c1 = new Complex(1,2)
    var c2 = new Complex('1+2i')
    var c3 = new Complex(c1)



    Complex.fromString = function(str) {
      var real = ....
      var imag = ....
      return new Complex(real, imag)
    }

    Complex.clone = function(complex){
      var real = complex.real
      var imag = complex.imag
      return new Complex(real, imag)
    }

    c4 = Complex.clone(c3)
    
    c.add()
    A.prototype.method1 = function(){

    }
    A.prototype.method2 = function(){}
    A.prototype.method3 = function(){}//由于方法是共享的，所以将它们放在构造函数的prototype上，这样实例就能够通过原型访问到了，同时通过原型访问到时，这些函数的this就是相应的实例对象。正因为如此（使用this来访问实例）这些方法不能使用箭头函数，因为箭头函数里的this完全是一个常规变量
    var a = new A()
    var b = new A()
    ```

* 继承的写法
    ```
    function A(){}
    function B(){
      A.call(this,a,b,c)

    }
    
    B.prototype = Object.create(A.prototype)
    B.prototype.__proto__ = A.prototype
    Object.setPrototypeOf(B.prototype, A.prototype)

    
    B.prototype = new A()

  
    function C(a,b,c){
      B.call(this, a,b,c)
    }

    ```
* ES6中的写法
    ```js
    class Complex {
      static clone(c){
        return new Complex(c.re, c.im)
      }
      static isComplex(c) {
        return c instanceof Complex
      }
      constructor(re, im){
        this.re = re
        this.im = im
      }
      clone(){
        return new Complex(this.re, this.im)
      }
      add(cplx) {
        return new Complex(this.re + cplx.re, this.im + cplx.im)
      }
      toString() {
        return `${this.re}+${this.im}i`
      }
    }



    class Complex {
      static void main(){

      }
      Complex(re, im) {
        this.re = re
        this.im = im
      }
      add(c) {
        return new Complex(this.re + c.re, this.im + c.im)
      }
    }

    class Vector extends Complex {
      constructor(a,b,c){
        super(a,b)
        this.c = c
      }
    }

    class Vector extends Array {

    }

    class A {

    }

    ```


* 封装？继承？多态？
* 事实上，封装这个概念将会在编程中无处不在，理论上写一个函数也是一种封装，总之，只要是把细节隐藏起来而暴露简单的接口，都可以称为封装
* 继承在非大型程序中用的不会太多
* 而多态的运用，多数时候使用者是感知不到的
* 如for of就是多态的一种应用


var obj = {}

obj[Symbol.iterator] = function * (){
  yield 1
  yield 2
  yield 3
}

for(var i of 9) {
  console.log(i)
}


Number.prototype[Symbol.iterator] = function * (){
  for(var i = 0; i < this; i++) {
    yield i
  }
}

for(var i of 9) {
  console.log(i)
}
