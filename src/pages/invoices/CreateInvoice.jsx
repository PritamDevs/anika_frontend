import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HoverButton from "../../components/common/HoverButton";
import { socket } from "../../socket";
import toast from "react-hot-toast";
import { getAllCustomers, createCustomer } from "../../services/customerService";
import { getAllProductsList } from "../../services/productService";
import { createInvoice } from "../../services/invoiceService";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState({
    _id: "",
    name: "",
    contact: "",
    address: "",
    advanceAmount: 0
  });

  const [previousDue, setPreviousDue] = useState(0);
  const [items, setItems] = useState([]);
  const [productDropdowns, setProductDropdowns] = useState({});
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0
  });
  const [paidAmount, setPaidAmount] = useState(0);
  const advanceAmount =
    selectedCustomer?.advanceAmount || 0;

  const grandTotal =
    items.reduce(
      (sum, item) =>
        sum + Number(item.total || 0),
      0
    );

  const advanceUsed =
    Math.min(advanceAmount, grandTotal);
  const [loading, setLoading] = useState(false);

  const adjustedInvoiceTotal =
    grandTotal - advanceUsed;

  const balanceDue =
    Math.max(
      0,
      previousDue +
      adjustedInvoiceTotal -
      paidAmount
    );

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const customers =
        await getAllCustomers();

      console.log(
        "ALL CUSTOMERS:",
        customers
      );

      setCustomers(customers);

    } catch (err) {

      console.error(
        "Customer fetch error:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
        "Failed to load customers"
      );
    }
  };

  const fetchProducts = async () => {
    try {

      const products =
        await getAllProductsList();

      const sortedProducts =
        [...products].sort(
          (a, b) =>
            a.name.localeCompare(
              b.name,
              undefined,
              {
                sensitivity: "base"
              }
            )
        );

      setProducts(sortedProducts);

    } catch (err) {

      console.error(
        "Product fetch error:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
        "Failed to load products"
      );
    }
  };
  /* ---- Handlers ---- */

  const handleCustomerChange = async (id) => {

    // Show name immediately from stale list
    const local = customers.find(c => c._id === id);
    if (local) setCustomerSearch(local.name);

    try {
      // Always fetch fresh list to get latest dueAmount
      const customers =
        await getAllCustomers();

      const fresh =
        customers.find(
          c =>
            String(c._id) ===
            String(id)
        );

      const source = fresh || local;
      if (!source) return;

      setSelectedCustomer({
        _id: source._id,
        name: source.name,
        contact: source.contact,
        address: source.address,
        advanceAmount: Number(
          source.advanceAmount || 0
        )
      });

      console.log("CUSTOMER SOURCE", source);

      setPreviousDue(Number(source.dueAmount || 0));

    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to refresh customer details"
      );
      if (local) {
        setSelectedCustomer({ _id: local._id, name: local.name, contact: local.contact, address: local.address });
        setPreviousDue(Number(local.dueAmount || 0));
      }
    }
  };

  const addProduct = () => {
    setItems(prev => [
      ...prev,
      {
        productId: "",
        productName: "",
        productSearch: "",
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

    const qty = Number(updated[index].qty) || 0;
    const rate = Number(product.rate) || 0;
    const discount = Number(product.discount ?? 0);

    const gross = qty * rate;
    const discountAmount = (gross * discount) / 100;
    const total = Math.round((gross - discountAmount) * 100) / 100;

    updated[index] = {
      ...updated[index],
      productId: product._id,
      productName: product.name,
      productSearch: product.name,
      rate,
      discount,
      stockQty: Number(product.stockQty || 0),
      lowStockAlert: Number(product.lowStockAlert || 5),
      total
    };

    setItems(updated);
  };

  const updateItem = (i, field, value) => {
    setItems(prev => {
      const updated = [...prev];

      if (field === "qty") {
        const stock = updated[i].stockQty || 0;

        if (Number(value) < 0) value = 0;

        if (stock <= 0) {
          toast.error(
            "This product is out of stock"
          );
          return prev;
        }
      }

      const item = { ...updated[i], [field]: value };

      const qty = Number(item.qty) || 0;
      const rate = Number(item.rate) || 0;
      const discount = Number(item.discount) || 0;

      const gross = qty * rate;
      const discountAmount = (gross * discount) / 100;

      item.total = Math.round((gross - discountAmount) * 100) / 100;

      updated[i] = item;

      return updated;
    });
  };


  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));


  /* ---- Generate & Navigate ---- */
  const handleGenerateInvoice = async () => {

    if (loading) return;

    setLoading(true);

    if (!selectedCustomer._id || items.length === 0) {
      toast.error(
        "Please select a customer and add products"
      );
      setLoading(false);
      return;
    }

    if (hasInvalidStock) {
      toast.error(
        "Fix stock issues first"
      );
      setLoading(false);
      return;
    }

    try {
      const data =
        await createInvoice({
          customerId:
            selectedCustomer._id,

          products:
            items.map(i => ({
              productId:
                i.productId,
              qty: i.qty,
              rate: i.rate,
              discount:
                Number(i.discount) || 0
            })),

          paidAmount
        });

      toast.success(
        "Invoice created successfully"
      );

      navigate("/Invoice/Preview", {
        state: {
          invoiceData: {
            invoiceNo: data.invoice.invoiceNumber,
            date: new Date(data.invoice.createdAt).toLocaleDateString(),
            customerName: selectedCustomer.name,
            customer: selectedCustomer,
            items: data.invoice.products.map(p => ({
              productName: p.productId.name,
              qty: p.qty,
              rate: p.rate,
              discount: p.discount,
              total: (p.qty * p.rate) * (1 - p.discount / 100)
            })),
            grandTotal: data.invoice.totalAmount,

            paid: data.invoice.paidAmount,

            previousAmount:
              data.invoice.previousAmount,

            totalDueAmount:
              data.invoice.totalDueAmount ??
              data.invoice.balance,
          }
        }
      });

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.message ||
        "Failed to create invoice"
      );

    } finally {

      setLoading(false);

    }
  };

  const hasInvalidStock = items.some(
    item => Number(item.qty) > Number(item.stockQty) || Number(item.stockQty) < 1
  );

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    address: ""
  });


  const handleCreateCustomer = async (e) => {
    e.preventDefault();

    if (!newCustomer.name) {
      toast.error(
        "Name required"
      );
      return;
    }

    try {
      const data =
        await createCustomer({
          name: newCustomer.name,
          contact:
            newCustomer.contact || "",
          address:
            newCustomer.address,
          totalPurchase: 0,
          paid: 0
        });

      // ✅ Refresh customer list
      setCustomers(prev => [...prev, data.customer]);

      // ✅ Auto select newly created customer
      setSelectedCustomer({
        _id: data.customer._id,
        name: data.customer.name,
        contact: data.customer.contact,
        address: data.customer.address
      });

      setCustomerSearch(data.customer.name);
      setPreviousDue(0);
      setIsCustomerModalOpen(false);
      setNewCustomer({ name: "", contact: "", address: "" });

    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        "Failed to create customer"
      );
    }
  };
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleStock = () => fetchProducts();
    const handleCustomer = () => fetchCustomers();

    socket.on("stockUpdated", handleStock);
    socket.on("customerUpdated", handleCustomer);

    return () => {
      socket.off("stockUpdated", handleStock);
      socket.off("customerUpdated", handleCustomer);
    };
  }, []);
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
        {/* Customer Section */}
        <div style={{
          display: "grid",
          gap: "20px",
          marginBottom: "20px",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr"
        }}>
          <div style={{ position: "relative" }}>
            <input
              style={styles.inputField}
              placeholder="Search Customer Name..."
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                setShowDropdown(true);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            {showDropdown && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                maxHeight: "220px",
                overflowY: "auto",
                zIndex: 999,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
                onClick={(e) => e.stopPropagation()}
              >
                {(customers || [])
                  .filter(c => customerSearch === "" || c.name.toLowerCase().startsWith(customerSearch.toLowerCase()))
                  .map(c => (
                    <div
                      key={c._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomerChange(c._id);
                        setShowDropdown(false);
                      }}
                      style={{
                        padding: "10px 15px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: "14px"
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0f9ff"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}
                    >
                      {c.name}
                    </div>
                  ))}
                {(customers || [])
                  .filter(
                    c =>
                      customerSearch === "" ||
                      c.name
                        .toLowerCase()
                        .startsWith(
                          customerSearch.toLowerCase()
                        )
                  )
                  .length === 0 && (
                    <div
                      style={{
                        padding: "10px 15px",
                        color: "#94a3b8",
                        fontSize: "14px"
                      }}
                    >
                      No customers found
                    </div>
                  )}
              </div>
            )}
          </div>

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
                  <td
                    style={{
                      ...styles.td,
                      overflow: "visible",
                      position: "relative",
                      zIndex: productDropdowns[i] ? 9999 : 1,
                      minWidth: "220px"
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        overflow: "visible"
                      }}
                    >
                      <input
                        style={styles.tableSelect}
                        placeholder="Search Product..."
                        value={item.productSearch || ""}
                        onChange={(e) => {
                          const updated = [...items];

                          updated[i].productSearch =
                            e.target.value;

                          setItems(updated);

                          setProductDropdowns(prev => ({
                            ...prev,
                            [i]: true
                          }));
                        }}
                        onFocus={(e) => {

                          const rect =
                            e.target.getBoundingClientRect();

                          setDropdownPosition({
                            top: rect.bottom + 5,
                            left: rect.left
                          });

                          setProductDropdowns(prev => ({
                            ...prev,
                            [i]: true
                          }));
                        }}
                      />

                      {productDropdowns[i] && (
                        <div
                          style={{
                            position: "fixed",
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            width: "300px",
                            background: "#fff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                            maxHeight: "250px",
                            overflowY: "auto",
                            zIndex: 999999,
                            boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
                          }}
                        >
                          {products
                            .filter(p => {

                              const search =
                                item.productSearch.toLowerCase().trim();

                              return (
                                search === "" ||
                                p.name
                                  .toLowerCase()
                                  .startsWith(search)
                              );

                            })
                            .map(p => (
                              <div
                                key={p._id}
                                onClick={() => {
                                  handleProductChange(
                                    i,
                                    p._id
                                  );

                                  setProductDropdowns(
                                    prev => ({
                                      ...prev,
                                      [i]: false
                                    })
                                  );
                                }}
                                style={{
                                  padding: "10px",
                                  cursor: "pointer",
                                  borderBottom:
                                    "1px solid #eee"
                                }}
                              >
                                {p.name}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </td>
                  {/* ✅ ADD THIS STOCK COLUMN */}
                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "bold", color: item.stockQty <= 0 ? "#dc2626" : item.stockQty <= item.lowStockAlert ? "#f59e0b" : "#16a34a"
                    }}>
                    {item.stockQty ?? "-"}
                  </td>
                  {/* <td style={styles.td}>{item.batchNo}</td> */}
                  <td style={styles.td}>
                    <input type="number" min="0" style={styles.tableInput} value={item.qty} onChange={(e) => updateItem(i, "qty",
                      e.target.value)} />
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
          {items.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No products added.</p>}
        </div>

        {/* Footer Summary */}
        <div style={styles.footerRow}>
          <HoverButton style={styles.addBtn} hoverStyle={styles.addBtnHover} onClick={addProduct}>
            + Add Product
          </HoverButton>

          <div style={styles.summaryBox}>

            {/* ✅ Grand Total */}
            <div style={styles.summaryItem}>
              <span>Grand Total</span>
              <input style={styles.summaryInput} value={grandTotal.toFixed(2)} readOnly />
            </div>

            {/* ✅ ADD THIS (Previous Due) */}
            <div style={styles.summaryItem}>
              <span>Previous Due</span>
              <input style={styles.summaryInput} value={previousDue.toFixed(2)} readOnly />
            </div>

            <div style={styles.summaryItem}>
              <span>Customer Advance</span>

              <input
                style={{
                  ...styles.summaryInput,
                  color: "#198754",
                  fontWeight: "600"
                }}
                value={advanceAmount.toFixed(2)}
                readOnly
              />
            </div>

            <div style={styles.summaryItem}>
              <span>Advance Used</span>

              <input
                style={{
                  ...styles.summaryInput,
                  color: "#198754",
                  fontWeight: "600"
                }}
                value={advanceUsed.toFixed(2)}
                readOnly
              />
            </div>

            {/* ✅ Paid */}
            <div style={styles.summaryItem}>
              <span>Paid</span>
              <input
                style={styles.summaryInput}
                type="number"
                min="0"
                value={paidAmount}
                onChange={(e) =>
                  setPaidAmount(
                    Math.max(
                      0,
                      Number(e.target.value) || 0
                    )
                  )
                }
              />
            </div>

            {/* ✅ Total Balance */}
            <div style={styles.summaryItem}>
              <span>Total Balance Due</span>
              <input style={styles.summaryInput} value={balanceDue.toFixed(2)} readOnly />
            </div>

          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <HoverButton
            disabled={loading}
            style={{
              ...styles.generateBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
            hoverStyle={!loading ? styles.generateBtnHover : {}}
            onClick={() => {
              if (loading) return;
              handleGenerateInvoice();
            }}
          >
            {loading ? "Generating..." : "Generate Invoice"}
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
    overflowX: "auto",
    overflowY: "visible"
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
    width: "180px",
    minWidth: "180px",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    boxSizing: "border-box"
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