import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config/index.js";

const Payments = () => {
  const [isReturn, setIsReturn] = useState(false);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const token = localStorage.getItem("token");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
  customerId: "",
  invoiceId: "",
  gstin: "",
  date: new Date().toISOString().split("T")[0],
  amount: "",
  paymentMode: "cash",   // must match backend enum
  reference: "",
});

 
  useEffect(() => {
    fetchPayments();
  }, [isReturn]);

  useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/customers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Customer fetch error:", error);
    }
  };

  fetchCustomers();
}, []);

useEffect(() => {
  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/invoices`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    }
  };

  fetchInvoices();
}, []);



  

  const fetchPayments = async () => {
  const res = await axios.get(
    `${BACKEND_URL}/api/payments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const filtered = res.data.filter(
    (p) => p.type === (isReturn ? "return" : "payment")
  );

  setPayments(filtered);
};

const [filteredInvoices, setFilteredInvoices] = useState([]);




  /* ---- Handlers ---- */
const handleCustomerChange = (e) => {
  const customerId = e.target.value;
  const customer = customers.find((c) => c._id === customerId);

  // Filter invoices of selected customer
  const customerInvoices = invoices.filter(
    (inv) => inv.customerId?._id === customerId
  );

  setForm({
    ...form,
    customerId,
    invoiceId: "",   // reset invoice when customer changes
    gstin: customer?.gstin || "",
  });

  setFilteredInvoices(customerInvoices);
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.customerId || !form.invoiceId || !form.amount) {
    alert("Please fill required fields");
    return;
  }

  try {
    await axios.post(
      `${BACKEND_URL}/api/payments`,
      {
        customerId: form.customerId,
        invoiceId: form.invoiceId,
        gstin: form.gstin || "",
        amount: Number(form.amount),
        type: isReturn ? "return" : "payment",
        paymentMode: form.paymentMode,
        reference: form.reference,
        date: form.date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // alert("Transaction Recorded Successfully");

    fetchPayments();

    setForm({
      customerId: "",
      invoiceId: "",
      gstin: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      paymentMode: "cash",
      reference: "",
    });

  } catch (error) {
    console.error(error);
    alert("Failed to save transaction");
  }
};


  const openEditModal = (payment) => {
    setEditData({ _id: payment._id,
    customerName: payment.customerId?.name || "",
    invoiceNumber: payment.invoiceId?.invoiceNumber || "",
    amount: payment.amount,
    paymentMode: payment.paymentMode,
    reference: payment.reference, });
    setIsModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
    ...prev,
    [name]: value,
  }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    await axios.put(
      `${BACKEND_URL}/api/payments/${editData._id}`,
      {
        amount: Number(editData.amount),
        paymentMode: editData.paymentMode,
        reference: editData.reference,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
      },
      }
    );

    alert("Transaction Updated Successfully");

    setIsModalOpen(false);
    fetchPayments();
  };

  return (
    <div style={styles.container}>
      {/* Header Row */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Payments/ Returns</h2>
          <p style={styles.subheading}>Record Customer Payments/ Returns And Manage Balances</p>
        </div>

        {/* Updated Toggle Bar with Sliding Switch */}
        <div style={styles.toggleContainer}>
          <button 
            style={{...styles.toggleBtn, background: !isReturn ? "linear-gradient(to right, #4a9ca3, #86a2b8)" : "#808080"}} 
            onClick={() => setIsReturn(false)}
          >
            Payment
          </button>
          
          {/* The Sliding Toggle Switch */}
          <div 
            style={styles.switchWrapper} 
            onClick={() => setIsReturn(!isReturn)}
          >
            <div style={{
              ...styles.switchHandle,
              left: isReturn ? "26px" : "4px"
            }} />
          </div>

          <button 
            style={{...styles.toggleBtn, background: isReturn ? "linear-gradient(to right, #4a9ca3, #86a2b8)" : "#808080"}} 
            onClick={() => setIsReturn(true)}
          >
            Return
          </button>
        </div>
      </div>

      {/* Record Section */}
      <div style={styles.recordCard}>
        <h3 style={styles.cardTitle}>{isReturn ? "Record Return" : "Record Payments"}</h3>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Customer Name</label>
              <select name="customerId" style={styles.input} value={form.customerId} onChange={handleCustomerChange}>
                <option value="">Select Customer</option>
               {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Customer GSTIN</label>
              <input style={styles.input} value={form.gstin} readOnly />
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Invoice No.</label>
              <select name="invoiceId" style={styles.input} value={form.invoiceId} onChange={handleChange}>
                <option value="">Select Invoice</option>
                 {filteredInvoices.map((inv) => (
                  <option key={inv._id} value={inv._id}>
                    {inv.invoiceNumber}
                  </option>
                ))}
              </select>
            </div>
            <div style={{...styles.inputGroup, maxWidth: '150px'}}>
              <label style={styles.label}>Date</label>
              <input type="date" name="date" style={styles.input} value={form.date} onChange={handleChange} />
            </div>
          </div>

          <div style={styles.formGridThird}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount (₹)</label>
              <input name="amount" type="number" style={styles.input} value={form.amount} onChange={handleChange} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Payment Mode</label>
              <div style={styles.radioGroup}>
                <label><input type="radio" name="paymentMode" value="cash" checked={form.paymentMode === "cash"} onChange={handleChange} /> Cash</label>
                <label><input type="radio" name="paymentMode" value="upi" checked={form.paymentMode === "upi"} onChange={handleChange} /> UPI</label>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Reference ID</label>
              <input name="reference" style={styles.input} value={form.reference} onChange={handleChange} />
            </div>
          </div>

          <div style={{textAlign: 'center', marginTop: '20px'}}>
            <button type="submit" style={styles.recordBtn}>+ Record Transaction</button>
          </div>
        </form>
      </div>

      {/* Recent Table Section */}
      <div style={styles.tableCard}>
        <h3 style={styles.cardTitle}>{isReturn ? "Recent Returns" : "Recent Payments"}</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Customer Name</th>
              <th style={styles.th}>Invoice No.</th>
              <th style={styles.th}>Amount (₹)</th>
              <th style={styles.th}>Payment Mode</th>
              <th style={styles.th}>Reference ID</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td style={styles.td}>{new Date(p.date).toLocaleDateString()}</td>
                <td style={{...styles.td, fontWeight: 'bold'}}>{p.customerId?.name}</td>
                <td style={styles.td}>{p.invoiceId?.invoiceNumber}</td>
                <td style={styles.td}>₹ {p.amount.toLocaleString()}</td>
                <td style={styles.td}>{p.paymentMode}</td>
                <td style={styles.td}>{p.reference}</td>
                <td style={styles.td}><button style={styles.editBtn} onClick={() => openEditModal(p)}>✎</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editData && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Edit Payments/ Returns</h3>
                <button style={styles.closeBtn} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} style={styles.form}>
               <div style={styles.modalInputGroup}>
                  <label style={styles.modalLabel}>Customer Name</label>
                  <input style={styles.modalInput} value={editData.customerName} readOnly />
               </div>
               <div style={styles.modalInputGroup}>
                  <label style={styles.modalLabel}>Invoice No.</label>
                  <input style={styles.modalInput} value={editData.invoiceNumber} readOnly />
               </div>
               <div style={styles.modalInputGroup}>
                  <label style={styles.modalLabel}>Reference ID</label>
                  <input name="reference" style={styles.modalInput} value={editData.reference} onChange={handleModalChange} />
               </div>
               <div style={styles.modalInputGroup}>
                  <label style={styles.modalLabel}>Amount (₹)</label>
                  <input name="amount" type="number" style={styles.modalInput} value={editData.amount} onChange={handleModalChange} />
               </div>
               <div style={styles.modalInputGroup}>
                  <label style={styles.modalLabel}>Payment Mode</label>
                  <select name="mode" style={styles.modalInput} value={editData.paymentMode} onChange={handleModalChange}>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                  </select>
               </div>
               <div style={styles.modalActions}>
                  <button type="submit" style={styles.saveBtn}>Save Customer</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---- Styles ---- */

const styles = {
  container: { padding: "20px", fontFamily: 'serif',  width: "100%",
  overflowX: "hidden" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start",   flexWrap: "wrap",
  gap: "15px",marginBottom: "20px" },
  heading: { margin: 0, fontSize: "28px", fontWeight: "bold" },
  subheading: { margin: 0, fontSize: "14px", color: "#333" },
  toggleContainer: { display: "flex", alignItems: "center", gap: "10px",  flexWrap: "wrap" },
  toggleBtn: { padding: "10px 25px", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "16px", transition: '0.3s' },
  
  // Custom sliding switch styling
  switchWrapper: { 
    width: "55px", 
    height: "28px", 
    background: "#fff", 
    border: "2.5px solid #333", 
    borderRadius: "20px", 
    position: "relative",
    cursor: 'pointer'
  },
  switchHandle: {
    width: "20px",
    height: "20px",
    background: "#333",
    borderRadius: "50%",
    position: "absolute",
    top: "1.5px",
    transition: "left 0.3s ease"
  },

  recordCard: { 
    backgroundColor: "#d1dee2", 
    padding: "20px", 
    borderRadius: "15px", 
    border: "1px solid #94a3b8", 
    marginBottom: "30px" 
  },
  cardTitle: { 
    fontSize: "20px", 
    fontWeight: "bold", 
    borderBottom: "2px solid #333", 
    paddingBottom: "5px", 
    marginBottom: "20px" 
  },
  formGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
    gap: "20px", 
    marginBottom: "15px" 
  },
  formGridThird: { 
    display: "grid", 
    gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", 
    gap: "20px" 
  },
  inputGroup: {
     display: "flex",
     flexDirection: "column" 
  },
  label: { 
    fontSize: "13px", 
    fontWeight: "bold", 
    color: "#444", 
    marginBottom: "4px", 
    marginLeft: "10px"
 },
  input: { 
    padding: "8px 15px", 
    borderRadius: "20px", 
    border: "1px solid #333", 
    background: "white", 
    outline: 'none' 
  },
  radioGroup: { 
    display: "flex", 
    gap: "20px", 
    padding: "8px", 
    fontSize: "18px", 
    fontWeight: 'bold' 
  },
  recordBtn: { 
    background: "linear-gradient(to right, #2d5a61, #4a6b82)", 
    color: "white", 
    padding: "10px 30px", 
    border: "none", 
    borderRadius: "10px", 
    fontWeight: "bold", 
    cursor: "pointer" 
  },
  tableCard: { 
    backgroundColor: "#d1dee2", 
    padding: "20px", 
    borderRadius: "15px", 
    border: "1px solid #94a3b8",
    overflowX: "auto" 
  },
  table: { 
    width: "100%", 
    borderCollapse: "collapse" 
  },
  th: { 
    padding: "10px", 
    textAlign: "left", 
    fontSize: "14px", 
    borderBottom: "2px solid #333" 
  },
  td: {
  padding: "12px 10px", 
  fontSize: "14px", 
  borderBottom: "1px solid #94a3b8" 
},
  editBtn: { 
    background: "#40b5ad", 
    border: "none", 
    padding: "5px 8px", 
    borderRadius: "5px", 
    cursor: "pointer"
  },
  
  overlay: { 
    position: "fixed", 
    inset: 0, 
    background: "rgba(0,0,0,0.5)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    zIndex: 100 
  },
  modal: { 
    background: "linear-gradient(135deg, #60a3a9 0%, #86a2b8 100%)", 
    padding: "25px", 
    borderRadius: "12px", 
    width: "450px",
    maxWidth: "450px", 
    border: "1px solid #000" 
  },
  modalHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "20px" 
  },
  modalTitle: { 
    margin: 0, 
    fontSize: "20px", 
    fontWeight: "bold", 
    color: "#000" 
  },
  closeBtn: { 
    background: "none", 
    border: "none", 
    fontSize: "20px", 
    cursor: "pointer" 
  },
  modalInputGroup: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "5px", 
    marginBottom: '10px' 
  },
  modalLabel: { 
    fontSize: "14px", 
    fontWeight: "bold", 
    color: "#000" 
  },
  modalInput: {
   padding: "10px 15px", 
   borderRadius: "10px", 
   border: "1.5px solid #000", 
   outline: "none", 
   backgroundColor: "#ffffff44", 
   color: "#000", 
   fontWeight: "bold" 
  },
  modalActions: { 
    display: "flex", 
    justifyContent: "flex-end", 
    marginTop: "15px" 
  },
  saveBtn: { 
    padding: "10px 25px", 
    border: "none", 
    background: "linear-gradient(to right, #2d5a61, #4a6b82)", 
    color: "white", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontWeight: "bold" 
  },
};

export default Payments;