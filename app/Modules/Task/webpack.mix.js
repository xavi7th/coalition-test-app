const mix = require('laravel-mix');

mix.webpackConfig({
    resolve: {
    extensions: ['.js', '.svelte', '.json'],
    alias: {
        '@task-pages': __dirname + '/Resources/js/Pages',
        '@task-shared': __dirname + '/Resources/js/Shared',
        '@task-components': __dirname + '/Resources/js/Components',
        '@task-partials': __dirname + '/Resources/js/Pages/Partials',
        '@task-assets': __dirname + '/Resources'
      },
    },
})

mix
  .js(__dirname + '/Resources/js/app.js', 'public/assets/js/inertia-app.js')
  .sass(__dirname + '/Resources/sass/app.scss', 'public/assets/css/inertia-app.css');



mix.copyDirectory(__dirname + '/Resources/vendor/assets/images', 'public/assets/img');
mix.copyDirectory(__dirname + '/Resources/vendor/assets/fonts', 'public/assets/fonts');

mix.babel(
    [
    __dirname + "/Resources/vendor/assets/js/modernizr-2.8.3.min.js",
    __dirname + "/Resources/vendor/assets/js/jquery.min.js",
    __dirname + "/Resources/vendor/assets/js/bootstrap.min.js",
    __dirname + "/Resources/vendor/assets/js/jquery.nav.js",
    __dirname + "/Resources/vendor/assets/js/owl.carousel.min.js",
    __dirname + "/Resources/vendor/assets/js/wow.min.js",
    __dirname + "/Resources/vendor/assets/js/slick.min.js",
    __dirname + "/Resources/vendor/assets/js/jquery.counterup.min.js",
    __dirname + "/Resources/vendor/assets/js/waypoints.min.js",
    __dirname + "/Resources/vendor/assets/js/swiper.min.js",
    __dirname + "/Resources/vendor/assets/js/particles.min.js",
    __dirname + "/Resources/vendor/assets/js/jquery.magnific-popup.min.js",
    __dirname + "/Resources/vendor/assets/js/plugins.js",
    __dirname + "/Resources/vendor/assets/js/selectize.js",
    ],
    "public/assets/js/manually-version-inertiajs-app-vendor.js"
);

mix.combine(
    [
    __dirname + "/Resources/vendor/assets/js/skill.bars.jquery.js",
    __dirname + "/Resources/vendor/assets/js/pointer.js",
    __dirname + "/Resources/vendor/assets/js/contact.form.js",
    __dirname + "/Resources/vendor/assets/js/rsmenu-main.js",
    __dirname + "/Resources/vendor/assets/js/main.js",
    ],
    "public/assets/js/manually-version-inertiajs-app-init.js"
);
