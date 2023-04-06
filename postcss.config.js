let path = require("path");

module.exports = {
  plugins: {
    "postcss-import": {
      async resolve(id, basedir) {
        // resolve alias @blabla, @import '@blahbla/style.css'
        if (/^@assets/.test(id))
          return await path.resolve("resources", id.slice(8)); // because "@assets/" has 8 chars
        if (/^@task-assets/.test(id))
          return await path.resolve("app/Modules/Task/Resources", id.slice(13));

        // resolve node_modules, @import '~normalize.css/normalize.css', similar to how css-loader's handling of node_modules
        if (/^~/.test(id)) return await path.resolve("./node_modules", id);

        // resolve relative path, @import './components/style.css'
        return await path.resolve(basedir, id);
      },
    },
  },
};
