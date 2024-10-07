import React, { useState } from 'react';
import {
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilPrint, cilPlus } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import AddRentModal from './AddRentModal'; 

const Rental = () => {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [selectedIds, setSelectedIds] = useState([]);
  const [data, setData] = useState([]); // State for room data
  const [selectAll, setSelectAll] = useState(false); // State for Select All checkbox
  const [loading, setLoading] = useState(false); // Loading state
  // const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  // const [modalMessage, setModalMessage] = useState(''); // Modal message

  const navigate = useNavigate();
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US').format(Number(value)); // Formats the number with commas
  };



  const handleFilter = async () => {
    if (!filterYear || !filterMonth) {
     // setModalMessage("กรุณาเลือกปีและเดือนก่อนค้นหา"); // Please select year and month before searching
     // setModalVisible(true); // Show modal
      return; // Exit the function early
    }

    setLoading(true); // Start loading

    try {
      const apiUrl = import.meta.env.VITE_SHEET_KEY;
      const response = await fetch(`${apiUrl}?action=monthly-rent&year=${filterYear}&month=${filterMonth}`);
      const result = await response.json();
      
      if (result.length === 0) {
        setModalMessage("ไม่พบข้อมูล"); // No data found
        // setModalVisible(true); // Show modal
        setData([]); // Reset data
        return;
      }

      const mappedData = result.map(item => ({
        year: item["ปี"],
        month: item["เดือน"],
        roomNo: item["ห้อง"],
        rentPrice: formatCurrency(item["ค่าเช่า"]),
        elecNew: item["มิเตอร์ไฟ (ใหม่)"],
        elecOld: item["มิเตอร์ไฟ (เก่า)"],
        elecBill: formatCurrency(item["ค่าไฟ"]),
        waterNew: item["มิเตอร์น้ำ (ใหม่)"],
        waterOld: item["มิเตอร์น้ำ (เก่า)"],
        waterBill: formatCurrency(item["ค่าน้ำ"]),
        netBill: formatCurrency(item["รวม"]),
      }));
    
      setData(mappedData);
      setSelectedIds([]); // Reset selected IDs on new fetch
      setSelectAll(false); // Reset selectAll state
    } catch (error) {
      console.error("Error fetching data:", error);
     // setModalMessage("เกิดข้อผิดพลาดในการดึงข้อมูล"); // Error fetching data
     // setModalVisible(true); // Show modal
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(data.map(item => item.roomNo)); // Select all
    }
    setSelectAll(!selectAll); // Toggle selectAll state
  };

  const handlePrint = () => {
    if (selectedIds.length > 0) {
      // Find the selected rows' data
      let selectedData = data.filter(item => selectedIds.includes(item.roomNo));
      selectedData = selectedData.map(item => ({
        ...item,
        monthThai: months[filterMonth - 1].label,
      }));
      navigate(`/preview`, { state: { selectedData } });
    }
  };

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

  const years = [
    { value: '2024', label: '2024' }
  ];

  return (
    <CCard>
       {/* <AddRentModal visible={modalVisible} /> */}
       
       <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">รายการค่าเช่าบ้าน</h5>
        {/* <CButton color="warning" onClick={() => setModalVisible(true)}>
          <CIcon icon={cilPlus} customClassName="icon" style={{ marginRight: '8px' }} />
          เพิ่ม
        </CButton> */}
      </CCardHeader>
     
      <CCardBody>
        {/* Date Filter */}
        <div className="d-flex mb-3">
        <CCol md={2} className="me-3">
              <CFormSelect
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="me-2"
              >
                {years.map((year) => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </CFormSelect>
        </CCol> 
        <CCol md={3} className="me-3">
              <CFormSelect
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="me-2"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </CFormSelect>
        </CCol> 
        <CCol md={1} className="me-3">
              <CButton 
                color="primary" 
                onClick={handleFilter} 
                disabled={loading} 
                style={{ flex: '1 1 auto' }} // Make the button flexible
              >
                ค้นหา
              </CButton>
         </CCol> 
        </div>

        {/* Loading Indicator */}
        {loading && <div>Loading...</div>}

        {/* Print Button */}
        <div className="mt-3">
        <CButton color="secondary" onClick={handlePrint} disabled={selectedIds.length === 0}>
        <CIcon icon={cilPrint} customClassName="icon" style={{ marginRight: '8px' }} />
        พิมพ์
        </CButton>
      </div>
     
        {/* Table */}
        <CTable hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </CTableHeaderCell>
              <CTableHeaderCell className="center-align" scope="col">ห้อง</CTableHeaderCell>
              <CTableHeaderCell className="center-align" scope="col">ค่าเช่า</CTableHeaderCell>
              <CTableHeaderCell className="center-align" scope="col">มิเตอร์ไฟใหม่</CTableHeaderCell>
              <CTableHeaderCell className="center-align" scope="col">มิเตอร์ไฟเก่า</CTableHeaderCell>
              <CTableHeaderCell className="center-align" scope="col">ค่าไฟ</CTableHeaderCell>
              <CTableHeaderCell className="center-align" scope="col">มิเตอร์น้ำใหม่</CTableHeaderCell>
              <CTableHeaderCell className="center-align" scope="col">มิเตอร์น้ำใหม่</CTableHeaderCell>
              <CTableHeaderCell className="center-align" scope="col">ค่าน้ำ</CTableHeaderCell>
              <CTableHeaderCell className="center-align" scope="col">รวม</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.map((item, index) => (
               <CTableRow 
               key={index} 
               onClick={() => handleCheckboxChange(item.roomNo)} // Click handler to toggle checkbox
               style={{ cursor: 'pointer' }} // Add pointer cursor
             >
                <CTableDataCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.roomNo)}
                    onChange={() => handleCheckboxChange(item.roomNo)}
                  />
                </CTableDataCell>
                <CTableDataCell className="center-align">{item.roomNo}</CTableDataCell>
                <CTableDataCell className="center-align">{item.rentPrice}</CTableDataCell>
                <CTableDataCell className="center-align">{item.elecNew}</CTableDataCell>
                <CTableDataCell className="center-align">{item.elecOld}</CTableDataCell>
                <CTableDataCell className="center-align">{item.elecBill}</CTableDataCell>
                <CTableDataCell className="center-align">{item.waterNew}</CTableDataCell>
                <CTableDataCell className="center-align">{item.waterOld}</CTableDataCell>
                <CTableDataCell className="center-align">{item.waterBill}</CTableDataCell>
                <CTableDataCell className="center-align">{item.netBill}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>

    </CCard>
  );
};

export default Rental;