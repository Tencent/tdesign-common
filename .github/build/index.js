/**
 * @author 94dreamer
 * @email 503633021@qq.com
 * @create date 2022-02-16 23:40:59
 * @modify date 2022-02-16 23:42:24
 * @desc 读取 style 下面端的组件 html 罗列展示生成集合 html
 */
const fs = require("fs");
const path = require("path");

const device = global.process?.env?.device;

if (!device) {
  throw new Error(`error: 没有传入参数 device = ${device}`);
}

function walkSync(currentDirPath, callback) {
  const arr = [];
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    fs.statSync(filePath).isDirectory() &&
      fs.readdirSync(filePath).some((n) => n === "index.html") &&
      arr.push(name);
  });
  callback(arr);
}

walkSync(path.join("style", device, "components"), function (res) {
  const html = fs.readFileSync(".github/build/index.html").toString();
  fs.writeFileSync(
    path.join("style", device, "index.html"),
    html.replace("${{ componentsList }}", JSON.stringify(res))
  );
});
