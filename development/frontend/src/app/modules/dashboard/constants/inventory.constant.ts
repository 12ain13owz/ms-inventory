export const INVENTORY = {
  validationField: {
    code: { required: 'กรุณาระบุ รหัสครุภัณฑ์' },
    description: { required: 'กรุณาระบุ รายการครุภัณฑ์' },
    unit: { required: 'กรุณาระบุ หน่วยนับ' },
    value: { required: 'กรุณาระบุ มูลค่าครุภัณฑ์' },
    receivedDate: { required: 'กรุณาระบุ วันที่ได้มา' },
    category: { required: 'กรุณาระบุ ประเภท' },
    status: { required: 'กรุณาระบุ สถานะ' },
    fund: { required: 'กรุณาระบุ แหล่งเงิน' },
    location: { required: 'กรุณาระบุ ห้อง' },
    image: { mimeType: 'ประเภทไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น' },
  },
};
