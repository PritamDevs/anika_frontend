import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {getAllCustomers} from "../../services/customerService";
import {getAllInvoices} from "../../services/invoiceService";
import {getAllProductsList} from "../../services/productService"; 
import {getAllPayments,createPayment,updatePayment} from "../../services/paymentService";

const Payments = () => {
  const [isReturn, setIsReturn] = useState(false);
  useEffect(() => {

    if (isReturn) {

      setForm(prev => ({
        ...prev,
        paymentMode: "advance"
      }));

    }

  }, [isReturn]);
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);


  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    customerId: "",
    invoiceId: "",
    gstin: "",
    date: new Date().toISOString().split("T")[0],

    amount: "",

    paymentMode: "cash",
    reference: "",

    advanceAdjustment: 0,

    returnedProducts: [
      {
        productId: "",
        productName: "",
        qty: 1,
      },
    ],
  });


  useEffect(() => {
    fetchPayments();
    setCurrentPage(1);
  }, [isReturn]);

  useEffect(() => {
    const fetchCustomers =
      async () => {

        try {

          const data =
            await getAllCustomers();

          setCustomers(data);

        } catch (err) {

          toast.error(
            "Failed to load customers"
          );

        }

      };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchInvoices =
      async () => {

        try {

          const data =
            await getAllInvoices();

          setInvoices(data);

        } catch (err) {

          toast.error(
            "Failed to load invoices"
          );

        }

      };

    fetchInvoices();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data =
          await getAllProductsList();

        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleReturnProductChange = (
    index,
    field,
    value
  ) => {
    const updated = [...form.returnedProducts];

    updated[index][field] = value;

    setForm({
      ...form,
      returnedProducts: updated,
    });
  };

  const addReturnProduct = () => {
    setForm({
      ...form,
      returnedProducts: [
        ...form.returnedProducts,
        {
          productId: "",
          productName: "",
          qty: 1,
        },
      ],
    });
  };



  const fetchPayments =
    async () => {

      try {

        const data =
          await getAllPayments();

        const filtered =
          data.filter(
            p =>
              p.type ===
              (
                isReturn
                  ? "return"
                  : "payment"
              )
          );

        setPayments(filtered);

      } catch (error) {

        toast.error(
          "Failed to load payments"
        );

      }

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
      paymentMode:
        isReturn
          ? "advance"
          : "cash",
    });

    setFilteredInvoices(customerInvoices);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.customerId) {

      toast.error(
        "Please select customer"
      );

      return;
    }

    if (
      !isReturn &&
      !form.amount
    ) {

      toast.error(
        "Please enter amount"
      );

      return;
    }

    if (
      isReturn &&
      !form.invoiceId
    ) {

      toast.error(
        "Please select an invoice for return"
      );

      return;
    }

    try {
      setLoading(true);

      console.log("PAYLOAD", {
        customerId: form.customerId,
        invoiceId: form.invoiceId,
        paymentMode: isReturn
          ? "advance"
          : form.paymentMode,
        type: isReturn
          ? "return"
          : "payment",
      });

      await createPayment({
        customerId:
          form.customerId,

        invoiceId:
          form.invoiceId || null,

        gstin:
          form.gstin || "",

        amount:
          isReturn
            ? 0
            : Number(form.amount),

        type:
          isReturn
            ? "return"
            : "payment",

        paymentMode:
          isReturn
            ? "advance"
            : form.paymentMode,

        reference:
          form.reference,

        date:
          form.date,

        advanceAdjustment:
          isReturn
            ? Number(
              form.advanceAdjustment || 0
            )
            : 0,

        returnedProducts:
          isReturn
            ? form.returnedProducts
            : [],
      });

      // alert("Transaction Recorded Successfully");

      await fetchPayments();

      setForm({
        customerId: "",
        invoiceId: "",
        gstin: "",
        date: new Date().toISOString().split("T")[0],

        amount: "",

        paymentMode:
          isReturn
            ? "advance"
            : "cash",

        reference: "",

        advanceAdjustment: 0,

        returnedProducts: [
          {
            productId: "",
            productName: "",
            qty: 1,
          },
        ],
      });

    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to save transaction"
      );
    }
    finally {
      setLoading(false);
    }
  };
  const openEditModal = (payment) => {
    setEditData({
      _id: payment._id,
      customerName: payment.customerId?.name || "",
      invoiceNumber: payment.invoiceId?.invoiceNumber || "",
      amount: payment.amount,
      paymentMode: payment.paymentMode,
      reference: payment.reference,
    });
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

    await updatePayment(
      editData._id,
      {
        paymentMode:
          editData.paymentMode,

        reference:
          editData.reference,
      }
    );

    toast.success(
      "Transaction updated successfully"
    );

    setIsModalOpen(false);
    fetchPayments();
  };

  const selectedCustomer =
    customers.find(
      c => c._id === form.customerId
    );

  const hasDue =
    Number(
      selectedCustomer?.dueAmount || 0
    ) > 0;
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const paginatedPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            style={{ ...styles.toggleBtn, background: !isReturn ? "linear-gradient(to right, #4a9ca3, #86a2b8)" : "#808080" }}
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
            style={{ ...styles.toggleBtn, background: isReturn ? "linear-gradient(to right, #4a9ca3, #86a2b8)" : "#808080" }}
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
              <select name="customerId" value={form.customerId} onChange={handleCustomerChange}>
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {form.customerId && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px"
                  }}
                >
                  <div>
                    <strong>Current Due:</strong>
                    ₹ {Number(
                      customers.find(
                        c => c._id === form.customerId
                      )?.dueAmount || 0
                    ).toFixed(2)}
                  </div>

                  <div style={{ color: "#198754" }}>
                    <strong>Current Advance:</strong>
                    ₹ {Number(
                      customers.find(
                        c => c._id === form.customerId
                      )?.advanceAmount || 0
                    ).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Customer GSTIN</label>
              <input style={styles.input} value={form.gstin} readOnly />
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Invoice No. (Optional)</label>
              <select name="invoiceId" style={styles.input} value={form.invoiceId} onChange={handleChange}>
                <option value="">Select Invoice</option>
                {filteredInvoices.map((inv) => (
                  <option key={inv._id} value={inv._id}>
                    {inv.invoiceNumber}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ ...styles.inputGroup, maxWidth: '150px' }}>
              <label style={styles.label}>Date</label>
              <input type="date" name="date" style={styles.input} value={form.date} onChange={handleChange} />
            </div>
          </div>

          {isReturn && (
            <>


              <div
                style={{
                  marginTop: "15px",
                  padding: "15px",
                  border: "1px solid #94a3b8",
                  borderRadius: "10px",
                  background: "#f8fafc",
                }}
              >
                <h4>Returned Products</h4>

                {form.returnedProducts.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr",
                      gap: "15px",
                      marginBottom: "15px",
                    }}
                  >
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>
                        Product Name
                      </label>

                      <select
                        style={styles.input}
                        value={item.productId}
                        onChange={(e) => {
                          const selected =
                            products.find(
                              p => p._id === e.target.value
                            );

                          handleReturnProductChange(
                            index,
                            "productId",
                            e.target.value
                          );

                          handleReturnProductChange(
                            index,
                            "productName",
                            selected?.name || ""
                          );
                        }}
                      >
                        <option value="">
                          Select Product
                        </option>

                        {products.map((p) => (
                          <option
                            key={p._id}
                            value={p._id}
                          >
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>
                        Quantity
                      </label>

                      <input
                        type="number"
                        min="1"
                        style={styles.input}
                        value={item.qty}
                        onChange={(e) =>
                          handleReturnProductChange(
                            index,
                            "qty",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addReturnProduct}
                  style={styles.recordBtn}
                >
                  + Add More Products
                </button>

                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#f8fafc",
                    border: "1px solid #94a3b8",
                    borderRadius: "8px"
                  }}
                >
                  Return amount will be calculated
                  automatically from the invoice
                  product rate and quantity returned.
                </div>
              </div>
            </>
          )}

          <div style={styles.formGridThird}>

            {!isReturn && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Amount (₹)
                </label>

                <input
                  name="amount"
                  type="number"
                  min="1"
                  style={styles.input}
                  value={form.amount}
                  onChange={handleChange}
                />
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Payment Mode
              </label>

              <div style={styles.radioGroup}>

                {!isReturn && (
                  <>
                    <label>
                      <input
                        type="radio"
                        name="paymentMode"
                        value="cash"
                        checked={
                          form.paymentMode === "cash"
                        }
                        onChange={handleChange}
                      />
                      Cash
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="paymentMode"
                        value="upi"
                        checked={
                          form.paymentMode === "upi"
                        }
                        onChange={handleChange}
                      />
                      UPI
                    </label>
                  </>
                )}

                {isReturn && (
                  <label>
                    <input
                      type="radio"
                      name="paymentMode"
                      value="advance"
                      checked={true}
                      readOnly
                    />
                    Advance
                  </label>
                )}

              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Reference ID</label>
              <input name="reference" style={styles.input} value={form.reference} onChange={handleChange} />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button type="submit" style={styles.recordBtn} disabled={loading}>{loading ? "Saving..." : "+ Record Transaction"}</button>
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
            {paginatedPayments.map((p) => (
              <tr key={p._id}>
                <td style={styles.td}>{new Date(p.date).toLocaleDateString()}</td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>
                  {p.customerId?.name ? (
                    p.customerId.name
                  ) : (
                    <span>
                      <span style={{ color: 'red' }}>{p.customerName || "Unknown"}</span>
                      {" "}
                      <span style={{ fontSize: '11px', background: '#fee2e2', color: 'red', borderRadius: '4px', padding: '1px 5px', fontWeight: 'bold' }}>Inactive</span>
                    </span>
                  )}
                </td>
                <td style={styles.td}>{p.invoiceId?.invoiceNumber}</td>
                <td style={styles.td}>₹ {p.amount.toLocaleString()}</td>
                <td style={styles.td}>{p.paymentMode}</td>
                <td style={styles.td}>{p.reference}</td>
                <td style={styles.td}><button style={styles.editBtn} onClick={() => openEditModal(p)}>✎</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >«</button>

            <button
              style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >‹</button>

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
                  <button
                    key={item}
                    style={{
                      ...styles.pageBtn,
                      background: currentPage === item ? "linear-gradient(to right, #2d5a61, #4a6b82)" : "white",
                      color: currentPage === item ? "white" : "#333",
                    }}
                    onClick={() => setCurrentPage(item)}
                  >{item}</button>
                )
              )}

            <button
              style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.4 : 1 }}
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >›</button>

            <button
              style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.4 : 1 }}
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >»</button>

            <span style={styles.pageInfo}>
              Page {currentPage} of {totalPages} &nbsp;|&nbsp; {payments.length} records
            </span>
          </div>
        )}
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
                <input
                  name="amount"
                  type="number"
                  style={{
                    ...styles.modalInput,
                    backgroundColor: "#e5e7eb",
                    cursor: "not-allowed"
                  }}
                  value={editData.amount}
                  readOnly
                />

                <small style={{ color: "#000" }}>
                  Amount editing temporarily disabled.
                </small>
              </div>
              <div style={styles.modalInputGroup}>
                <label style={styles.modalLabel}>Payment Mode</label>
                <select name="mode" style={styles.modalInput} value={editData.paymentMode} onChange={handleModalChange}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="advance">Advance</option>
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
  container: {
    padding: "20px", fontFamily: 'serif', width: "100%",
    overflowX: "hidden"
  },
  headerRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap",
    gap: "15px", marginBottom: "20px"
  },
  heading: { margin: 0, fontSize: "28px", fontWeight: "bold" },
  subheading: { margin: 0, fontSize: "14px", color: "#333" },
  toggleContainer: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
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
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px solid #94a3b8"
  },
  pageBtn: {
    padding: "6px 12px",
    border: "1px solid #333",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    background: "white",
    color: "#333",
    transition: "0.2s"
  },
  pageDots: {
    padding: "6px 4px",
    fontSize: "14px",
    color: "#555"
  },
  pageInfo: {
    fontSize: "13px",
    color: "#444",
    marginLeft: "8px"
  },
};

export default Payments;