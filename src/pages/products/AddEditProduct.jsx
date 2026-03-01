

import { useState, useEffect } from "react";

const AddEditProduct = ({ isOpen, onClose, onSave, initialData }) => {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    discount: "",
    stock: "",
    date: getTodayDate(),
  });

  /* =====================
     HANDLE ADD / EDIT MODE
  ===================== */
  useEffect(() => {
    if (initialData) {
      // EDIT MODE
      setFormData({
        ...initialData,
        date: initialData.date || getTodayDate(),
      });
    } else if (isOpen) {
      // ADD MODE → clear fields + set today's date
      setFormData({
        name: "",
        rate: "",
        discount: "",
        stock: "",
        date: getTodayDate(),
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.rate || !formData.stock) {
      alert("Product name, rate, and stock quantity are required");
      return;
    }

    onSave(formData);

    // CLEAR FORM AFTER SAVE
    setFormData({
      name: "",
      rate: "",
      discount: "",
      stock: "",
      date: getTodayDate(),
    });

    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>
          {initialData ? "Edit Product" : "Add Product"}
        </h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <Input label="Product Name" name="name" value={formData.name} onChange={handleChange} />
          {/* <Input label="Batch No." name="batchNo" value={formData.batchNo} onChange={handleChange} /> */}
          <Input label="Rate" name="rate" value={formData.rate} onChange={handleChange} />
          <Input label="Discount %" name="discount" value={formData.discount} onChange={handleChange} />
          <Input label="Stock Qty" name="stock" value={formData.stock} onChange={handleChange} />
          <Input label="Date" name="date" type="date" value={formData.date} onChange={handleChange} />

          <div style={styles.actions}>
            <HoverButton
              type="button"
              onClick={onClose}
              style={styles.cancel}
              hoverStyle={styles.saveHover}
            >
              Cancel
            </HoverButton>

            <HoverButton
              type="submit"
              style={styles.save}
              hoverStyle={styles.saveHover}
            >
              Save Product
            </HoverButton>
          </div>
        </form>
      </div>
    </div>
  );
};

/* --- Reusable Input --- */
const Input = ({ label, ...props }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input {...props} style={styles.input} />
  </div>
);

const HoverButton = ({ style, hoverStyle, children, ...props }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <button
      {...props}
      style={{ ...style, ...(isHover ? hoverStyle : {}) }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {children}
    </button>
  );
};

/* --- Styles (UNCHANGED) --- */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: "500px",
    background: "linear-gradient(135deg, #60a3a9 0%, #86a2b8 100%)",
    padding: "20px",
    borderRadius: "10px",
  },
  title: {
    marginBottom: "16px",
    fontSize: "28px",
    fontWeight: "600",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
  },
  input: {
    width: "90%",
    alignSelf: "center",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #020202ff",
    backgroundColor: "#faffff07",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "16px",
  },
  cancel: {
    padding: "8px 12px",
    backgroundColor: "#adecf7ff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  save: {
    padding: "8px 14px",
    background: "linear-gradient(180deg, #214b4f 0%, #86a2b8 100%)",
    color: "#ffffff",
    border: "1px solid #000000ff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  saveHover: {
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
};

export default AddEditProduct;
