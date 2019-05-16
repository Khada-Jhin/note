# BOM

* 什么是BOM？
  * Browser Object Model
* DOM一般指document上提供的相关API
  * API Application Programming Interface 应用编程接口
    * 以函数，类，方法，属性等体现出来
  * GUI 图形用户界面
    * 以画面和键鼠操作的形式体现
  * CLI 命令行用户界面Command Line Interface
    * 以命令的输入与输出为体现
* BOM一般来说泛指那些浏览器里提供的除JS内置API以外
  * 与DOM操作无关的API
* 原则上这是一个非官方的叫法，并没有相关的文档
* https://stackoverflow.com/questions/4416317/what-is-the-dom-and-bom-in-javascript
* 如
  * alert/prompt/confirm
  * Worker
  * Blob Binary Large Object b  
* 完善的BOM API一般认为是以下这些浏览器提供的对象
  * screen
  * history
  * location
  * navigator
* 这几个对象可以分别为我们提供与页面和浏览器相关的各种信息
  * screen
    * width/height 操作系统像素
    * availHeight/Width
    * color/pixelDepth = 24
      * 色深，说白了即色彩的多样性，现代开发中基本没啥用
  * location
    * host 域名：端口-带端口号
    * hostname 域名-不带端口号
    * hash URL#后面一部分
      * window.onhashchange
      * 另外 hash 的内容是不会主动被浏览器发往服务器的
        * 即请求 http://example.com/a.html#abc
        * 在网络层面，相当于请求http://example.com/a.html
        * 浏览器发送的第一行内容是 GET /a.html HTTP/1.1
    * port 端口
    * protocol 协议 http:
    * origin 源/域，即如果两个页面的location.origin不同，则被认为是不同的域的
      * 'http://example.com:8080'
      * http://www.baidu.com/a.html
      * http://www.baidu.com:8080/b.html
    * href 地址栏里的完整URL，包含hash
    * search 第一个?后面#前面的内容，即query string部分，也叫查询字符串query string
      * http://example.com/a/b/c.html?foo=bar&c=d#abcdef?iekjdsf
    * reload() 刷新页面
    * assign(url) <=> location.href = url <=> location = url
    * replace(url) 用url替换当面页面地址，且不把跳转记录保存在浏览器的前进后退按钮中
    * 同时，上面列的所有属性几乎都是可写的，更改它们会导致浏览器做出相应的操作（一般来说是重新加载或刷新页面）
      * 更改hash不会让页面刷新，但会触发window.onhashchange事件，可以在这个事件的handler里做相应的操作（如刷新，或请求ajax）（一般用来做前端路由）
        * 在老浏览器里，可以用setInterval，每隔比如说50ms检测一次location.hash的值，如果发现变化了，就主动调用window.onhashchange()函数
          ```js
          var x = 9
          var lastX = x;
          setInterval(function(){
              if (lastX != x) {
                  console.log('x has changed')
                  if (typeof window.onhashchange === 'function'){
                    window.onhashchange()
                  }
                  //window.onhashchange || window.onhashchange()
                  lastX = x
              }
          }, 50)
          ```
        * 如果hash对应于页面某元素的id或name的值，页面也会跳转到那个元素的位置。
        * :target 选择器
    * location对象本身也是可以被赋值的，与给href属性赋值是一样的效果
    * 同时，a标签上也几乎有与location对象一一对应的属性
      * 同样是可读写的
      * 可以使用这个特性来实现url的解析
  * history
    * length
    * pushState(state, pageTitle, url)
      * 然后通过 ajax 来请求数据并更新页面内容的
      * 此处需深入讲解
      * 通过window.onpopstate在浏览器后退时，把页面改回对应原来URL的内容
        * history其实是一个栈
        * 在按前进后退时会在栈中来回游走
      * 现代浏览器中，可以用这个方法实现URL的改变但页面不刷新
      * 以此实现 pjax => pushState + ajax
    * replaceState(参数同上)
    * go(number)
    * back()/forward()
      * 等同于按前进后退按钮，会触发popstate事件
      * back()相当于go(-1)，forward()相当于go(1)
  * navigator
    * onLine，是否在线，H5属性
    * userAgent 用户代理字符串
      * 有很多与浏览器本身有关的信息，一般也用于通过JS判断浏览器的版本，厂商，操作系统等信息
      * 有些浏览器可以强行修改这个字符串  
        * 360 QQ 事件
        * 扣扣保镖
      * 会在发送http请求时放进User-Agent首部里
        * 服务器同样可以根据这个头来判断请求是来自手机还是PC，以此返回不同的页面内容
          * HTTP 响应头里有一个首部：
          ```
          HTTP/1.1 302 removed temper
          Location: http://m.mi.com
          ```
          * 注意此跟media query响应式不同，响应式是页面相同，但在不同的屏幕上显示不同的样式
          * 而服务器根据这个内容返回不同的页面，是指针对不同的页面，吐出的html源代码都不同
    * 还有很多其它的属性，但基本不用，各位可以自行在控制台中查看

* window
  * name
  * opener
    * 可以使用这个特性实现跨页面的颜色选择器
    * 蠕虫
  * open
    * 打开一个新窗口
    * https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open
      * javascript:window.open(
        'https://wx.qq.com/?lang=zh_CN',
        '',
        'left=200,top=100,width=800,height=666')

        open(url, title, {
          menubar: true,
          top: 200,
          left: 300,
          width: 500,
        })

  * parent
    * 父窗体
  * screenX/Y
    * 窗口左上角距离屏幕左上角的距离
  * pageX/YOffset
  * scrollX/Y
  * scrollBy/To
  * status
    * 以前浏览器还有状态栏时，显示在状态栏上的文字
  * window.document.title
    * 设置网页的标题
  * top
    * 顶层窗体（frame）
  * atob/btoa()
    * base64编解码
  * blur/focus()
    * 让窗口获取或者失去焦点
    * on blur/focus
      * 不少考试系统
  * window.getComputedStyle(node, [pseudoElementSelector])
    * window.getComputedStyle(document.body)
    * window.getComputedStyle(document.body, 'before')
  * stop()停止加载页面
  * 
* 相关文档请自行查询MDN
  * mdn
    * history
    * screen
    * location
    * navigator