import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const InvoicePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {invoiceData, autoPrint} = location.state || {};
  
  // Retrieve the dynamic data passed from CreateInvoice
  const invoice = location.state?.invoiceData || null;

  // If someone tries to access this page directly without data, redirect back
  if (!invoice) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>No invoice data found.</p>
        <button onClick={() => navigate("/create-invoice")}>Go Back</button>
      </div>
    );
  }

 const handlePrint = () => {

  document.body.classList.remove("thermal-print");
  document.body.classList.add("a4-print");

  setTimeout(() => {
    window.print();
  }, 200);

};

const handleDirectPrint = () => {

  document.body.classList.remove("a4-print");
  document.body.classList.add("thermal-print");

  setTimeout(() => {
    window.print();
  }, 200);

};

const handleDownload = () => {
  window.print();
};

useEffect(() => {

  if (autoPrint) {

    document.body.classList.remove("a4-print");
    document.body.classList.add("thermal-print");

    setTimeout(() => {
      window.print();
    }, 400);

  }

}, [autoPrint]);


  return (
    <div style={styles.wrapper}>
      {/* CSS to hide sidebar/buttons during print */}
<style>
{`
/* Hide everything except invoice when printing */
@media print {

  body * {
    visibility: hidden;
  }

  .printable-area,
  .printable-area * {
    visibility: visible;
  }

  .printable-area {
    position: absolute;
    left: 0;
    top: 0;
  }

  .no-print {
    display: none !important;
  }

}

/* ---------- A4 MODE ---------- */

body.a4-print .container {
  max-width: 100% !important;
  width: 100% !important;
}

body.a4-print .printable-area {
  width: 100% !important;
  max-width: 900px;
  margin: 0 auto;
}

body.a4-print table {
  page-break-inside: auto;
}

body.a4-print tr {
  page-break-inside: avoid;
}

@media print {

  body.a4-print {
    width: 100%;
  }

  body.a4-print .printable-area {
    padding: 20mm;
  }

  @page {
    size: A4;
    margin: 10mm;
  }

}

/* ---------- THERMAL MODE ---------- */

body.thermal-print {
  font-family: monospace;
  font-size: 12px;
}

body.thermal-print .printable-area {
  width: 72mm;
  margin: 0 auto;
  padding-right: 3mm;
}

@media print {

  @page {
    size: 80mm auto;
    margin: 0;
  }

  body.thermal-print {
    width: 80mm;
  }

}

/* Hide thermal layout normally */

.thermal-items{
  display:none;
}

/* Show only thermal layout in thermal print */

body.thermal-print .a4-table{
  display:none;
}

body.thermal-print .thermal-items{
  display:block;
  font-family: monospace;
  font-size:12px;
}

/* Product Name */

body.thermal-print .product{
  font-weight:bold;
  text-transform:uppercase;
  margin-top:4px;
}

/* Qty + Rate + Discount line */

body.thermal-print .line{
  display:flex;
  justify-content:space-between;
}

/* Total Line */

body.thermal-print .thermal-total{
  text-align:right;
  font-weight:bold;
  margin-top:2px;
}

/* Divider Line */

body.thermal-print .divider{
  border-top:1px dashed #000;
  margin:4px 0;
}
}
`}
</style>

      <div style={styles.container}>
        {/* The Invoice Paper */}
        <div className="printable-area" style={styles.invoiceCard}>
          <div style={styles.header}>
            <h1 style={styles.brandName}>Anika Enterprise</h1>
            <p style={styles.brandSub}>Cold Roll Ice Cream Authorized Distributor</p>
            <p style={styles.brandSub}>Atisara (Show para) Singur, Hooghly- 712223</p>
            <p style={styles.brandSub}>Contact Number: 8017414827/ 8017372719</p>
            <h2 style={styles.title}>Invoice</h2>
          </div>

          <div style={styles.metaSection}>
            <p><strong>Invoice No.-</strong> &nbsp; {invoice.invoiceNo}</p>
            <p><strong>Date:</strong> &nbsp; {invoice.date}</p>
            <div style={styles.customerRow}>
              <span style={styles.customerLabel}>
                <strong>Customer:</strong>
              </span>
              <div style={styles.customerDetails}>
                <strong>{invoice.customerName || invoice.customer?.name || "Deleted Customer"}</strong><br />
                {invoice.customer?.address && <>{invoice.customer.address}<br /></>}
                {invoice.customer?.gstin && <>GSTIN: {invoice.customer.gstin}<br /></>}<br />
                {(invoice.customerContact || invoice.customer?.contact )&& (
                  <>{invoice.customerContact || invoice.customer.contact}</>
                )}
              </div>
            </div>
          </div>

       {/* A4 TABLE */}
<table className="a4-table" style={styles.table}>
  <thead>
    <tr style={styles.tableHeaderRow}>
      <th style={styles.th}>S.No</th>
      <th style={styles.th}>Product</th>
      <th style={styles.th}>Qty</th>
      <th style={styles.th}>Disc %</th>
      <th style={styles.th}>Rate</th>
      <th style={styles.th}>Total</th>
    </tr>
  </thead>

  <tbody>
    {invoice.items.map((item, index) => (
      <tr key={index}>
        <td style={styles.td}>{index + 1}</td>
        <td style={styles.td}>{item.productName}</td>
        <td style={styles.td}>{item.qty}</td>
        <td style={styles.td}>{item.discount}%</td>
        <td style={styles.td}>{item.rate}</td>
        <td style={styles.td}>{Number(item.total).toFixed(2)}</td>
      </tr>
    ))}
  </tbody>
</table>

{/* THERMAL RECEIPT FORMAT */}
<div className="thermal-items">
  {invoice.items.map((item, index) => (
    <div key={index} className="thermal-item">

      <div className="divider"></div>

      <div className="product">
        {item.productName?.toUpperCase()}
      </div>

      <div className="line">
        <span>{item.qty} x {item.rate}</span>
        <span>Disc {item.discount}%</span>
      </div>

      <div className="thermal-total">
        Total: ₹{Number(item.total).toFixed(2)}
      </div>

    </div>
  ))}

  <div className="divider"></div>
</div>

          {/* <div style={styles.totalsSection}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Grand Total</span>
              <span style={styles.totalValue}>₹ {Number(invoice.grandTotal).toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Paid</span>
              <div style={styles.dashedBox}>{invoice.paid > 0 ? `₹ ${invoice.paid}` : ""}</div>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Balance Due</span>
              <div style={styles.dashedBox}>{invoice.balance > 0 ? `₹ ${invoice.balance}` : ""}</div>
            </div>
          </div> */}

         <div style={styles.totalsSection}>

  {/* ✅ Grand Total FIRST */}
  <div style={styles.totalRow}>
    <span style={styles.totalLabel}>Grand Total</span>
    <span style={styles.totalValue}>
      ₹ {Number(invoice.grandTotal || 0).toFixed(2)}
    </span>
  </div>

  {/* ✅ Previous Due */}
  <div style={styles.totalRow}>
    <span style={styles.totalLabel}>Previous Due</span>
    <span style={styles.totalValue}>
      ₹ {Number(invoice.previousAmount || 0).toFixed(2)}
    </span>
  </div>

  {/* ✅ Paid */}
  <div style={styles.totalRow}>
    <span style={styles.totalLabel}>Paid</span>
    <span style={styles.totalValue}>
      ₹ {Number(invoice.paid || 0).toFixed(2)}
    </span>
  </div>

  <hr style={{ width: "100%", margin: "5px 0" }} />

  {/* ✅ Final Balance */}
  <div style={styles.totalRow}>
    <span style={{ ...styles.totalLabel, fontWeight: "bold" }}>
      Total Balance Due
    </span>
    <span style={{ ...styles.totalValue, fontWeight: "bold" }}>
      ₹ {Number(invoice.balance || 0).toFixed(2)}
    </span>
  </div>

</div>

          <div style={styles.footer}>
            <p>This is a Computer Generated Invoice</p>
            <p>Thank you for your purchase!</p>
            <div style={styles.signatureSection}>
              <p>Authorised Signatory</p>
            </div>
          </div>
        </div>

        {/* Buttons (Hidden when printing) */}
      <div className="no-print" style={styles.actions}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
       Back
      </button>

      <button style={styles.printBtn} onClick={handlePrint}>
       Save / Print A4
      </button>

      <button style={styles.printBtn} onClick={handleDirectPrint}>
       Thermal Print
      </button>
      </div>
    </div>
  </div>
  );
};

