const mix = require('laravel-mix');
const sveltePreprocess = require('svelte-preprocess');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let path = require('path');
let fs = require('fs-extra');

require('laravel-mix-purgecss');

let modules = fs.readdirSync('./app/Modules');

if (modules && modules.length > 0) {
  modules.forEach((module) => {
    let path = `./app/Modules/${module}/webpack.mix.js`;
    if (fs.existsSync(path)) {
      require(path);
    }
  });
}

mix.setPublicPath('./public');

mix.babelConfig({
  plugins: ["@babel/plugin-syntax-dynamic-import"],
});

mix.alias({
  ziggy: path.resolve("vendor/tightenco/ziggy/dist"), // or 'vendor/tightenco/ziggy/dist/vue' if you're using the Vue plugin
  svelte: path.resolve("node_modules", "svelte"),
});

mix.webpackConfig({
  resolve: {
    extensions: [".mjs", ".js", ".svelte", ".json"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditionNames: ["svelte"],
    alias: {
      "@assets": __dirname + "/resources",
    },
  },
  watchOptions: {
    ignored: ["**/*.php", "**/node_modules"],

  },
  output: {
    filename: mix.inProduction()
      ? "[name].[contenthash].js"
      : "[name].[hash].js",
    chunkFilename: mix.inProduction()
      ? "[name].[contenthash].js"
      : "[name].[hash].js",
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      cleanOnceBeforeBuildPatterns: [
        "assets/js/*.js",
        "assets/css/*.css",
        "assets/fonts/*",
        "assets/img/**/*",
        "./mix-manifest.json",
      ],
    }),
  ],
  module: {
  rules: [
  {
    test: /\.(svelte)$/,
    use: {
      loader: "svelte-loader",
      options: {
        emitCss: true, // mix.inProduction(),
        compilerOptions: {
          // css: false,
          dev: !mix.inProduction(),
          enableSourcemap: true,
          },
        onwarn: (warning, handler) => {
          const { code, frame } = warning;

          if (
            code == "anchor-is-valid" ||
            code == "a11y-invalid-attribute" ||
            code == "a11y-media-has-caption" ||
            code == "a11y-missing-attribute" ||
            code == "css-unused-selector" ||
            code == "a11y-missing-content" ||
            // code.startsWith('a11y-') ||
            ( code == "missing-declaration" && frame.includes("route") )
          ) {
            return;
          }

          console.log("\x1b[41m%s\x1b[0m", code);

          handler(warning);
          },
        preprocess: sveltePreprocess()
        },
      },
    },
  ],
  },
});

mix
  .options({
    watchOptions: {
      ignored: [
        "**/Modules/**/*.php",
        "**/node_modules",
        "**/resources/**/*.blade.php",
      ],
    },
    fileLoaderDirs: {
      images: "img",
    },
    postCss: [
      require("postcss-fixes")(),
      require("cssnano")({
        discardComments: {
          removeAll: true,
        },
        calc: false,
        cssDeclarationSorter: true,
      }),
    ],
  })
  .extract()
  .purgeCss({
    enabled: true,
    extend: {
      content: [
        path.join(__dirname, "app/Modules/**/*.php"),
        path.join(__dirname, "resources/**/*.blade.php"),
        path.join(__dirname, "app/Modules/**/*.js"),
        path.join(__dirname, "resources/js/**/*.js"),
        path.join(__dirname, "app/Modules/**/*.svelte"),
      ],
      safelist: {
        standard: [/[pP]aginat(e|ion)/, /active/, /page/, /disabled/, /fa-gift/, /fa-users/, /file-video-o/, /fa-stream/, ],
        deep: [/[dD]ata[tT]able/,/^swal2/, /svelte-/, /disabled/],
        greedy: [/^dt/, /modal/, /swal2/, /svelte-/, /disabled/]
      },
    },
  })
  .then(() => {
    const _ = require("lodash");
    var crypto = require("crypto");
    const saltCssId = crypto.randomBytes(7).toString("hex");

    let oldManifestData = JSON.parse(
        fs.readFileSync("./public/mix-manifest.json", "utf-8")
    );
    let newManifestData = {};

    _.map(oldManifestData, ( actualFileName, mixKeyName ) => {
      if ( _.startsWith(mixKeyName, "/assets/css") ) {
        /** Exclude CSS files from renaming for now till we start cache busting them */
        newManifestData[mixKeyName] = actualFileName + "?" + saltCssId;
      } else if (
        _.startsWith(mixKeyName, "/assets/js/manually-version-")
      ) {
        const buff = fs.readFileSync(__dirname + "/public" + actualFileName);
        const md5hash = crypto.createHash("md5").update(buff).digest("hex");

        let newFileName = _.split(actualFileName, ".")
          .tap(( o ) => {
            o.splice(
                0,
                1,
                actualFileName.replace("manually-version-", "").replace(".js", "")
            ); //NOTE: This removes the tag (manually-version-) from the name
            o.splice(1, 0, md5hash); //NOTE: This adds the md5 hash to the name
          })
          .join(".");

        let newMixKeyName = _.split(mixKeyName, ".")
          .tap(( o ) => {
            o.splice(
                0,
                1,
                mixKeyName.replace("manually-version-", "").replace(".js", "")
            ); //NOTE: This removes the tag (manually-version-) from the mix-manifest key
          })
          .join(".");

        /** If the js extension has been stripped we add it back */
        newFileName = _.endsWith(newFileName, ".js")
          ? newFileName
          : newFileName + ".js";
        newMixKeyName = _.endsWith(newMixKeyName, ".js")
          ? newMixKeyName
          : newMixKeyName + ".js";

        newManifestData[newMixKeyName] = newFileName;

        //- We are using a Set Timeout because mix throws an arror if we rename the file before it has an opportunity to analyze the file's statistics
        setTimeout(() => {
          //NOTE: This renames the actual file to the versioned name
          fs.renameSync(
              __dirname + "/public" + actualFileName,
              __dirname + "/public" + newFileName
          );
        }, 300);
      } else {
        /**
         * Remove the hash from the mix key name so that we can reference the files
         * by their base name in our codes and mix will automatically replace that
         * with a call to the hashed actual file name
         */
        let newMixKeyName = _.split(mixKeyName, ".")
          .tap(( o ) => {
            _.pullAt(o, 1);
          })
          .join(".");

        /** If the js extension has been stripped we add it back */
        newMixKeyName = _.endsWith(newMixKeyName, ".js")
          ? newMixKeyName
          : newMixKeyName + ".js";

        newManifestData[newMixKeyName] = actualFileName;
      }
    });

    let data = JSON.stringify(newManifestData, null, 2);
    fs.writeFileSync("./public/mix-manifest.json", data);
  });


if (!mix.inProduction()) {
  mix.sourceMaps();
}
