import React, { useState } from 'react';
import {
  CModal,
  CCol,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormInput,
  CButton,
} from '@coreui/react';

const AddRentModal = ({ visible, onClose }) => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString()); // Month is 0-indexed
  const [room, setRoom] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [elecUnitPrice, setElecUnitPrice] = useState('');
  const [waterUnitPrice, setWaterUnitPrice] = useState('');
  const [elecNew, setElecNew] = useState('');
  const [elecOld, setElecOld] = useState('');
  const [elecBill, setElecBill] = useState('');
  const [waterNew, setWaterNew] = useState('');
  const [waterOld, setWaterOld] = useState('');
  const [waterBill, setWaterBill] = useState('');
  const [netBill, setNetBill] = useState('');

  const years = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    // Add more years as needed
  ];

  const months = [
    { value: '1', label: 'มกราคม' },
    { value: '2', label: 'กุมภาพันธ์' },
    { value: '3', label: 'มีนาคม' },
    { value: '4', label: 'เมษายน' },
    { value: '5', label: 'พฤษภาคม' },
    { value: '6', label: 'มิถุนายน' },
    { value: '7', label: 'กรกฎาคม' },
    { value: '8', label: 'สิงหาคม' },
    { value: '9', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' },
  ];

  const handleSubmit = () => {
    const rentData = {
      year,
      month,
      room,
      rentPrice,
      elecUnitPrice,
      waterUnitPrice,
      elecNew,
      elecOld,
      elecBill,
      waterNew,
      waterOld,
      waterBill,
      netBill,
    };
    console.log(rentData);
    onClose(); // Close the modal after submission
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalBody>
        <CCol className="mb-3">
          <CFormSelect value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((yearOption) => (
              <option key={yearOption.value} value={yearOption.value}>
                {yearOption.label}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol className="mb-3">
          <CFormSelect value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((monthOption) => (
              <option key={monthOption.value} value={monthOption.value}>
                {monthOption.label}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CFormInput
          label="ห้อง"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="mb-3"
        />
        <CFormInput
          label="ค่าเช่า"
          value={rentPrice}
          onChange={(e) => setRentPrice(e.target.value)}
          type="number"
          className="mb-3"
        />
        <CFormInput
          label="ราคาต่อหน่วยไฟฟ้า"
          value={elecUnitPrice}
          onChange={(e) => setElecUnitPrice(e.target.value)}
          type="number"
          className="mb-3"
        />
        <CFormInput
          label="ราคาต่อหน่วยน้ำ"
          value={waterUnitPrice}
          onChange={(e) => setWaterUnitPrice(e.target.value)}
          type="number"
          className="mb-3"
        />
        <CFormInput
          label="มิเตอร์ไฟใหม่"
          value={elecNew}
          onChange={(e) => setElecNew(e.target.value)}
          type="number"
          className="mb-3"
        />
        <CFormInput
          label="มิเตอร์ไฟเก่า"
          value={elecOld}
          onChange={(e) => setElecOld(e.target.value)}
          type="number"
          className="mb-3"
        />
        <CFormInput
          label="ค่าไฟ"
          value={elecBill}
          onChange={(e) => setElecBill(e.target.value)}
          type="number"
          className="mb-3"
        />
        <CFormInput
          label="มิเตอร์น้ำใหม่"
          value={waterNew}
          onChange={(e) => setWaterNew(e.target.value)}
          type="number"
          className="mb-3"
        />
        <CFormInput
          label="มิเตอร์น้ำเก่า"
          value={waterOld}
          onChange={(e) => setWaterOld(e.target.value)}
          type="number"
          className="mb-3"
        />
        <CFormInput
          label="ค่าน้ำ"
          value={waterBill}
          onChange={(e) => setWaterBill(e.target.value)}
          type="number"
          className="mb-3"
        />
        <CFormInput
          label="รวม"
          value={netBill}
          onChange={(e) => setNetBill(e.target.value)}
          type="number"
          className="mb-3"
        />
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          ยกเลิก
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          บันทึก
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AddRentModal;