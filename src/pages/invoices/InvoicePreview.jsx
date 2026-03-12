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
  width: 70mm;
  margin: 0 auto;
}

/* Page setup for thermal printer */
@media print {

  @page {
    size: 80mm auto;
    margin: 0;
  }

  body.thermal-print {
    width: 80mm;
  }

  body.thermal-print table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  body.thermal-print th,
  body.thermal-print td {
    font-size: 11px;
    padding: 2px 2px;
    word-wrap: break-word;
  }

  /* Column widths (safer for 80mm receipt) */

  body.thermal-print th:nth-child(1),
  body.thermal-print td:nth-child(1) {
    width: 8%;
    text-align: center;
  }

  body.thermal-print th:nth-child(2),
  body.thermal-print td:nth-child(2) {
    width: 36%;
  }

  body.thermal-print th:nth-child(3),
  body.thermal-print td:nth-child(3) {
    width: 10%;
    text-align: center;
  }

  body.thermal-print th:nth-child(4),
  body.thermal-print td:nth-child(4) {
    width: 12%;
    text-align: center;
  }

  body.thermal-print th:nth-child(5),
  body.thermal-print td:nth-child(5) {
    width: 14%;
    text-align: right;
  }

  body.thermal-print th:nth-child(6),
  body.thermal-print td:nth-child(6) {
    width: 18%;
    text-align: right;
    white-space: nowrap;
  }
  body.thermal-print td {
  font-variant-numeric: tabular-nums;
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
              <span style={styles.customerLabel}><strong>Customer:</strong></span>
              <div style={styles.customerDetails}>
                <strong>{invoice.customer.name}</strong><br />
                {invoice.customer.address}<br />
                {invoice.customer.gstin && `GSTIN: ${invoice.customer.gstin},`}<br />
                {invoice.customer.contact}
              </div>
            </div>
          </div>

          <table style={styles.table}>
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
                  <td style={styles.td}>{item.productName || "Product"}</td>
                  <td style={styles.td}>{item.qty}</td>
                  <td style={styles.td}>{item.discount}%</td>
                  <td style={styles.td}>{item.rate}</td>
                  <td style={styles.td}>{Number(item.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.totalsSection}>
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