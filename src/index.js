const fs = require('fs');
const path = require('path');
const glob = require('glob');
const fse = require('fs-extra');
const loaderUtils = require('loader-utils');
const yaml = require('yaml-js');
const Spritesmith = require('spritesmith');
const spritesheetTemplates = require('spritesheet-templates');

const PreSuffix = 'tileset-'
const DefaultConfig = {};

module.exports = function(content, map, meta) {
  const self = this;
  const callback = self.async();
  const options = loaderUtils.getOptions(self) || {}; // loader options
  const config = Object.assign({}, DefaultConfig, yaml.load(content.toString()) || {}); // .tiled 文件配置
  //
  const process = options.process;
  const output = options.output;
  //
  const context = self.context; // .tiled dir path
  const dirName = path.parse(context).name;
  const resourcePath = self.resourcePath; // .tiled path
  //
  const files = glob.sync(path.join(context, '*.jpg'));
  Spritesmith.run({
    src: files,
    algorithm: 'binary-tree',
  }, function(err, result) {
    if (err) {
      throw err;
    }
    for (let key in result) {
      console.log(`\n${key}\n`);
    }
    // 写图片
    fs.writeFileSync(path.resolve(__dirname, output, PreSuffix + dirName + '.png'), result.image);
    // 写json
    const sprites = [];
    Object.keys(result.coordinates).forEach(key => {
      sprites.push({
        name: path.relative(context, key),
        ...result.coordinates[key],
      });
    });
    const spritesheet = { image: './' + PreSuffix + dirName + '.png', ...result.properties };
    const jsonContent = spritesheetTemplates(
      { sprites, spritesheet },
      { format: 'json_texture' },
    );
    fse.writeFileSync(path.resolve(__dirname, output, PreSuffix + dirName + '.json'), jsonContent, { encoding: 'utf8' });
    //
    const res = '';
    callback(null, res, map, meta);
  });
}