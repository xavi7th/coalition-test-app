require('@task-assets/js/bootstrap');

import { InertiaProgress } from '@inertiajs/progress'
import { createInertiaApp } from '@inertiajs/inertia-svelte'
import { getErrorString } from "@task-shared/helpers";

InertiaProgress.init({
  // The delay after which the progress bar will
  // appear during navigation, in milliseconds.
  delay: 250,

  // The color of the progress bar.
  color: '#29d',

  // Whether to include the default NProgress styles.
  includeCSS: true,

  // Whether the NProgress spinner will be shown.
  showSpinner: true,
})


//? Make sure Svelte is initialised after our routes are available to the front end
let clearInt = setInterval(() => {
  try {
    route();
    console.log('--------route() initialized-----------');

    //! Initialize SVELTE
    createInertiaApp({
      resolve: name => {

        let [module, component] = name.includes('::') ? _.split(name, '::') : [null, name];

          return import(
            /*
              webpackChunkName: "assets/js/inertia-lazy-bundle",
              webpackMode: "lazy-once",
              webpackPrefetch: true,
              webpackPreload: true
            */
              `../../../${module}/Resources/js/Pages/${component}.svelte`
          )
      },
      setup({ el, App, props }) {
         if (Object.entries(props.initialPage.props.errors).length) {
          ToastLarge.fire({
            title: "Error",
            html: getErrorString(props.initialPage.props.errors),
            icon: "error",
            timer:10000, //milliseconds
            footer:
              `Our support email: & nbsp; & nbsp; & nbsp; <a target = "_blank" rel = "noopener noreferrer" href = "mailto:${process.env.MIX_APP_EMAIL}" > ${process.env.MIX_APP_EMAIL} </a>`,
          });
        } else if (props.initialPage.props.flash.warning) {
          ToastLarge.fire({
            title: "Note!!",
            html: props.initialPage.props.flash.warning,
            icon: "warning",
            timer: 15000,
            allowEscapeKey: true
          });
        } else if (props.initialPage.props.flash.success) {
          ToastLarge.fire({
            title: "Success",
            html: props.initialPage.props.flash.success,
            icon: "success",
            timer: 3000,
            allowEscapeKey: true
          });
        }
        new App({ target: el, props })
      },
    })

    clearInterval(clearInt);
  } catch (e) {
    console.log(e);
  }
}, 300);
