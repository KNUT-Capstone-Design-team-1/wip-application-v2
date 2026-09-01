// 폴더 이름 생성 및 수정 시 유효성을 검사하는 함수
export const validateFolderName = (
  name: string,
): { isValid: boolean; message: string } => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { isValid: false, message: '폴더 이름을 입력해주세요.' };
  }

  if (trimmedName.length > 255) {
    return {
      isValid: false,
      message: '폴더 이름은 최대 255자까지 가능합니다.',
    };
  }

  // 영문, 숫자, 한글, 공백 및 SQLite에서 문제되지 않는 일반적인 특수문자 허용 (따옴표, 세미콜론 등은 제외)
  const isValidName =
    /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s\-_()\[\]{}<>~!@#$%^&*+=,./?|]+$/.test(
      trimmedName,
    );

  if (!isValidName) {
    return {
      isValid: false,
      message: '폴더 이름에 허용되지 않는 특수문자가 포함되어 있습니다.',
    };
  }

  return { isValid: true, message: '' };
};
