import toastr = require('toastr');

toastr.options.closeButton = true;
toastr.options.timeOut = 0;

window.onerror = handleError;

export function handleError(err){
  toastr.error(err.message || err); 
  console.error(err);
}

export function clear(){
  toastr.clear();
}