/* ---- Replicating image_03e21a.png Exactly ---- */
const styles = {
  wrapper: {
    background: "#f0f2f5",
    padding: "40px 20px",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    fontFamily: "'Times New Roman', Times, serif",
  },
  container: { width: "100%", maxWidth: "500px" },
  invoiceCard: {
    background: "#fff",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  header: { textAlign: "center", marginBottom: "20px" },
  brandName: { margin: "0", fontSize: "18px", fontWeight: "bold" },
  brandSub: { margin: "2px 0", fontSize: "12px", color: "#333" },
  title: { marginTop: "15px", fontSize: "16px", textDecoration: "underline", fontWeight: "bold" },
  metaSection: { marginBottom: "20px", fontSize: "14px" },
  customerRow: { display: "flex", marginTop: "10px" },
  customerLabel: { width: "80px" },
  customerDetails: { flex: 1 },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: "30px" },
  tableHeaderRow: { borderTop: "2px solid #000", borderBottom: "2px solid #000" },
  th: { padding: "4px 2px", textAlign: "left", fontSize: "13px" },
  td: { padding: "4px 2px", fontSize: "13px", borderBottom: "1px solid #eee" },
  totalsSection: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", marginBottom: "40px" },
  totalRow: { display: "flex", alignItems: "center", gap: "15px" },
  totalLabel: { fontSize: "14px", fontWeight: "bold" },
  totalValue: { minWidth: "80px", textAlign: "right", fontWeight: "bold" },
  dashedBox: { width: "120px", height: "25px", border: "1.5px dashed #000", borderRadius: "4px", textAlign: "center", lineHeight: "25px", fontSize: "12px" },
  footer: { textAlign: "center", fontSize: "13px", borderTop: "1.5px solid #000", paddingTop: "15px" },
  signatureSection: { textAlign: "right", marginTop: "40px" },
  actions: { display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" },
  printBtn: { padding: "10px 25px", background: "#4a6b82", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  backBtn: { padding: "10px 25px", background: "#ccc", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer" }
};

export default InvoicePreview;