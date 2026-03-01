import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../config/index.js";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    totalPurchase: 0,
    paid: 0
  });

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCustomers(data);
    } catch {
      alert("Failed to load customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  /* ================= HANDLERS ================= */
  const openAddModal = () => {
    setEditCustomer(null);
    setFormData({ name: "", contact: "", address: "", totalPurchase: 0, paid: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditCustomer(customer);
    setFormData({
      name: customer.name,
      contact: customer.contact,
      address: customer.address,
      totalPurchase: customer.totalPurchase,
      paid: customer.totalPaid
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await fetch(`${BACKEND_URL}/api/customers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCustomers();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.contact) {
      alert("Name & Contact required");
      return;
    }

    const url = editCustomer
      ? `${BACKEND_URL}/api/customers/${editCustomer._id}`
      : `${BACKEND_URL}/api/customers/add`;

    const method = editCustomer ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    setIsModalOpen(false);
    fetchCustomers();
  };

  const exportCustomersToCSV = () => {
  if (!filteredCustomers.length) {
    alert("No customers found");
    return;
  }

  const escapeCSV = (field) => {
    if (field === null || field === undefined) return "";
    const str = String(field);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headers = [
    "Name",
    "Contact",
    "Address",
    "Total Purchase",
    "Total Paid",
    "Due Amount"
  ];

  const rows = filteredCustomers.map(c => [
    c.name,
    c.contact,
    c.address || "",
    c.totalPurchase ?? 0,
    c.totalPaid ?? 0,
    c.dueAmount ?? 0
  ]);

  const csvRows = [
    headers.map(escapeCSV).join(","),
    ...rows.map(row => row.map(escapeCSV).join(","))
  ];

  const csvContent = csvRows.join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "Customer_List.csv";
  link.click();
};

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.heading}>Customer List</h2>
          <p style={styles.subheading}>Manage your Customer Account</p>
        </div>

        <div style={styles.headerRight}>
          <input
            placeholder="Search Customer by Name"
            style={styles.search}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={styles.addButton} onClick={openAddModal}>
            + Add Customer
          </button>
          <button style={styles.exportBtn} onClick={exportCustomersToCSV}>
          📥 Export CSV
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>SL</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Total Purchase</th>
              <th style={styles.th}>Paid</th>
              <th style={styles.th}>Due</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c, i) => (
              <tr key={c._id}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{c.name}</td>
                <td style={styles.td}>{c.contact}</td>
                <td style={styles.td}>₹ {c.totalPurchase}</td>
                <td style={styles.td}>₹ {c.totalPaid}</td>
                <td style={{ ...styles.td, ...styles.dueHighlight }}>
                  ₹ {c.dueAmount}
                </td>
                <td style={styles.actionCell}>
                  <div style ={styles.actionButtons}>
                    <button style={styles.editBtn} onClick={() => openEditModal(c)}>✎</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(c._id)}>🗑</button>
                  </div>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div style={styles.emptyState}>No customers found</div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <form onSubmit={handleSave} style={styles.form}>
              <input
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
              />
              <input
                placeholder="Contact"
                value={formData.contact}
                onChange={e => setFormData({ ...formData, contact: e.target.value })}
                style={styles.input}
              />
              <textarea
                placeholder="Address"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                style={styles.textarea}
              />
              <input
                type="number"
                placeholder="Total Purchase"
                value={formData.totalPurchase}
                onChange={e => setFormData({ ...formData, totalPurchase: e.target.value })}
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Paid"
                value={formData.paid}
                onChange={e => setFormData({ ...formData, paid: e.target.value })}
                style={styles.input}
              />

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


/* ---- Design System Styles ---- */

const styles = {
 
  container: {
  padding: "30px",
  backgroundColor: "#ffffff",
  minHeight: "100vh",
  width: "100%",
  overflowX: "hidden"
},
 
  header: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: "25px"
},
  
  headerRight: {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  flexWrap: "wrap"
},
  heading: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "bold"
  },
  subheading: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b"
  },
  searchWrapper: {
    position: "relative"
  },
  search: {
    padding: "10px 40px 10px 15px",
    width: "280px",
    maxWidth: "280px",
    borderRadius: "20px",
    border: "1px solid #cbd5e1",
    outline: "none"
  },
  searchIcon: {
    position: "absolute",
    right: "15px",
    top: "10px",
    color: "#94a3b8"
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#40b5ad",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  exportBtn: {
    padding: "10px 20px",
    backgroundColor: "#4a6b82",
    color: "white",
    border: "none",
    borderRadius: "10px",
   cursor: "pointer",
   fontWeight: "bold"
  },
  tableWrapper: {
    backgroundColor: "#d1dee2",
    borderRadius: "15px",
    padding: "20px",
    minHeight: "400px",
    overflowX: "auto"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #94a3b8",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600"
  },
  td: {
    padding: "15px 12px",
    borderBottom: "1px solid #94a3b8",
    fontSize: "14px",
    color: "#1e293b"
  },
  dueHighlight: {
    color: "#dc2626",
    fontWeight: "600"
  }, // Red for "Due"
  // actionCell: {
  //   display: "flex",
  //   gap: "10px",
  //   justifyContent: "center",
  //   padding: "15px 0",
  //   borderBottom: "1px solid #94a3b8"
  // },
  actionCell: {
  textAlign: "center",
  verticalAlign: "middle",
  borderBottom: "1px solid #94a3b8"
},
actionButtons: {
  display: "flex",
  justifyContent: "flex-start",
  gap: "10px",
  paddingLeft: "20px"
},


  editBtn: {
    backgroundColor: "#4fd1c5",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "6px 10px",
    cursor: "pointer"
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "6px 10px",
    cursor: "pointer"
  },
  emptyState: {
    textAlign: "center",
    padding: "100px 0",
    color: "#64748b"
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
    maxWidth: "450px"
  },
  modalTitle: {
    margin: "0 0 20px 0",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#000000ff"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #000000ff",
    outline: "none",
    backgroundColor: "#ffffff24",
    color: "#000000ff"
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #000000ff",
    height: "80px",
    resize: "none",
    backgroundColor: "#ffffff24",
    color: "#000000ff"
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px"
  },
  cancelBtn: {
    padding: "10px 20px",
    border: "none",
    background: "#e2e8f0",
    borderRadius: "8px",
    cursor: "pointer"
  },
  saveBtn: {
    padding: "10px 20px",
    border: "none",
    background: "#40b5ad",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
};

export default Customers;