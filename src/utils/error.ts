const handleError = (error: any): string => {
  const status = error.response?.status;
  let text = ''

  switch (status) {
    case 401:
      text = ' (인증오류)'
      break;
    case 404:
      text = ' (not found)'
      break;
    case 408:
      text = ' (요청만료)'
      break;
    case 500:
      text = ' (서버통신오류)'
      break;
    case undefined:
      text = ` (${error.code})`
      break;
    default:
      text = `\n(${status} : ${error.code})`
      break;
  }

  return text
}

export {
  handleError
}