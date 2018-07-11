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

function getKeys(data) {
  if (data) {
    return Object.keys(data);
  }
  return []
}

function normalizeDataByKeys(data, filter) {
  if (data) {
    return filter(getKeys(data));
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
  normalizeDataByKeys: normalizeDataByKeys,
  getKeys: getKeys,
  toggleElementFromArray
}
