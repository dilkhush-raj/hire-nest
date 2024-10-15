function isValidPassword(password: string) {
  const emailRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return emailRegex.test(password);
}
export default isValidPassword;
