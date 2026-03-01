import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { BACKEND_URL } from "../../config/index";

const Reports = () => {
  const navigate = useNavigate();

  const [chartData, setChartData] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [filteredInvoices, setFilteredInvoices] = useState([]);

const handleSearch = (value) => {

  setSearchTerm(value);

  if (!value.trim()) {
    setFilteredInvoices(invoices);
    return;
  }

  const filtered = invoices.filter(inv =>
    inv.invoiceNo?.toLowerCase().includes(value.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(value.toLowerCase())
  );

  setFilteredInvoices(filtered);
};

const [showResults, setShowResults] = useState(false);

const currentDate = new Date();
const years = Array.from({ length: 5 }, (_, i) =>
    currentDate.getFullYear() - i
  );

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
 const selectedYear = selectedDate.getFullYear();
 const selectedMonth = selectedDate.getMonth() + 1; 
 const selectedDay = selectedDate.getDate();
 const dayInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

 const days = Array.from({ length: dayInMonth }, (_, i) => i + 1);

  const [summary, setSummary] = useState({
     totalSales: 0,
  totalPurchase: 0,
  pAndL: 0,
  totalAmount: 0,
  });
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {

  fetchReports(selectedDate);

  fetchMonthlyChart(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1
  );

}, [selectedDate]);

const fetchReports = async (date = selectedDate) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const res = await axios.get(`${BACKEND_URL}/api/reports?year=${year}&month=${month}`);
  setSummary(res.data.summary);
  setInvoices(res.data.invoices);
  setFilteredInvoices(res.data.invoices);
};
const handleView = (inv) => {
  navigate("/Invoice/Preview", {
    state: {
      invoiceData: inv
    }
  });
};


  const handlePrint = (inv) => {
  navigate("/Invoice/Preview", {
    state: {
      invoiceData: inv,
      autoPrint: true
    }
  });
};

