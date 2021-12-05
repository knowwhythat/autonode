export function parseJSON(data: string, def: any) {
  try {
    const result = JSON.parse(data)

    return result
  } catch (error) {
    return def
  }
}
