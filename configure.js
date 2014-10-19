var fs = require("fs");

var configure = function () {
    this._data = { };

    this.__defineGetter__("json", function () { return this._data; });
}

configure.prototype.parseText = function (sText) {
    var arr   = sText.split(/\r\n|\r|\n/); //行划分
    var stack = [this._data];

    for(var i = 0, len = arr.length; i < len; i++) {
        var line = arr[i].replace(/^[\s\t ]+|[\s\t ]+$/g, '');
        if (line.length == 0 || line[0] == "#") {
            continue;
        }

        //当前行为当前域下面的值
        if (line[0] != "<") {
            var options = line.split("=");
            var key     = options[0].replace(/^[\s\t ]+|[\s\t ]+$/g, '');
            var value   = options.length == 2?options[1].replace(/^[\s\t ]+|[\s\t ]+$/g, ''):undefined;

            stack[stack.length - 1][key] = value;
            continue;
        }

        //当前行为域的标识
        if (line[line.length - 1] != '>') {
            //域标识符有开头但没有结尾，则分析错误
            this.data = {};
            return false;
        }

        //当前行为域的结束
        if (line[1] == "/") {
            stack.pop();
            continue;
        }

        //当前行为域的开始
        var key     = line.substring(1, line.length - 1);
        var parent  = stack[stack.length - 1];

        if (parent.hasOwnProperty(key)) {
            //在当前域中已经有相同名字的域
            if (parent[key] instanceof Array) {
                parent[key].push({});
            } else {
                parent[key] = [parent[key], {}];
            }
            stack.push(parent[key][parent[key].length - 1]);
        } else {
            parent[key] = {};
            stack.push(parent[key]);
        }
    }
}

configure.prototype.parseFile = function (sFilePath, encoding) {
    var data = fs.readFileSync(sFilePath, encoding?encoding:"utf8");

    this.parseText(data);
}

configure.prototype.toJson = function() {
    return this._data;
}

configure.prototype.get = function (key, DEFAULT_VALUE) {
    key = key.replace(/[\s\t ]+/g, '');
    key = key.replace(/\.{2,}/g, '.');

    var paths  = key.split('.');
    var parent = this._data;
    for (var i = 0, len = paths.length; i < len; i++) {
        if (!parent.hasOwnProperty(paths[i])){
            return DEFAULT_VALUE;
        }

        if (i == len - 1) {
            return parent[paths[i]];
        }

        parent = parent[paths[i]];
    }
}

module.exports = configure;