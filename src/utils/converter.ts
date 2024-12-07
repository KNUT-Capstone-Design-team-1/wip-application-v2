const stringToInt8Array = (data: string): Int8Array => {
  const res = data.match(/-?\d+/g)?.map(Number)
  return new Int8Array(res ?? [])
}

export { stringToInt8Array }