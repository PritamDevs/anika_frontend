

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { BACKEND_URL } from "../../config/index.js";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleAddInvoice = () => {
    navigate("/invoice/create");
  };

  const [stats, setStats] = useState({
    totalSales: 0,
    outstanding: 0,
    totalCustomers: 0,
    openInvoices: 0,
  });



  const [lowStockData, setLowStockData] = useState([]);
  // Sample data for the Low Stock Alerts table
 
  const currentYear = new Date().getFullYear();

const [selectedYear, setSelectedYear] = useState(currentYear);
const [availableYears, setAvailableYears] = useState([currentYear]);


const [monthlySales, setMonthlySales] = useState([]);
const [topCustomers, setTopCustomers] = useState([]);



 useEffect(() => {
  fetchDashboardData();
  fetchMonthlySales(selectedYear);
fetchTopCustomers();

}, []);
const fetchMonthlySales = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/dashboard/monthly-sales`);
    const data = await res.json();
    setMonthlySales(data);
  } catch (err) {
    console.error("Monthly Sales Error:", err);
  }
};

const fetchTopCustomers = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/dashboard/top-customers`);
    const data = await res.json();
    setTopCustomers(data);
  } catch (err) {
    console.error("Top Customers Error:", err);
  }
};



const fetchDashboardData = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/dashboard`); 
    const data = await res.json();

    setStats({
      totalSales: data.totalSales,
      outstanding: data.outstanding,
      totalCustomers: data.totalCustomers,
      openInvoices: data.openInvoices
    });

    setLowStockData(data.lowStockProducts);

  } catch (error) {
    console.error("Dashboard fetch error:", error);
  }
};

const formatCurrency = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN")}`;



  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Dashboard</h2>
          <p style={styles.subheading}>
            Welcome back! Here’s an overview of your Business
          </p>
        </div>
        <button onClick={handleAddInvoice} style={styles.addInvoiceBtn}>
          + Add Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.cardGrid}>
        <StatCard title="TOTAL SALES" subtitle="THIS MONTH" value={`₹ ${stats.totalSales.toLocaleString("en-IN")}`} icon="🪄" valueColor="#9ae6b4" />
        <StatCard title="OUSTANDING" subtitle="THIS MONTH" value={`₹ ${stats.outstanding.toLocaleString("en-IN")}`}  icon="🕒" valueColor="#ef4444" />
        <StatCard title="TOTAL CUSTOMER" subtitle="OVERALL" value={stats.totalCustomers}  icon="👥" valueColor="#9ae6b4" />
        <StatCard title="OPEN INVOICE" subtitle="THIS MONTH PENDING" value={stats.openInvoices}  icon="📋" valueColor="#ef4444" />
      </div>

      {/* Main Content Layout */}
      <div style={styles.chartsLayout}>
        {/* Left Column: Charts */}
        <div style={styles.leftColumn}>
          <ChartBox title="Monthly Sales Performance" height="300px">
            <div style={{ textAlign: "right", marginBottom: "10px" }}>
    <select
      value={selectedYear}
      onChange={(e) => {
        const year = e.target.value;
        setSelectedYear(year);
        fetchMonthlySales(year);
      }}
      style={{
        padding: "5px 10px",
        borderRadius: "8px",
        border: "none",
        fontWeight: "bold"
      }}
    >
      {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={monthlySales}>
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
      <XAxis dataKey="month" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip
  formatter={(value) => formatCurrency(value)}
  contentStyle={{
    backgroundColor: "#1e293b",
    border: "none",
    borderRadius: "10px",
    color: "#fff"
  }}
/>

      <Line
        type="monotone"
  dataKey="total"
  stroke="#ffffff"
  strokeWidth={2}
  animationDuration={1000}
  animationEasing="ease-in-out"
      />
    </LineChart>
  </ResponsiveContainer>
</ChartBox>
          <ChartBox title="Top 10 Customers" height="300px">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={topCustomers}>
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
      <XAxis dataKey="name" stroke="#fff" />
      <YAxis stroke="#fff" />
     <Tooltip
  formatter={(value) => formatCurrency(value)}
  contentStyle={{
    backgroundColor: "#1e293b",
    border: "none",
    borderRadius: "10px",
    color: "#fff"
  }}
/>

      <Bar dataKey="totalPurchase"
  fill="#ffffff"
  animationDuration={1000}
  animationEasing="ease-in-out" />
    </BarChart>
  </ResponsiveContainer>
</ChartBox>

        </div>

        {/* Right Column: Low Stock Alerts Table */}
        <div style={styles.rightColumn}>
          <div style={styles.alertCard}>
            <div style={styles.alertHeader}>
              <h3 style={styles.alertTitle}>Low Stock Alerts</h3>
              <span style={styles.alertIcon}>⚠️</span>
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>SL.</th>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Rate</th>
                  <th style={styles.th}>Discount%</th>
                  <th style={styles.th}>Stock Qty</th>
                </tr>
              </thead>
              <tbody>
                {lowStockData.map((item, index) => (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{item.name}</td>
                    <td style={styles.td}>{item.rate}</td>
                    <td style={styles.td}>{item.discount}%</td>
                    <td style={styles.td}>{item.stockQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Reusable Components --- */

const StatCard = ({ title, subtitle, value, icon, valueColor }) => (
  <div style={styles.card}>
    <div style={styles.cardIcon}>{icon}</div>
    <div style={styles.cardContent}>
      <p style={styles.cardTitle}>{title}</p>
      <h3 style={{ ...styles.cardValue, color: valueColor }}>{value}</h3>
      <p style={styles.cardSubtitle}>{subtitle}</p>
    </div>
  </div>
);

const ChartBox = ({ title, height, children }) => (
  <div style={{ ...styles.chartBox, height: height }}>
    <p style={styles.chartTitle}>{title}</p>
    <div style={styles.chartPlaceholder}>
      {children}
    </div>
  </div>
);


/* --- Styles --- */

const styles = {
  // container: { padding: "30px", backgroundColor: "#f0f2f5", minHeight: "100vh" },
  container: {
  padding: "30px",
  backgroundColor: "#f0f2f5",
  minHeight: "100vh",
  width: "100%",
  overflowX: "hidden",
},
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  heading: { margin: 0, fontSize: "32px", fontWeight: "700" },
  subheading: { margin: 0, color: "#64748b", fontSize: "14px" },
  addInvoiceBtn: {
    backgroundColor: "#40b5ad",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  // cardGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginBottom: "30px" },
  cardGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
  marginBottom: "30px",
},
  card: {
    background: "linear-gradient(to right, #608d9b, #86a2b8)",
    padding: "15px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    color: "white",
    border: "1px solid #94a3b8"
  },
  cardIcon: {
    background: "rgba(255, 255, 255, 0.2)",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "20px",
    marginRight: "15px",
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  cardTitle: { margin: 0, fontSize: "12px", fontWeight: "bold" },
  cardValue: { margin: "5px 0", fontSize: "22px", fontWeight: "700" },
  cardSubtitle: { margin: 0, fontSize: "11px", textTransform: 'uppercase' },

  // chartsLayout: { display: "flex", gap: "20px" },
  chartsLayout: {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
},
  // leftColumn: { flex: "1.2", display: "flex", flexDirection: "column", gap: "20px" },
  // rightColumn: { flex: "1" },
  leftColumn: {
  flex: "1 1 500px",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "20px",
},

rightColumn: {
  flex: "1 1 350px",
  minWidth: 0,
},

  chartBox: {
    background: "linear-gradient(160deg, #2d5a61, #4a6b82)",
    padding: "20px",
    borderRadius: "15px",
    color: "white",
  },
  chartTitle: { fontSize: "16px", fontWeight: "600", textAlign: "center", marginBottom: "15px" },
  chartPlaceholder: {
    height: "100%",
    minHeight: "250px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.3)",
    border: "1px dashed rgba(255,255,255,0.2)",
    borderRadius: "10px",
  },

  /* Table Specific Styles (Matching image_d17182.jpg) */
  alertCard: {
    minHeight: "400px",
    height: "auto",
    overflowX: "auto",
    background: "linear-gradient(160deg, #6294a0, #7ca1b4)",
    borderRadius: "15px",
    padding: "20px",
    color: "#000",
    border: "1px solid #94a3b8"
  },
  alertHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  alertTitle: { margin: 0, fontSize: "18px", fontWeight: "bold" },
  alertIcon: { color: "#ef4444", fontSize: "24px" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeader: { borderBottom: "1px solid #333" },
  th: { textAlign: "left", padding: "12px 8px", fontSize: "13px", fontWeight: "bold" },
  tr: { borderBottom: "1px solid rgba(0,0,0,0.1)" },
  td: { padding: "12px 8px", fontSize: "13px" },
};

export default Dashboard;