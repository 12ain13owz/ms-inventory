export const PROFILE = {
  validationField: {
    email: {
      required: 'กรุณาระบุ E-mail',
      email: 'กรุณาระบุ E-mail ให้ถูกต้อง (example@gmail.com)',
    },
    firstname: { required: 'กรุณาระบุ ชื่อ' },
    lastname: { required: 'กรุณาระบุ นามสกุล' },
    role: { required: 'กรุณาระบุ สิทธิ', oneOf: 'กรุณาเลือก user หรือ admin' },
  },
};
