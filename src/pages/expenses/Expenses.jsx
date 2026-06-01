import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config/index.js";
import toast from "react-hot-toast";


const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  const [form, setForm] = useState({
    category: "",
    description: "",
    vendor: "",
    amount: "",
    paymentMode: "Cash",
    date: new Date().toISOString().split("T")[0]
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentDate = new Date();
  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);
  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" },
    { value: 3, label: "March" }, { value: 4, label: "April" },
    { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" },
    { value: 9, label: "September" }, { value: 10, label: "October" },
    { value: 11, label: "November" }, { value: 12, label: "December" },
  ];
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth() + 1;

  useEffect(() => {
    fetchExpenses(selectedDate);
  }, [selectedDate]);

  const fetchExpenses = async (date = selectedDate) => {
    try {

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BACKEND_URL}/api/expenses?year=${year}&month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setExpenses(res.data);

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to load expenses"
      );

    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      await axios.post(
        `${BACKEND_URL}/api/expenses`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(
        "Expense added successfully"
      );

      fetchExpenses();

      setForm({
        category: "",
        description: "",
        vendor: "",
        amount: "",
        paymentMode: "Cash",
        date: new Date().toISOString().split("T")[0]
      });

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to add expense"
      );

    }
  };

 const openEditModal = (expense) => {
    setEditingExpense({ ...expense });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingExpense({ ...editingExpense, [name]: value });
  };

  const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${BACKEND_URL}/api/expenses/${editingExpense._id}`,
      editingExpense,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchExpenses(); // refresh data
    setIsEditModalOpen(false);
    toast.success(
      "Expense updated successfully"
    );
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
      "Failed to update expense"
    );
  }
};


  const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `${BACKEND_URL}/api/expenses/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    fetchExpenses(); // refresh list from DB
    toast.success(
      "Expense deleted successfully"
    );
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
      "Failed to delete expense"
    );
  }
};


// Total Expenses
const totalExpenses = expenses.reduce(
  (sum, item) => sum + Number(item.amount),
  0
);

// Inventory Purchase Total
const inventoryTotal = expenses
  .filter((item) => item.category === "Inventory Purchase")
  .reduce((sum, item) => sum + Number(item.amount), 0);

// Operational Total
const operationalTotal = expenses
  .filter((item) => item.category === "Operational")
  .reduce((sum, item) => sum + Number(item.amount), 0);

const filteredExpenses = expenses.filter((expense) => {
  const term = searchTerm.toLowerCase();

  return (
    expense.category?.toLowerCase().includes(term) ||
    expense.description?.toLowerCase().includes(term) ||
    expense.vendor?.toLowerCase().includes(term) ||
    expense.paymentMode?.toLowerCase().includes(term) ||
    expense.amount?.toString().includes(term) ||
    new Date(expense.date)
      .toLocaleDateString("en-GB")
      .includes(term)
  );
});

const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

const paginatedExpenses = filteredExpenses.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  return (
    <div style={styles.container}>
      {/* Header with Search */}
      <div style={styles.headerRow}>
        <div style={styles.titleSection}>
          <h2 style={styles.heading}>Expenses Manager</h2>
          <p style={styles.subheading}>Track your all Expenses</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedMonth}
            onChange={(e) => {
              const newDate = new Date(selectedYear, e.target.value - 1, 1);
              setSelectedDate(newDate);
            }}
            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => {
              const newDate = new Date(e.target.value, selectedMonth - 1, 1);
              setSelectedDate(newDate);
            }}
            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div style={styles.searchWrapper}>
          <input 
            type="text" 
            placeholder="Search Expenses by Category, Vendor, Amount..." 
            style={styles.searchInput} 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* Left: Add Expense Form */}
        <div style={styles.formCard}>
          <h3 style={styles.cardTitle}>Add Expenses</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroupRow}>
              <div style={styles.field}>
                <label style={styles.label}>Expenses Category</label>
                <select name="category" value={form.category} onChange={handleChange} style={styles.select}>
                  <option value="">Select Category</option>
                  <option value="Inventory Purchase">Inventory Purchase</option>
                  <option value="Operational">Operational</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} style={styles.input} />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <input name="description" value={form.description} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.inputGroupRow}>
              <div style={styles.field}>
                <label style={styles.label}>Vendor/ Supplier</label>
                <input name="vendor" value={form.vendor} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Payment Mode</label>
                <select name="paymentMode" value={form.paymentMode} onChange={handleChange} style={styles.select}>
                  <option>Cash</option>
                  <option>UPI</option>
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Amount (₹)</label>
              <input name="amount" type="number" value={form.amount} onChange={handleChange} style={styles.input} />
            </div>

            <button type="submit" style={styles.saveBtn}>Add Expenses</button>
          </form>
        </div>

        {/* Right: Summary Cards */}
        <div style={styles.summaryGrid}>
          <div style={styles.statCard}>
             <div style={styles.statIcon}>💰</div>
             <div style={styles.statText}>
                <p style={styles.statTitle}>Total Expenses <br/><span style={styles.statSub}>THIS MONTH</span></p>
                <h2 style={{...styles.statValue, color: '#ef4444'}}>₹ {totalExpenses.toLocaleString()}
