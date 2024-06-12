export const USER = {
  patternPassword:
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',

  validationField: {
    email: {
      required: 'กรุณาระบุ E-mail',
      email: 'กรุณาระบุ E-mail ให้ถูกต้อง (example@gmail.com)',
    },
    password: {
      required: 'กรุณาระบุ รหัสผ่าน',
      pattern:
        'ต้องมีตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร',
    },
    confirmPassword: {
      required: 'กรุณาระบุ ยืนยีนรหัสผ่านใหม่',
      match: 'รหัสผ่านไม่ตรงกัน',
    },
    firstname: { required: 'กรุณาระบุ ชื่อ' },
    lastname: { required: 'กรุณาระบุ นามสกุล' },
    role: { required: 'กรุณาระบุ สิทธิ', oneOf: 'กรุณาเลือก user หรือ admin' },
    active: { required: 'กรุณาระบุ สถานะการใช้งาน' },
  },
};
