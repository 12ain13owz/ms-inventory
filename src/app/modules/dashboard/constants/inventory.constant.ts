export const INVENTORY = {
  validationField: {
    code: { required: 'กรอก รหัสครุภัณฑ์' },
    description: { required: 'กรอก รายการครุภัณฑ์' },
    unit: { required: 'กรอก แหล่งหน่วยนับ' },
    value: { required: 'กรอก มูลค่าครุภัณฑ์' },
    receivedDate: { required: 'กรอก วันที่ได้มา' },
    fundingSource: { required: 'กรอก แหล่งเงิน' },
    location: { required: 'สถานที่ตั้ง/จัดเก็บ' },
    category: { required: 'เลือก คุณสมบัติ' },
    status: { required: 'เลือก สถานะ' },
    usage: { required: 'เลือก การใช้งาน' },
    image: { mimeType: 'ประเภทไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น' },
  },
};
