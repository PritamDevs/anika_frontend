import { useState, useEffect,useRef } from "react";
import { BACKEND_URL } from "../../config/index.js";
import { socket } from "../../socket";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    totalPurchase: "",
    paid: ""
  });

  const fetchCustomers = async (page = 1, search = "") => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/customers?page=${page}&limit=${limit}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setCustomers(data.customers);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch {
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const currentPageRef = useRef(currentPage);
const searchTermRef  = useRef(searchTerm);

useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);
useEffect(() => { searchTermRef.current  = searchTerm;  }, [searchTerm]);

useEffect(() => {
  fetchCustomers(1, searchTerm);
  const handleCustomer = () => fetchCustomers(currentPageRef.current, searchTermRef.current);
  socket.on("customerUpdated", handleCustomer);
  return () => socket.off("customerUpdated", handleCustomer);
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(1, searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const openAddModal = () => {
    setEditCustomer(null);
    setFormData({ name: "", contact: "", address: "", totalPurchase: "", paid: "" });
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
    const token = localStorage.getItem("token");
    await fetch(`${BACKEND_URL}/api/customers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCustomers(currentPage, searchTerm);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Name required");
      return;
    }
    const token = localStorage.getItem("token");
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
    fetchCustomers(currentPage, searchTerm);
  };

  const exportCustomersToCSV = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/customers?page=1&limit=100000&search=${searchTerm}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    const allCustomers = data.customers;

    if (!allCustomers.length) {
      alert("No customers found");
      return;
    }

    const escapeCSV = (field) => {
      if (field === null || field === undefined) return "";
      const str = String(field);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = ["Name", "Contact", "Address", "Total Purchase", "Total Paid", "Due Amount"];
    const rows = allCustomers.map(c => [
      c.name, c.contact, c.address || "",
      c.totalPurchase ?? 0, c.totalPaid ?? 0, c.dueAmount ?? 0
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Customer_List.csv";
    link.click();
  } catch {
    alert("Failed to export customers");
  }
};

  

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
            value={searchTerm}
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
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b", fontSize: "16px" }}>
            Loading...
          </div>
        ) : (
          <>
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
                {customers.map((c, i) => (
                  <tr key={c._id}>
                    <td style={styles.td}>{(currentPage - 1) * limit + i + 1}</td>
                    <td style={styles.td}>{c.name}</td>
                    <td style={styles.td}>{c.contact}</td>
                    <td style={styles.td}>₹ {c.totalPurchase}</td>
                    <td style={styles.td}>₹ {c.totalPaid}</td>
                    <td style={{ ...styles.td, ...styles.dueHighlight }}>₹ {c.dueAmount}</td>
                    <td style={styles.actionCell}>
                      <div style={styles.actionButtons}>
                        <button style={styles.editBtn} onClick={() => openEditModal(c)}>✎</button>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(c._id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {customers.length === 0 && (
              <div style={styles.emptyState}>No customers found</div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  style={{
                    ...styles.pageBtn,
                    opacity: currentPage === 1 ? 0.4 : 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer"
                  }}
                  onClick={() => fetchCustomers(currentPage - 1, searchTerm)}
                  disabled={currentPage === 1}
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    style={{
                      ...styles.pageBtn,
                      backgroundColor: page === currentPage ? "#40b5ad" : "#fff",
                      color: page === currentPage ? "#fff" : "#334155",
                      fontWeight: page === currentPage ? "bold" : "normal"
                    }}
                    onClick={() => fetchCustomers(page, searchTerm)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  style={{
                    ...styles.pageBtn,
                    opacity: currentPage === totalPages ? 0.4 : 1,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                  }}
                  onClick={() => fetchCustomers(currentPage + 1, searchTerm)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>

                <span style={{ fontSize: "13px", color: "#64748b", marginLeft: "10px" }}>
                  {total} customers total
                </span>
              </div>
            )}
          </>
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
                type="text"
                placeholder="Contact(optional)"
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
  heading: { margin: 0, fontSize: "28px", fontWeight: "bold" },
  subheading: { margin: 0, fontSize: "14px", color: "#64748b" },
  search: {
    padding: "10px 40px 10px 15px",
    width: "280px",
    maxWidth: "280px",
    borderRadius: "20px",
    border: "1px solid #cbd5e1",
    outline: "none"
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
  dueHighlight: { color: "#dc2626", fontWeight: "600" },
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
  form: { display: "flex", flexDirection: "column", gap: "10px" },
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
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "20px",
    flexWrap: "wrap"
  },
  pageBtn: {
    padding: "7px 14px",
    borderRadius: "8px",
    border: "1px solid #94a3b8",
    backgroundColor: "#fff",
    color: "#334155",
    cursor: "pointer",
    fontSize: "14px"
  }
};

export default Customers;