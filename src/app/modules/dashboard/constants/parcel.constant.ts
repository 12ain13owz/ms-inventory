export const PARCEL = {
  validationField: {
    code: {
      required: 'กรุณาระบุรหัสพัสดุ',
    },

    receivedDate: {
      required: 'กรุณาระบุวันที่รับพัสดุ',
    },

    quantity: {
      required: 'กรุณาระบุจำนวนพัสดุ',
      mask: 'กรุณาระบุจำนวนพัสดุ',
    },

    stock: {
      required: 'กรุณาระบุจำนวนพัสดุ',
      mask: 'กรุณาระบุจำนวนพัสดุ',
    },

    detail: {
      required: 'กรุณาระบุรายละเอียดของพัสดุ',
    },

    category: {
      required: 'กรุณาระบุประเภทของพัสดุ',
      pattern: 'กรุณาระบุประเภทของพัสดุ',
    },

    status: {
      required: 'กรุณาระบุสถานะของพัสดุ',
      mask: 'กรุณาระบุสถานะของพัสดุ',
    },

    image: {
      mimeType: 'ประเภทไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น',
    },
  },
};