const fetchMonthlyChart = async (year, month) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/api/reports/monthly-chart?year=${year}&month=${month}`
    );
    const monthName = new Date(year, month - 1).toLocaleString("default", { month: "short" });
    const mapped = res.data.map(item => ({
      ...item,
      label: `${monthName} ${item.day}`,
    }));
    
    setChartData(mapped);
  } catch (err) {
    console.error("Chart Fetch Error:", err);
  }
};
const exportToCSV = () => {
  if (!invoices.length) {
    alert("No invoices found");
    return;
  }

  // Helper function to escape CSV fields
  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '';
    const str = String(field);
    // Always wrap in quotes and escape internal quotes
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headers = [
    "Date",
    "Customer Name",
    "Invoice No",
    "Total Amount",
    "Paid Amount",
    "Due Amount"
  ];

  const rows = invoices.map(inv => [
    new Date(inv.date).toLocaleDateString(),
    inv.customer?.name || "N/A",
    inv.invoiceNo || "",
    inv.grandTotal ?? 0,
    inv.paid ?? 0,
    inv.balance ?? 0
  ]);

  // Create CSV content with proper escaping
  const csvRows = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ];
  
  const csvContent = csvRows.join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, `Invoice_Report_${selectedYear}_${selectedMonth}_${selectedDay}.csv`);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_Report_${selectedYear}_${selectedMonth}_${selectedDay}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

  




  return (
    <div style={styles.container}>
      {/* Header with Search and Actions */}
      <div style={styles.headerRow}>
        <div style={styles.titleSection}>
          <h2 style={styles.heading}>Reports</h2>
          <p style={styles.subheading}>Summaries and business analytics</p>
        </div>
        
        <div style={styles.headerActions}>
          <div style={styles.searchWrapper}>
            <input 
              type="text" 
              placeholder="Search Invoice by Invoice NO or Name" 
              style={styles.searchInput} 
              value={searchTerm}
               onChange={(e) => handleSearch(e.target.value)}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          
          <div style={styles.dateSelector}>

<select
  value={selectedMonth}
  onChange={(e) => {
    const newDate = new Date(selectedYear, e.target.value - 1, 1);
    setSelectedDate(newDate);
    fetchReports(newDate);
    fetchMonthlyChart(newDate.getFullYear(), newDate.getMonth() + 1);
  }}
  style={styles.select}
>
  {months.map(m => (
    <option key={m.value} value={m.value}>
      {m.label}
    </option>
  ))}
</select>


<select
  value={selectedYear}
  onChange={(e) => {
    const newDate = new Date(e.target.value, selectedMonth - 1, 1);
    setSelectedDate(newDate);
    fetchReports(newDate);
    fetchMonthlyChart(newDate.getFullYear(), newDate.getMonth() + 1);
  }}
  style={styles.select}
>
  {years.map(y => (
    <option key={y} value={y}>
      {y}
    </option>
  ))}
</select>

</div>

          
          <button style={styles.exportBtn} onClick={exportToCSV}>
            <span style={styles.downloadIcon}>📥</span> Export as CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <SummaryCard title="TOTAL SALE" value={summary.totalSales} icon="💰" color="#60a3a9" />
        <SummaryCard title="TOTAL PURCHASE AMOUNT" value={summary.totalPurchase} icon="💰" color="#60a3a9" />
        <SummaryCard title="P & L" value={summary.pAndL} color="#86a2b8" />
        <SummaryCard title="TOTAL AMOUNT" value={summary.totalAmount} color="#60a3a9" />
      </div>

      {/* Charts Section */}
      <div style={styles.chartsGrid}>
        <ChartBox title="Monthly Sales VS Payments" type="line" data ={chartData} />
        <ChartBox title="Outstanding Due by the Customer" type="bar-horizontal" data={chartData} />
        <ChartBox title="Monthly Revenue Trend" type="bar-vertical"  data={chartData}/>
      </div>

      {/* Invoice Summary Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>Invoice Summary</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Customer Name</th>
              <th style={styles.th}>Invoice No.</th>
              <th style={styles.th}>Paid Amount (₹)</th>
              <th style={styles.th}>Due Amount (₹)</th>
              <th style={styles.th}>Reference ID</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(searchTerm ? filteredInvoices : invoices).map((inv, index)  => (
              <tr key={index} style={styles.tr}>
                <td style={styles.td}>{new Date(inv.date).toLocaleDateString()}</td>
                <td style={{...styles.td, fontWeight: 'bold'}}>
              {inv.customer
              ? inv.customer.isActive === false
              ? <span style={{ color: "red" }}>
             {inv.customer.name} (Inactive)
            </span>
              : inv.customer.name
              : "N/A"}
            </td>
                <td style={styles.td}>{inv.invoiceNo}</td>
                <td style={styles.td}>₹ {(inv.paid || 0).toLocaleString()}</td>
                <td style={styles.td}>₹ {(inv.balance || 0).toLocaleString()}</td>
                <td style={styles.td}> {inv.reference}</td>
                <td style={styles.td}>
                  <button style={styles.actionBtn} onClick={() => handleView(inv)}>👁️</button>
                  <button style={styles.actionBtn} onClick ={() => handlePrint(inv)}>📥</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  );
};

/* ---- Sub-components ---- */

const SummaryCard = ({ title, value, icon, color }) => (
  <div style={{ ...styles.card, backgroundColor: color }}>
    <div style={styles.cardHeader}>
      {icon && <span style={styles.cardIcon}>{icon}</span>}
      <p style={styles.cardTitle}>{title}</p>
    </div>
    <h3 style={styles.cardValue}>₹ {Number(value || 0).toLocaleString()}</h3>
  </div>
);

const ChartBox = ({ title, type, data }) => (
  <div style={styles.chartBox}>
    <p style={styles.chartTitle}>{title}</p>
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer width="100%" height={250}>
        {type === "line" && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" interval={4} tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#4a6b82" strokeWidth={3} name="Total Sales" dot={false}/>
            <Line type="monotone" dataKey="payments" stroke="#40b5ad" strokeWidth={3} name="Payments Received" dot={false}/>
          </LineChart>
        )}

        {type === "bar-horizontal" && (
          <BarChart layout="vertical" data={data.filter(d => d.due > 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="day" type="category" width={40} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="due" fill="#ff7675" name="Outstanding Due" />
          </BarChart>
        )}

        {type === "bar-vertical" && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" interval={4} tick={{ fontSize: 11 }}/>
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#60a3a9" name="Revenue" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);


/* ---- Styles ---- */

const styles = {
  container: { padding: "20px", fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f0f2f5', minHeight: '100vh' },
  // headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' },
  headerRow: { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'flex-start',
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: '25px' 
},
  titleSection: { flex: 1 },
  heading: { margin: 0, fontSize: "32px", fontWeight: "bold" },
  subheading: { margin: 0, fontSize: "14px", color: "#64748b" },
  select: {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginRight: "10px"
},

  
  // headerActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  headerActions: { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '20px',
  flexWrap: "wrap"
},
  searchWrapper: { position: 'relative' },
  // searchInput: { padding: '10px 40px 10px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '300px', outline: 'none' },
  searchInput: { 
  padding: '10px 40px 10px 15px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  width: '100%',
  maxWidth: '300px',
  outline: 'none'
},
  searchIcon: { position: 'absolute', right: '12px', top: '10px', color: '#64748b' },
  dateSelector: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' },
  
  exportBtn: { background: '#4a6b82', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' },
  
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" },
  card: { padding: "20px", borderRadius: "15px", color: "white", boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  cardIcon: { background: 'rgba(255,255,255,0.2)', padding: '5px', borderRadius: '5px' },
  cardTitle: { margin: 0, fontSize: "14px", fontWeight: "600", opacity: 0.9 },
  cardValue: { margin: 0, fontSize: "28px", fontWeight: "bold" },

  chartsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "30px" },
  chartBox: { backgroundColor: "#d1dee2", padding: "15px", borderRadius: "15px", border: '1px solid #94a3b8', minWidth: 0 },
  chartTitle: { fontSize: "14px", fontWeight: "bold", textAlign: 'center', marginBottom: '15px' },
  chartPlaceholder: { height: "200px", background: 'rgba(255,255,255,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  tableCard: { backgroundColor: "#d1dee2", padding: "20px", borderRadius: "15px", border: '1px solid #94a3b8',  overflowX: "auto" },
  tableTitle: { margin: '0 0 15px 0', fontSize: '24px', fontWeight: 'bold' },
  table: { width: "100%", borderCollapse: "collapse" },
  theadRow: { borderBottom: '2px solid #333' },
  th: { padding: "12px", textAlign: "left", fontSize: "14px", color: '#333' },
  tr: { borderBottom: '1px solid #94a3b8' },
  td: { padding: "15px 12px", fontSize: "14px" },
  actionBtn: { background: '#40b5ad', border: 'none', borderRadius: '5px', padding: '5px 8px', marginRight: '5px', cursor: 'pointer' },
};

export default Reports;