export const validateUsername = (username: string) => {
  if (!username) return "아이디를 입력해주세요.";
  if (username.length < 4) return "아이디는 4자 이상이어야 합니다.";
  if (username.length > 20) return "아이디는 20자 이하여야 합니다.";
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return "아이디는 영문, 숫자, 밑줄만 사용 가능합니다.";
  return null;
};

export const validatePassword = (password: string) => {
  if (!password) return "비밀번호를 입력해주세요.";
  if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password))
    return "비밀번호는 영문과 숫자를 포함해야 합니다.";
  return null;
};

export const validateNickname = (nickname: string) => {
  if (!nickname) return "닉네임을 입력해주세요.";
  if (nickname.length < 2) return "닉네임은 2자 이상이어야 합니다.";
  if (nickname.length > 10) return "닉네임은 10자 이하여야 합니다.";
  return null;
};
