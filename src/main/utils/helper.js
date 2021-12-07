export function parseJSON(data, def) {
  try {
    const result = JSON.parse(data)
    return result
  } catch (error) {
    return def
  }
}

export function replaceMustache(str, replacer) {
  /* eslint-disable-next-line */
  return str.replace(/\{\{(.*?)\}\}/g, replacer)
}

export function generateJSON(keys, data) {
  const result = []

  keys.forEach(key => {
    for (let index = 0; index < data[key].length; index += 1) {
      const currData = data[key][index]

      if (typeof result[index] === 'undefined') {
        result.push({ [key]: currData })
      } else {
        result[index][key] = currData
      }
    }
  })

  return result
}

export function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

export function objectHasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
