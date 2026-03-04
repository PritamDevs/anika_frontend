import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HoverButton from "../../components/common/HoverButton";
import { BACKEND_URL } from "../../config/index.js";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [selectedCustomer, setSelectedCustomer] = useState({
   _id: "",
    name: "",
    contact: "",
    address: ""
  });
  
  const [previousDue, setPreviousDue] = useState(0);
  const [items, setItems] = useState([]);
  const [paidAmount, setPaidAmount] = useState(0);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch(`${BACKEND_URL}/api/customers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setCustomers(data);
  };

  const fetchProducts = async () => {
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setProducts(data);
  };
  /* ---- Handlers ---- */

  const handleCustomerChange = (id) => {
    const customer = customers.find((c) => c._id === id);
    if(!customer) return;

    if (customer) {
      setSelectedCustomer({
        _id: customer._id,
        name: customer.name,
        contact: customer.contact,
        address: customer.address,
        dueAmount: customer.dueAmount || 0
      });
      setPreviousDue(Number(customer.dueAmount || 0));
    }
  };

  const addProduct = () => {
  setItems(prev => [
    ...prev,
    {
      productId: "",
      productName: "",
      qty: 1,
      rate: 0,
      discount: 0,
      total: 0
    }
  ]);
};


  const handleProductChange = (index, id) => {
    const product = products.find(p => p._id === id);
    if (!product) return;
    
    const updated = [...items];
  updated[index] = {
    ...updated[index],
    productId: product._id,
    productName: product.name,
    rate: Number(product.rate || 0),
    discount: Number(product.discount || 0),
    stockQty: Number(product.stockQty || 0), // ADD THIS
    lowStockAlert: Number(product.lowStockAlert || 5),
    total: Number(product.rate || 0) * Number(updated[index].qty)
  };
    setItems(updated);
  };

  const updateItem = (i, field, value) => {
    const updated = [...items];
 if (field === "qty") {
  const stock = updated[i].stockQty || 0;

  if (Number(value) < 0) {
    value = 0;
  }

  if (stock <= 0) {
    alert("This product is out of stock");
    return;
  }
}
    updated[i][field] = value;
    
    const qty = Number(updated[i].qty) || 0;
    const rate = Number(updated[i].rate) || 0;
    const discount = Number(updated[i].discount) || 0;

    const gross = qty * rate;
    const discountAmount = (gross * discount) / 100;
    updated[i].total = gross - discountAmount;

    setItems(updated);
  };


  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);
  const balanceDue = previousDue+ grandTotal - paidAmount;

 


  /* ---- Generate & Navigate ---- */
  const handleGenerateInvoice = async () => {
  if (!selectedCustomer._id || items.length === 0) {
    alert("Please select a customer and add products");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/invoices/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        customerId: selectedCustomer._id,
        products: items.map(i => ({
          productId: i.productId,
          qty: i.qty,
          rate: i.rate,
          discount: i.discount
        })),
        totalAmount: grandTotal,
        paidAmount,
        previousAmount: previousDue
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create invoice");
      return;
    }

    // ✅ Navigate to preview with SAVED invoice
   navigate("/Invoice/Preview", {
  state: {
    invoiceData: {
      invoiceNo: data.invoice.invoiceNumber,
      date: new Date(data.invoice.createdAt).toLocaleDateString(),

      customer: {
        name: selectedCustomer.name,
        contact: selectedCustomer.contact,
        address: selectedCustomer.address
      },

      items: items.map(i => ({
        productName: i.productName,
        qty: i.qty,
        rate: i.rate,
        discount: i.discount,
        total: i.total
      })),

      grandTotal: data.invoice.totalAmount,
      paid: data.invoice.paidAmount,
      balance: data.invoice.totalDueAmount
    }
  }
});


  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

const hasInvalidStock = items.some(
  item => item.qty > item.stockQty || item.stockQty <= 0
);


const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

const [newCustomer, setNewCustomer] = useState({
  name: "",
  contact: "",
  address: ""
});


const handleCreateCustomer = async (e) => {
  e.preventDefault();

  if (!newCustomer.name || !newCustomer.contact) {
    alert("Name and Contact required");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/customers/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newCustomer.name,
        contact: newCustomer.contact,
        address: newCustomer.address,
        totalPurchase: 0,
        paid: 0
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create customer");
      return;
    }

    // ✅ Refresh customer list
    await fetchCustomers();

    // ✅ Auto select newly created customer
    setSelectedCustomer({
      _id: data.customer._id,
      name: data.customer.name,
      contact: data.customer.contact,
      address: data.customer.address
    });

    setPreviousDue(0);

    setIsCustomerModalOpen(false);
    setNewCustomer({ name: "", contact: "", address: "" });

  } catch (err) {
    alert("Server error");
  }
};
const isDesktop = window.innerWidth >= 768;
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Invoice</h2>
      <p style={styles.subheading}>Generate new sales Invoice with automatic calculation</p>

      <div style={styles.invoiceBox}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #94a3b8",
          paddingBottom: "10px",
          marginBottom: "20px"
        }}>  
      
      <h3 style={styles.boxTitle}>Invoice Details</h3>
        <button
        type="button"
        onClick={() => setIsCustomerModalOpen(true)}
        style={{
          backgroundColor: "#40b5ad",
          color: "white",
          border: "none",
          padding: "6px 15px",
          borderRadius: "20px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        + New Customer
      </button>
    </div>
       {items.some(item => item.qty > item.stockQty || item.stockQty <= item.lowStockAlert) && (
  <div style={{
    background: "#fff3cd",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    color: "#856404",
    fontWeight: "bold"
  }}>
    ⚠️ Some products are running low on stock.  
    {items.map(item => (
      item.qty > item.stockQty && (
        <div key={item.productId}>
          Max available quantity reached: {item.stockQty}
        </div>
      )
    ))}
  </div>
)}

          {items.some(item => item.stockQty <= 0) && (
            <div style={{
              background: "#f8d7da",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              color: "#721c24",
              fontWeight: "bold"
              }}>
                ❌ Some products are out of stock. Invoice cannot be generated.
                </div>
            )}
        
        {/* Customer Section */}
        <div style={{
          ...styles.customerGrid,
          gridTemplateColumns: window.innerWidth >= 768 ? "1fr 1fr" : "1fr"
          }}
        >
          <select 
            style={styles.inputField} 
            onChange={(e) => handleCustomerChange(e.target.value)}
          >
            <option value="">Select Customer Name</option>
            {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input style={styles.inputField} placeholder="Previous dues" value={`₹ ${previousDue.toFixed(2)}`} readOnly />
          <input style={styles.inputField} placeholder="Customer Contact" value={selectedCustomer.contact} readOnly />
          <input style={styles.inputField} placeholder="Customer Address" value={selectedCustomer.address} readOnly />
        </div>

        {/* Product Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>SL.</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Rate</th>
                <th style={styles.th}>Disc%</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>
                    <select 
                      style={styles.tableSelect} 
                      value={item.productId}
                      onChange={(e) => handleProductChange(i, e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </td>
                  {/* ✅ ADD THIS STOCK COLUMN */}
                  <td
                  style={{
                    ...styles.td,
                    fontWeight: "bold",color:item.stockQty <= 0 ? "#dc2626": item.stockQty <= item.lowStockAlert ? "#f59e0b"      : "#16a34a"
                  }}>
                    {item.stockQty ?? "-"}
                  </td>
                 {/* <td style={styles.td}>{item.batchNo}</td> */}
                  <td style={styles.td}>
                   <input type="number" min="0" style={styles.tableInput} value={item.qty}onChange={(e) => updateItem(i, "qty",
                    e.target.value)}/>
                  </td>
                  <td style={styles.td}>{item.rate}</td>
                  <td style={styles.td}>
                    <input type="number" style={styles.tableInput} value={item.discount} onChange={(e) => updateItem(i, "discount", e.target.value)} />
                  </td>
                  <td style={styles.td}>{item.total.toFixed(2)}</td>
                  <td style={styles.td}>
                    <HoverButton 
                      style={styles.removeBtn} 
                      hoverStyle={styles.removeBtnHover} 
                      onClick={() => removeItem(i)}
                    >
                      Remove
                    </HoverButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>No products added.</p>}
        </div>

        {/* Footer Summary */}
        <div style={styles.footerRow}>
          <HoverButton style={styles.addBtn} hoverStyle={styles.addBtnHover} onClick={addProduct}>
            + Add Product
          </HoverButton>
          
          <div style={styles.summaryBox}>
            <div style={styles.summaryItem}>
              <span>Grand Total</span>
              <input style={styles.summaryInput} value={grandTotal.toFixed(2)} readOnly />
            </div>
            <div style={styles.summaryItem}>
              <span>Paid</span>
              <input 
                style={styles.summaryInput} 
                type="number" 
                value={paidAmount} 
                onChange={(e) => setPaidAmount(Number(e.target.value))} 
              />
            </div>
            <div style={styles.summaryItem}>
              <span>Balance Due</span>
              <input style={styles.summaryInput} value={balanceDue.toFixed(2)} readOnly />
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <HoverButton
          disabled={hasInvalidStock}
          style={{
            ...styles.generateBtn,
            opacity: hasInvalidStock ? 0.5 : 1,
            cursor: hasInvalidStock ? "not-allowed" : "pointer"
          }}
          hoverStyle={styles.generateBtnHover}
          onClick={handleGenerateInvoice}
          >
            Generate Invoice
          </HoverButton>
        </div>
      </div>
      {/* 🔥 ADD MODAL HERE */}
      {isCustomerModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            width: "350px"
          }}>
            <h3 style={{ marginBottom: "15px" }}>Create Customer</h3>

            <form onSubmit={handleCreateCustomer}>
              <input
                placeholder="Name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                style={styles.inputField}
              />

              <input
                placeholder="Contact"
                value={newCustomer.contact}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, contact: e.target.value })
                }
                style={{ ...styles.inputField, marginTop: "10px" }}
              />

              <textarea
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
                style={{ ...styles.inputField, marginTop: "10px" }}
              />

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "15px"
              }}>
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  style={{
                    padding: "8px 15px",
                    border: "none",
                    background: "#e2e8f0",
                    borderRadius: "8px"
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: "8px 15px",
                    border: "none",
                    background: "#40b5ad",
                    color: "white",
                    borderRadius: "8px",
                    fontWeight: "bold"
                  }}
                >
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
    backgroundColor: "#f8fafc", 
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden"
  },
  heading: { 
    margin: 0, 
    fontSize: "28px", 
    fontWeight: "bold" 
  },
  subheading: { 
    color: "#64748b", 
    marginBottom: "30px" 
  },
  invoiceBox: { 
    backgroundColor: "#d1dee2", 
     padding: "20px",
     borderRadius: "15px",
     width: "100%",
     boxSizing: "border-box"
  },
  boxTitle: { 
    borderBottom: "2px solid #94a3b8", 
    paddingBottom: "10px", 
    marginBottom: "20px" 
  },
  
  customerGrid: { 
    display: "grid",
    gap: "20px",
    marginBottom: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
  },
  inputField: { 
    width: "100%",          
    boxSizing: "border-box", 
    padding: "12px", 
    borderRadius: "20px", 
    border: "1px solid #cbd5e1", 
    outline: "none", 
    backgroundColor: "#fff" 
  },
 
  tableContainer: { 
  backgroundColor: "#fff", 
  borderRadius: "10px", 
  padding: "10px", 
  overflowX: "auto"
},
  table: { 
    width: "100%", 
    borderCollapse: "collapse" 
  },
  th: { 
    textAlign: "left", 
    padding: "10px", 
    borderBottom: "1px solid #e2e8f0", 
    fontSize: "14px", 
    color: "#475569" 
  },
  td: { 
    padding: "10px", 
    borderBottom: "1px solid #f1f5f9", 
    fontSize: "14px" 
  },
  tableInput: { 
    width: "60px", 
    maxWidth: "80px",
    padding: "5px", 
    borderRadius: "5px", 
    border: "1px solid #ddd" 
  },
  tableSelect: { 
    width: "100%", 
    padding: "5px", 
    borderRadius: "5px", 
    border: "1px solid #ddd" 
  },
  removeBtn: { 
    backgroundColor: "#fff", 
    color: "red", 
    fontWeight: "600", 
    border: "1px solid red", 
    padding: "5px 10px", 
    borderRadius: "5px", 
    cursor: "pointer", 
    transition: "all 0.3s ease" 
  },
  removeBtnHover: { 
    backgroundColor: "#ffe5e5", 
    transform: "scale(1.05)" 
  },

  footerRow: { 
  display: "flex", 
  justifyContent: "space-between", 
  marginTop: "20px", 
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "20px"
},
  addBtn: { 
    backgroundColor: "#4a6b82", 
    color: "white", 
    border: "none", 
    padding: "10px 20px", 
    borderRadius: "10px", 
    cursor: "pointer", 
    transition: "all 0.3s ease" 
  },
  addBtnHover: { 
    backgroundColor: "#3a566b", 
    transform: "scale(1.05)" 
  },
  summaryBox: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "10px" 
  },
  summaryItem: { 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "flex-end", 
    gap: "15px" 
  },
  
  summaryInput: { 
    padding: "8px", 
    borderRadius: "10px", 
    boxSizing: "border-box",
    border: "1px solid #94a3b8", 
    textAlign: "right", 
    width: "100%",
    maxWidth: "150px",
    backgroundColor: "#fff" 
  },
  generateBtn: { 
    background: "linear-gradient(to right, #2d5a61, #4a6b82)", 
    color: "white", 
    padding: "12px 40px", 
    border: "none", 
    borderRadius: "10px", 
    fontSize: "18px", 
    cursor: "pointer", 
    transition: "all 0.3s ease" 
  },
  generateBtnHover: { 
    transform: "scale(1.05)", 
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)" 
  }
};

export default CreateInvoice;