/**
 * Transforms an error object into HTML string
 *
 * @param {String|Array|null} errors The errors to transform
 */
export const getErrorString = errors => {

    if (_.isString(errors)) {
        var errs = errors;
    } else if (_.size(errors) == 1) {
        var errs = _.reduce(errors, function (val, n) {
    return val.join("<br>") + "<br>" + n;
      });
    } else {
        var errs = _.reduce(errors, function (val, n) {
    return (_.isString(val) ? val : val.join("<br>")) + "<br>" + n;
      });
    }
    return errs
}

export const mediaHandler = () => {

    let isMobile, isDesktop;

    if (window.matchMedia('(max-width: 991px)')
        .matches) {
        isMobile = true;
        isDesktop = false;
    } else {
        isMobile = false;
        isDesktop = true;
    }
    /**
     * To set up a watcher
     */
    // window.matchMedia('(min-width: 992px)')
    //  .addEventListener("change", () => {
    //      if (window.matchMedia('(max-width: 767px)')
    //          .matches) {
    //          isMobile = true;
    //          isDesktop = false;
    //      } else {
    //          isMobile = false;
    //          isDesktop = true;
    //      }
    //  })

    return { isMobile, isDesktop }
}

export const isNumeric = val => {
  let num = "" + val; //coerce num to be a string
  return !isNaN(num) && !isNaN(parseFloat(num));
}
