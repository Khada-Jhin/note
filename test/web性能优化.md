# web性能优化



* 网络性能
  * 《高性能网站建设指南》
* 页面运行性能
  * 《高性能JavaScript》
  * 长列表性能优化
    * 只展示需要展示的部分
  * 页面内大量计算
    * 把计算移到worker内
    * React Fiber
    * shouldComponentUpdate
    * 针对性优化
    * 大量dom操作时，先把结点移出dom
  * 数据结构与算法的优化


* 减少HTTP请求
  * 合并请求(js/css)
  * css sprite
    * icon font 
      * 问题：颜色单一，不能动画
    * svg
      * 
* 使用 CDN (Content Delivery Network)
  * 智能DNS
  * 静态资源（速度快），物理距离近，同时发送的请求更多（Domain Sharding）
  * 6-8, 10, 以域名为单位的同一个服务器
  * 增加浏览器同时请求资源的数量
    ```
      <html>
        <script src="1.a.com/a.js">
        <script src="1.a.com/a.js">
        <script src="1.a.com/a.js">
        <script src="1.a.com/a.js">
        <script src="1.a.com/a.js">
        <script src="1.a.com/a.js">
        link href="2.a.com/a.css"
        link href="2.a.com/a.css"
        link href="2.a.com/a.css"
        link href="2.a.com/a.css"
        link href="2.a.com/a.css"
        link href="2.a.com/a.css"
      </html>
    ```
* 使用缓存
  * 各种不同的缓存类型
  * If-Modified-Since/Last-Modified//协商缓存，发请求，响应304
  * ETag：RvUiXjL3I8 /If-None-Match: RvUiXjL3I8//协商缓存，发请求，响应304
  * 响应头：Expires: GMT time string
  * Cache-Control: max-age=86400;
  * Cache-Control: max-stale=300;
  * Cache-Control//强缓存，资源不过期就不发请求的
    * 点击链接，重开页面，地址栏输入地址，不发请求
    * f5 会发协商缓存的请求
    * ctrl + f5
  * 强缓存一般不用于html资源
  * 前端缓存（把资源存在localStorage里）
    * 一般用在移动端
  * manifest.json
  * service worker
  * pragma: no-cache


* 压缩
  * minify（去空白去注释）
  * 混淆（修改形参名）
  * 在http连接上启用gzip/deflate压缩/或其它压缩方式
  * 一般只针对文本型资源做压缩
    * html css js
    * 霍夫曼编码
    * 字典压缩
    * jpg png 为啥不压缩呢？
      * 信息熵
      * 信息论，香农
        * 1
        * 称，10枚硬币，有一枚重量跟其它不一样
        * 最少称多少次能够找出这枚硬币
        * 3.4 -> 4
        * 1
  * 用node实现一下
    ```
    app.use(compresser())
    <!-- OR -->
    http.createServer(function(request, response){
      var compressStream = gzip.createGzip()

      response.setHeaders({
        "Content-Encoding": ‘gzip’
      })

      fs.createReadStream('a.js')
        .pipe(compressStream)
        .pipe(response)
    })
    ```

* 将CSS放页面顶部
  * 把css直接内联到页面里，一般首页
* 将JS放底部
  * <script defer async src="xxx.js"></script>
  * js的下载和执行会阻塞页面DOM的解析和渲染(如果下载很久，那么已经解析出的dom是可以渲染出来的)
  * js的运行会阻塞页面
    * 解析：解析html并构建dom树
    * 渲染：把页面画到屏幕上
    * 为什么JS的下载和运行会阻塞页面？
      * 单线程
        * 页面解析，渲染，和js的运行，全部在同一个线程里执行
          * JS执行线程跟UI线程是同一个线程
      * 原因：JS里的代码是有可能操作（已生成的）或增加DOM的
        ```
          <p id="p"></p>
          <script>
            document.getElementById('p').innerHTML='abc'
            document.write('<input type="text">')
          </script>
        ```
      * <script src="1.js"></script>
      * <script src="2.js" defer></script>
      * <script src="3.js" async></script>
      * <script src="4.js" async></script>
      * <script src="5.js" defer></script>
      * <script src="6.js"></script>
      * defer async的script标签里不要写document.write
        * 因为它们执行的时候很有可能dom已经解析完毕并且文档流已经关闭（document.close()）了再write将会重新开启文档流，会覆盖已解析的dom树
      * 页面里的各个资源下载的优先级是什么样的？
        * js,css,img,font, // iframe,video/audio
        * css > js > 视区内的img元素 > img > font