</h2>
             </div>
          </div>
          <div style={styles.statCard}>
             <div style={styles.statIcon}>📦</div>
             <div style={styles.statText}>
                <p style={styles.statTitle}>Inventory Purchase <br/><span style={styles.statSub}>Expenses</span></p>
                <h2 style={{...styles.statValue, color: '#ef4444'}}>₹ {inventoryTotal.toLocaleString()}
</h2>
             </div>
          </div>
          <div style={styles.statCard}>
             <div style={styles.statText}>
                <p style={{...styles.statTitle, textAlign: 'center'}}>Operational Expense</p>
                <h2 style={{...styles.statValue, color: '#ef4444', textAlign: 'center'}}>₹ {operationalTotal.toLocaleString()}
</h2>
             </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div style={styles.tableCard}>
        <h3 style={styles.cardTitle}>Invoice Summary</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Expenses Category</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Vendor/ Supplier</th>
              <th style={styles.th}>Amount (₹)</th>
              <th style={styles.th}>Payment mode</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    fontWeight: "bold"
                  }}
                >
                  No expenses found
                </td>
              </tr>
            ) : (
              paginatedExpenses.map((e) => (
                <tr key={e._id} style={styles.tr}>
                <td style={styles.td}> {new Date(e.date).toLocaleDateString("en-GB")}</td>
                <td style={{...styles.td, fontWeight: 'bold'}}>{e.category}</td>
                <td style={styles.td}>{e.description}</td>
                <td style={styles.td}>{e.vendor}</td>
                <td style={styles.td}>₹ {e.amount.toLocaleString()}</td>
                <td style={styles.td}>{e.paymentMode}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => openEditModal(e)}>✎</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(e._id)}>🗑</button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
        {totalPages > 1 && (
  <div style={styles.pagination}>
    <button style={{...styles.pageBtn, opacity: currentPage === 1 ? 0.4 : 1}} onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
    <button style={{...styles.pageBtn, opacity: currentPage === 1 ? 0.4 : 1}} onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>

    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
      .reduce((acc, page, idx, arr) => {
        if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
        acc.push(page);
        return acc;
      }, [])
      .map((item, idx) =>
        item === "..." ? (
          <span key={`dots-${idx}`} style={styles.pageDots}>…</span>
        ) : (
          <button key={item} style={{...styles.pageBtn, background: currentPage === item ? "linear-gradient(to right, #2d5a61, #4a6b82)" : "white", color: currentPage === item ? "white" : "#333"}} onClick={() => setCurrentPage(item)}>{item}</button>
        )
      )}

    <button style={{...styles.pageBtn, opacity: currentPage === totalPages ? 0.4 : 1}} onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
    <button style={{...styles.pageBtn, opacity: currentPage === totalPages ? 0.4 : 1}} onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
    <span style={styles.pageInfo}>Page {currentPage} of {totalPages} &nbsp;|&nbsp; {filteredExpenses.length} records</span>
  </div>
)}
      </div>
            {/* --- POP-UP MODAL SECTION --- */}
      {isEditModalOpen && editingExpense && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modalContainer}>
            <div style={modalStyles.header}>
              <h3 style={modalStyles.title}>Edit Invoice</h3>
              <button style={modalStyles.closeX} onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleUpdate} style={modalStyles.modalForm}>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>Expenses Category</label>
                <input name="category" value={editingExpense.category} onChange={handleEditChange} style={modalStyles.modalInput} />
              </div>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>Description</label>
                <input name="description" value={editingExpense.description} onChange={handleEditChange} style={modalStyles.modalInput} />
              </div>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>Vendor/ Supplier</label>
                <input name="vendor" value={editingExpense.vendor} onChange={handleEditChange} style={modalStyles.modalInput} />
              </div>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>Amount (₹)</label>
                <input name="amount" type="number" value={editingExpense.amount} onChange={handleEditChange} style={modalStyles.modalInput} />
              </div>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>Date</label>
                <input type="date" name="date" value={editingExpense.date} onChange={handleEditChange} style={modalStyles.modalInput} />
              </div>
              <button type="submit" style={modalStyles.saveBtn}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const styles = {
  editBtn: { backgroundColor: "#4fd1c5", color: "#fff", border: "none", borderRadius: "5px", padding: "6px 10px", cursor: "pointer" },
  deleteBtn: { backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "5px", padding: "6px 10px", cursor: "pointer" },
  actionCell: { display: "flex", gap: "10px", justifyContent: "center", padding: "15px 0" },
  // container: { padding: "20px", fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f0f2f5', minHeight: '100vh' },
  container: { 
  padding: "20px", 
  fontFamily: "'Segoe UI', sans-serif", 
  backgroundColor: '#f0f2f5', 
  minHeight: '100vh',
  width: "100%",
  overflowX: "hidden"
},
  // headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  headerRow: { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: '20px' 
},
  heading: { margin: 0, fontSize: "28px", fontWeight: "bold" },
  subheading: { margin: 0, fontSize: "14px", color: "#64748b" },
  searchWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  // searchInput: { padding: '10px 40px 10px 15px', borderRadius: '25px', border: '1px solid #cbd5e1', width: '350px', outline: 'none' },
  searchInput: { 
  padding: '10px 40px 10px 15px', 
  borderRadius: '25px', 
  border: '1px solid #cbd5e1', 
  width: '100%',
  maxWidth: '350px',
  outline: 'none' 
},
  searchIcon: { position: 'absolute', right: '15px', color: '#64748b' },
  
  mainLayout: { display: 'flex', gap: '20px', marginBottom: '30px',  flexWrap: "wrap" },
  formCard: { flex: 1, backgroundColor: "#d1dee2", padding: "20px", borderRadius: "15px", border: '1px solid #94a3b8' },
  cardTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' },
  
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroupRow: { display: 'flex', gap: '15px', flexWrap: "wrap"
 },
  field: { flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '600' },
  input: { padding: '10px', borderRadius: '10px', border: '1px solid #333', background: '#ffffff33', outline: 'none' },
  select: { padding: '10px', borderRadius: '10px', border: '1px solid #333', background: '#ffffff33', outline: 'none' },
  saveBtn: { background: "linear-gradient(to right, #2d5a61, #4a6b82)", color: "white", padding: "10px", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", width: '150px', alignSelf: 'center' },

  summaryGrid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' },
  statCard: { backgroundColor: '#d1dee2', padding: '15px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #94a3b8',  minWidth: "0" },
  statIcon: { background: '#fff', padding: '10px', borderRadius: '10px', fontSize: '20px' },
  statText: {
  flex: 1,
  minWidth: 0
},
  statTitle: { margin: 0, fontSize: '14px', fontWeight: 'bold', 
  lineHeight: "1.3" },
  statSub: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase' },
  statValue: { margin: '5px 0 0 0', fontSize: '22px' },

  tableCard: { backgroundColor: "#d1dee2", padding: "20px", borderRadius: "15px", border: '1px solid #94a3b8',  overflowX: "auto"},
  table: { width: "100%", borderCollapse: "collapse" },
  theadRow: { borderBottom: '2px solid #333' },
  th: { padding: "12px", textAlign: "left", fontSize: "14px", color: '#333' },
  tr: { borderBottom: '1px solid #94a3b8' },
  td: { padding: "12px", fontSize: "14px" },
  actionBtn: { background: '#40b5ad', border: 'none', borderRadius: '5px', padding: '5px 8px', marginRight: '5px', cursor: 'pointer' },
  pagination: { display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "8px", marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #94a3b8" },
  pageBtn: { padding: "8px 14px", border: "1px solid #94a3b8", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", background: "white", color: "#333", transition: "0.2s", minWidth: "38px" },
  pageDots: { padding: "6px 4px", fontSize: "16px", color: "#555" },
  pageInfo: { fontSize: "13px", color: "#444", marginLeft: "8px" },
};
// --- Pop-up Specific Styles (Based on image_c6fd18.jpg) ---
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000
  },
  // modalContainer: {
  //   width: "400px",
  //   backgroundColor: "#89abb1",
  //   padding: "30px",
  //   borderRadius: "20px",
  //   boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  //   border: "1px solid #333"
  // },
  modalContainer: {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "#89abb1",
  padding: "30px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  border: "1px solid #333"
},
  header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  title: { margin: 0, color: "#01292f" },
  closeX: { background: "none", border: "none", fontSize: "20px", cursor: "pointer" },
  modalForm: { display: "flex", flexDirection: "column", gap: "12px" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", fontWeight: "bold", color: "#01292f" },
  modalInput: { padding: "10px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "rgba(255,255,255,0.4)" },
  saveBtn: { backgroundColor: "#2d5a61", color: "#fff", padding: "12px", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
};


export default Expenses;