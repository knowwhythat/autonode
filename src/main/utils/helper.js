export function parseJSON(data, def) {
  try {
    const result = JSON.parse(data)
    return result
  } catch (error) {
    return def
  }
}
