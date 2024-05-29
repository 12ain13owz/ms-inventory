export const PASSWORD = {
  patternPassword:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,

  validationField: {
    oldPassword: { required: 'กรุณาระบุ รหัสผ่านเก่า' },
    newPassword: {
      required: 'กรุณาระบุ รหัสผ่านใหม่',
      pattern:
        'ต้องมีตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร',
    },
    confirmPassword: {
      required: 'กรุณาระบุ ยืนยันรหัสผ่านใหม่',
      match: 'รหัสผ่านไม่ตรงกัน',
    },
  },
};
