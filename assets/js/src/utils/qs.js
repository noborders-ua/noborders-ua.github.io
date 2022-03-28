function serialize(params, prefix) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    // remove whitespace from both sides of the key before encoding
    key = encodeURIComponent(key.trim());

    if (params.constructor === Array ) {
      key = `${prefix}[]`;
    } else if (params.constructor === Object) {
      key = (prefix ? `${prefix}[${key}]` : key);
    }

    /**
     *  - undefined and NaN values will be skipped automatically
     *  - value will be empty string for functions and null
     *  - nested arrays will be flattened
     */
    if (value === null || typeof value === 'function') {
      acc.push(`${key}=`);
    } else if (typeof value === 'object') {
      acc = acc.concat(serialize(value, key));
    } else if(['number', 'boolean', 'string'].includes(typeof value) && value === value) { // self-check to avoid NaN
      acc.push(`${key}=${encodeURIComponent(value)}`);
    }

    return acc;
  }, []);
}

function qs(queryParameters) {
  return queryParameters ? serialize(queryParameters).join('&'): '';
}

/*
  let x = objectToQueryString({
    foo: 'hello world',
    bar: {
      blah: 123,
      list: [1, 2, 3],
      'nested array': [[4,5],[6,7]] // will be flattened
    },
    page: 1,
    limit: undefined, // field will be ignored
    check: false,
    max: NaN, // field will be ignored
    prop: null,
    ' key value': 'with spaces' // space in key will be trimmed out
  });
*/

export default qs;
