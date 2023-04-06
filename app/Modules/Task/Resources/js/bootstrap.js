import { Inertia } from "@inertiajs/inertia";
import { getErrorString } from "@task-shared/helpers";

window._ = {
    debounce: require('lodash/debounce'),
    filter: require('lodash/filter'),
    isString: require('lodash/isString'),
    map: require('lodash/map'),
    reduce: require('lodash/reduce'),
    split: require('lodash/split'),
    size: require('lodash/size'),
    toLower: require('lodash/toLower'),
}

window.swl = require('sweetalert2')

window.Toast = swl.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
  showCloseButton:true,
  allowEscapeKey:true,
    timer: 2000,
    icon: "success",
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', swl.stopTimer)
    toast.addEventListener('mouseleave', swl.resumeTimer)
  }
});

window.ToastLarge = swl.mixin({
    icon: "success",
    title: 'To be implemented!',
    html: 'I will close in <b></b> milliseconds.',
    timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
  allowEscapeKey:true,
    willOpen: () => {
    swl.showLoading()
    },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', swl.stopTimer)
    toast.addEventListener('mouseleave', swl.resumeTimer)
  }

    // willClose: () => {}
})

window.BlockToast = swl.mixin({
  willOpen: () => {
    swl.showLoading()
    },
  showConfirmButton: false,
    showCloseButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false
});

window.swlPreconfirm = swl.mixin({
    title: 'Are you sure?',
    text: "Implement this when you call the mixin",
    icon: 'question',
    showCloseButton: false,
  backdrop:true,
    allowOutsideClick: () => !swl.isLoading(),
    allowEscapeKey: false,
    showCancelButton: true,
    focusCancel: true,
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'To be implemented',
    showLoaderOnConfirm: true,
    preConfirm: () => {
    /** Implement this when you call the mixin */
    },
})

Inertia.on('start', (event) => {})

Inertia.on('progress', (event) => {
  console.log(event);
})

Inertia.on('success', ( e ) => {
  if ( e.detail.page.props.flash.success ) {
    ToastLarge.fire({
      title: "Success",
      html: e.detail.page.props.flash.success,
      icon: "success",
      timer: 3000,
      allowEscapeKey: true
    });
  } else if ( e.detail.page.props.flash.warning ) {
    ToastLarge.fire({
      title: "Note!!",
      html: e.detail.page.props.flash.warning,
      icon: "warning",
      timer: 5000,
      allowEscapeKey: true
    });
  } else {
    swl.close();
  }
})

Inertia.on('error', (e) => {
  console.log(`There were errors on your visit`)
  console.log(e);

  console.log(getErrorString(e.detail.errors));

  ToastLarge.fire({
    title: "Error",
    html: getErrorString(e.detail.errors),
    icon: "error",
    timer:10000, //milliseconds
    footer:
        `Our support email: & nbsp; & nbsp; & nbsp; <a a target = "_blank" rel = "noopener noreferrer" href = "mailto:support@example.com" > support@example.com </a> `,
  });
})

Inertia.on('invalid', (event) => {
  console.log(`An invalid Inertia response was received.`, event)
  event.preventDefault();

  if (event.detail.response.status === 403) {
    Toast.fire({position: 'top',text: 'Action forbidden!',icon:'error'})
  } else {
    Toast.fire({ position: 'top', title: 'Oops!', text: event.detail.response.statusText, icon:'error'})
  }
})

Inertia.on('exception', (event) => {
  console.log(event);
  console.log(`An unexpected error occurred during an Inertia visit.`)
  console.log(event.detail.error);
})

Inertia.on('finish', ( e ) => {
  // console.log(e);
})
