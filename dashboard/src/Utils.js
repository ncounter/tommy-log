function linkCheck(url) {
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status!==404;
}

function validateRegEx(exp) {
  try {
    ''.match(exp);
  }
  catch (Exception){
    return false;
  }
  return true;
}

function normalizeData(data, filter) {
  if (data) {
    const keys = Object.keys(data);
    return filter(keys);
  }
  return []
}

function toggleElementFromArray(element, array) {
  if (array.includes(element)) {
    array = array.filter(e => e !== element);
  }
  else {
    array = [...array, element];
  }
  return array;
}

module.exports = {
  linkCheck: linkCheck,
  validateRegEx: validateRegEx,
  normalizeData: normalizeData,
  toggleElementFromArray
}
