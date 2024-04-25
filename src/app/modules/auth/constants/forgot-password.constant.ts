export const FORGOT_PASSWORD = {
  patternPassword:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,

  validationField: {
    email: {
      required: 'กรุณาระบุ E-mail',
      email: 'กรุณาระบุ E-mail ให้ถูกต้อง (example@gmail.com)',
    },

    passwordResetCode: {
      required: 'กรุณาระบุ รหัสยืนยัน',
      length: 'กรุณาระบุให้ครบ 8 ตัวอักษร',
    },

    newPassword: {
      required: 'กรุณาระบุ New password',
      pattern:
        'ต้องมีตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร',
    },

    confirmPassword: {
      required: 'กรุณาระบุ Confirm password',
      match: 'Password ไม่ตรงกัน',
    },
  },
};
