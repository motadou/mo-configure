//第一步，引入配置文件解析类
var configure = require("mo-configure");

//第二步，创建一个配置文件解析类
var config		= new configure();

//第三步，指定配置文件路径，或者传入配置文件的内容
//比如：
//config.parseText('<main>email=motadou@126.com</main>')
//config.get("main.email");
config.parseFile("main.conf");

//例子一: configure to json
//json为内置属性，该属性将配置文件内容转换成了JSON格式的数据
console.log(config.json);

//例子二：有两种方法获取指定的配置项
//第一种直接访问内部的JSON结构，但这种方法有时会抛出异常，请注意捕捉
console.log(config.json.email);
console.log(config.json.main.log.filename);

//第二种调用配置类的get函数，该函数当找不到配置项时，允许返回一个指定的默认值
console.log(config.get("email", "not define email"))
console.log(config.get("main.log.filename"));

//例子三：返回一个JSON对象
var ipinfo = config.get("main.server.ipinfo");
console.log(ipinfo);
console.log(ipinfo[0].host);
