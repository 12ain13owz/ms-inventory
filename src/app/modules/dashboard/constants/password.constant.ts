const patternMessage =
  'ต้องมีตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร';

export const PASSWORD = {
  patternPassword:
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',

  validationField: {
    oldPassword: {
      required: 'กรุณาระบุ Old password',
    },

    newPassword: {
      required: 'กรุณาระบุ New password',
      pattern: patternMessage,
    },

    confirmPassword: {
      required: 'กรุณาระบุ Confirm password',
      match: 'Password ไม่ตรงกัน',
    },
  },
};
