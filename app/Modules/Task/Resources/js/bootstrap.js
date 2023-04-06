import { Inertia } from "@inertiajs/inertia";
import { getErrorString } from "@task-shared/helpers";

window._ = {
    split: require('lodash/split'),
}

window.swl = require('sweetalert2')

window.Toast = swl.mixin({
    toast: TRUE,
    position: 'top-end',
    showConfirmButton: FALSE,
  showCloseButton:TRUE,
  allowEscapeKey:TRUE,
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
  timerProgressBar: TRUE,
  showConfirmButton: FALSE,
  allowEscapeKey:TRUE,
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
  showConfirmButton: FALSE,
    showCloseButton: FALSE,
    allowOutsideClick: FALSE,
    allowEscapeKey: FALSE
});

window.swlPreconfirm = swl.mixin({
    title: 'Are you sure?',
    text: "Implement this when you call the mixin",
    icon: 'question',
    showCloseButton: FALSE,
  backdrop:TRUE,
    allowOutsideClick: () => !swl.isLoading(),
    allowEscapeKey: FALSE,
    showCancelButton: TRUE,
    focusCancel: TRUE,
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'To be implemented',
    showLoaderOnConfirm: TRUE,
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
      allowEscapeKey: TRUE
    });
  } else if ( e.detail.page.props.flash.warning ) {
    ToastLarge.fire({
      title: "Note!!",
      html: e.detail.page.props.flash.warning,
      icon: "warning",
      timer: 5000,
      allowEscapeKey: TRUE
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
        `Our support email: & nbsp; & nbsp; & nbsp; < a target = "_blank" rel = "noopener noreferrer" href = "mailto:contact@enski.net" > contact@enski.net < / a > `,
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