* 避免CSS表达式
  * width: expression('document.body.innerWidth - 100');
  * 原因是表达式可能在各种条件下都会触发执行，执行次数太多导致影响性能
  * 已过时 deprecated
* 使用外部的JS和CSS
  * 因为不同页面使用同的个文件的话，缓存就会起作用
  * 内联当然就不会起作用了，一般不会把html页面缓存，除非是静态模板
* 分散域名（Domain sharding）
  * http://blog.catchpoint.com/2013/09/18/why-domain-sharding-is-bad-news-for-mobile-performance-and-users/
* 减少DNS查找
  * 现在可以用 DNS prefetch：
    * <link rel="dns-prefetch" href="//tui.taobao.com" />
* 精简 JS minifiy
  ```
    var a=(f)=>{if(!0){console.log(f)}};a().then(..)
  ```
  * 去掉多余的空格，注释，换行等所有不必要的内容，同时混淆代码
  * 混淆，uglifyjs
    * function doSomething(element, options) ｛
      elements.innerHTML
    * function a(b,c){}
    * 混淆即能减少代码体积，也能保护知识产权
    * 去除死代码 dead code elimiation
    ```js
      function(){
        var a = flase
        var a = !1;
        var a = undefined
        var a = void 0
        if (false) {

        }
        return 8
        console.log(9)
      }
    ```
  * npm i -g uglifyjs
  * uglifyjs xxx -- a.js -o b.js
* 避免重定向
  * 响应头：
  ```
  HTTP/1.1 301 Removed
  HTTP/1.1 302 Removed Temp
  Location: http://c.com/a.html
  ```
  * 即避免30x请求（缓存除外）
    * 307 响应，浏览器内部跳转
  * 4xx 客户端错误 401 UnAuthorized 403 Forbidden 404 Not Found
    * 451 由于政治原因无法向您呈现
  * 5xx
    * 500 
    * 501 Internal Server Error
    * 502 Internal Server Error
* 移除重复脚本(JS/CSS)
* 配置ETag
  * 在apache服务器上
  * ETag是一个http头，类似于文件的hash
  * 一般来说如果服务器检测到相同了，就可以回复一个304请求
  * 不同的机器上，HTTP服务器（apache）的默认配置
    * 会导致相同的文件内容在不同的机器上返回不同的ETag头
* 使ajax可缓存
  * $.get('url') -> $.get('url?_=' + Date.now())
  * 不仅缓存一般内容，还缓存ajax
  * 但要注意不要把不该缓存的内容缓存了
* 把资源存在localStorage里
  * 我们写过POC
  * imququ.com
  * 更新（cookie）
  * 破坏（验证）



* HTTP2
  * 前身： Google 的 SPDY 
    * QUIC udp
  * iHover -> Youtube -> HTTP2视频
  * 二进制协议
  * 压缩请求头(字典压缩)
  * 一个http2连接上走多个请求（多路复用）(分帧)
    * 不再需要减少http请求
    * 不再需要css sprite
    * 不再需要合并文件
  * HTTP 1.1管道化请求（pipeline）
    * https://zh.wikipedia.org/wiki/HTTP%E7%AE%A1%E7%B7%9A%E5%8C%96
  * 请求可以有优先级
  * 服务器可以在http2连接上主动向浏览器推送资源（server push）
    * 浏览器请求了首页
    * 服务器主动在这个http2连接上响应首页所需要的资源
  * 强制要求走HTTPS
    * HTTPS需要证书
      * 证书需要找相应的Cert Auth机构去买
      * letsencrypt
        * git clone https://github.com/letsencrypt/letsencrypt
        * cd lets....
        * ./letsencrypt-auto certonly
        * acme.sh --issue -d a.com --standalone
        * 输入你的域名 80 443 端口不能被占用
        * /etc/letsencrypt/live/aaa.com/..
        * http.createServer({
            key: fs.readFileSync('xxx.key')...
            cert: fs.readFileSync('xxx.cert')
        })
  * https://zh.wikipedia.org/wiki/HTTP/2
  * https://imququ.com/post/http2-resource.html
  * 哪些网站已经在使用
    * Taobao
* 《高性网站建设指南》
  * Yahoo
* Dev Tools Audit 面板




* app cache /manifest.xml
* service worker
* Progressive Web App
  * ele.me
  * alibaba.com
