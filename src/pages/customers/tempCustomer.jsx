import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";

const CustomerDetails = () => {

    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [returns, setReturns] = useState([]);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [activeTab, setActiveTab] = useState("invoices");

    const navigate = useNavigate();

    const typeColor = {
        Invoice: "#2563eb",
        "Invoice Payment": "#16a34a",
        Payment: "#16a34a",

        "Return (Cash)": "#ea580c",
        "Return (Advance)": "#ea580c",

        "Advance Used": "#7c3aed",
        "Advance Received": "#0891b2",
        "Opening Balance": "#b45309"
    };


    useEffect(() => {

        const fetchCustomer = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    `${BACKEND_URL}/api/customers/${id}/details`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to load customer"
                    );
                }

                setCustomer(data.customer);

                setInvoices(
                    data.invoices || []
                );

                setPayments(
                    data.payments || []
                );

                setReturns(
                    data.returns || []
                );

                setLedgerEntries(
                    data.ledger || []
                );

            } catch (error) {

                console.error(
                    "CUSTOMER DETAILS ERROR:",
                    error
                );

                toast.error(
                    error.message ||
                    "Failed to load customer details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();

    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!customer) {
        return (
            <div>
                Customer not found
            </div>
        );
    }


    return (
        <div style={{ padding: "20px" }}>

            <div style={styles.customerInfo}>
                <h1
                    style={{
                        marginBottom: "10px",
                        color: "#01292f"
                    }}
                >
                    {customer.name}
                </h1>

                <p>
                    📞 {customer.contact || "N/A"}
                </p>

                <p>
                    📍 {customer.address || "N/A"}
                </p>
            </div>

            <div style={styles.pageContainer}>
                <div style={styles.summaryGrid}>

                    <div style={styles.card}>
                        <h4>TOTAL PURCHASE</h4>
                        <h2>
                            ₹ {(customer.totalPurchase || 0).toLocaleString()}
                        </h2>
                        <span>ALL TIME</span>
                    </div>

                    <div style={styles.card}>
                        <h4>TOTAL PAID</h4>
                        <h2>
                            ₹ {(customer.totalPaid || 0).toLocaleString()}
                        </h2>
                        <span>ALL TIME</span>
                    </div>

                    <div style={styles.card}>
                        <h4>OUTSTANDING DUE</h4>
                        <h2>
                            ₹ {(customer.dueAmount || 0).toLocaleString()}
                        </h2>
                        <span>CURRENT</span>
                    </div>

                    <div style={styles.card}>
                        <h4>ADVANCE</h4>
                        <h2>
                            ₹ {(customer.advanceAmount || 0).toLocaleString()}
                        </h2>
                        <span>CURRENT</span>
                    </div>
                    <div style={styles.card}>
                        <h4>OPENING BALANCE</h4>

                        <h2>
                            ₹ {Math.abs(
                                customer.openingBalance || 0
                            ).toLocaleString()}
                        </h2>

                        <span>
                            {(customer.openingBalance || 0) >= 0
                                ? "MIGRATED DUE"
                                : "MIGRATED ADVANCE"}
                        </span>
                    </div>
                </div>
                <div style={styles.tabs}>

                    <button
                        style={
                            activeTab === "invoices"
                                ? styles.activeTab
                                : styles.tab
                        }
                        onClick={() => setActiveTab("invoices")}
                    >
                        Invoices
                    </button>

                    <button
                        style={
                            activeTab === "payments"
                                ? styles.activeTab
                                : styles.tab
                        }
                        onClick={() => setActiveTab("payments")}
                    >
                        Payments
                    </button>

                    <button
                        style={
                            activeTab === "returns"
                                ? styles.activeTab
                                : styles.tab
                        }
                        onClick={() => setActiveTab("returns")}
                    >
                        Returns
                    </button>

                    <button
                        style={
                            activeTab === "ledger"
                                ? styles.activeTab
                                : styles.tab
                        }
                        onClick={() => setActiveTab("ledger")}
                    >
                        Ledger
                    </button>

                </div>

                {activeTab === "invoices" && (

                    <div style={styles.sectionContainer}>

                        <h2 style={styles.sectionTitle}>
                            Invoice History
                        </h2>

                        <div style={styles.tableWrapper}>

                            <table style={styles.table}>

                                <thead>
                                    <tr>
                                        <th style={styles.th}>Invoice No</th>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Total</th>
                                        <th style={styles.th}>Paid</th>
                                        <th style={styles.th}>Due</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {invoices.length === 0 ? (

                                        <tr>
                                            <td
                                                style={styles.td}
                                                colSpan="6"
                                            >

                                                No invoices found
                                            </td>
                                        </tr>

                                    ) : (

                                        invoices.map((invoice) => (

                                            <tr key={invoice._id}>

                                                <td style={styles.td}>
                                                    {invoice.invoiceNumber}
                                                </td>

                                                <td style={styles.td}>
                                                    {new Date(invoice.date)
                                                        .toLocaleDateString()}
                                                </td>

                                                <td style={styles.td}>
                                                    ₹ {invoice.totalAmount}
                                                </td>

                                                <td style={styles.td}>
                                                    ₹ {invoice.paidAmount}
                                                </td>

                                                <td style={styles.td}>
                                                    ₹ {invoice.totalDueAmount}
                                                </td>

                                                <td style={styles.td}>

                                                    <button
                                                        style={styles.viewBtn}
                                                        onClick={() =>
                                                            navigate("/invoice/preview", {
                                                                state: {
                                                                    invoiceData: {
                                                                        invoiceNo: invoice.invoiceNumber,
                                                                        date: invoice.date,
                                                                        customerName: invoice.customerName,

                                                                        items: (invoice.products || []).map(p => ({
                                                                            productName: p.productName,
                                                                            qty: p.qty,
                                                                            rate: p.rate,
                                                                            discount: p.discount || 0,
                                                                            total:
                                                                                p.qty *
                                                                                p.rate *
                                                                                (1 - (p.discount || 0) / 100)
                                                                        })),

                                                                        grandTotal: invoice.totalAmount,
                                                                        paid: invoice.paidAmount,
                                                                        previousAmount: invoice.previousAmount,
                                                                        totalDueAmount: invoice.totalDueAmount,
                                                                        advanceUsed: invoice.advanceUsed
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

                {activeTab === "payments" && (
                    <div style={styles.sectionContainer}>
                        <h2 style={styles.sectionTitle}>
                            Payment History
                        </h2>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Amount</th>
                                        <th style={styles.th}>Mode</th>
                                        <th style={styles.th}>Reference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td style={styles.td} colSpan="4">
                                                No payments found
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((payment) => (

                                            <tr key={payment._id}>

                                                <td style={styles.td}>
                                                    {new Date(
                                                        payment.date
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td style={styles.td}>
                                                    ₹ {payment.amount}
                                                </td>

                                                <td style={styles.td}>
                                                    {payment.paymentMode}
                                                </td>

                                                <td style={styles.td}>
                                                    {payment.reference || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "returns" && (
                    <div style={styles.sectionContainer}>
                        <h2 style={styles.sectionTitle}>
                            Return History
                        </h2>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Amount</th>
                                        <th style={styles.th}>Mode</th>
                                        <th style={styles.th}>Reference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {returns.length === 0 ? (
                                        <tr>
                                            <td style={styles.td} colSpan="4">
                                                No returns found
                                            </td>
                                        </tr>
                                    ) : (
                                        returns.map((ret) => (

                                            <tr key={ret._id}>

                                                <td style={styles.td}>
                                                    {new Date(
                                                        ret.date
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td style={styles.td}>
                                                    ₹ {ret.amount}
                                                </td>

                                                <td style={styles.td}>
                                                    {ret.paymentMode}
                                                </td>

                                                <td style={styles.td}>
                                                    {ret.reference || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "ledger" && (
                    <div style={styles.sectionContainer}>
                        <h2 style={styles.sectionTitle}>
                            Customer Ledger
                        </h2>

                        <div style={styles.ledgerSummaryGrid}>
                            <div style={styles.card}>
                                <h4>CURRENT DUE</h4>
                                <h2>
                                    ₹ {(customer.dueAmount || 0).toLocaleString()}
                                </h2>
                            </div>

                            <div style={styles.card}>
                                <h4>ADVANCE BALANCE</h4>
                                <h2>
                                    ₹ {(customer.advanceAmount || 0).toLocaleString()}
                                </h2>
                            </div>
                            <div style={styles.card}>
                                <h4>TOTAL ENTRIES</h4>
                                <h2>
                                    {ledgerEntries.length}
                                </h2>
                            </div>
                        </div>


                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Type</th>
                                        <th style={styles.th}>Reference</th>
                                        <th style={styles.th}>Added</th>
                                        <th style={styles.th}>Deducted</th>
                                        <th style={styles.th}>Due</th>
                                        <th style={styles.th}>Advance</th>
                                        <th style={styles.th}>Description</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {ledgerEntries.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                style={styles.td}
                                            >
                                                No ledger entries found
                                            </td>
                                        </tr>
                                    ) : (
                                        [...ledgerEntries]
                                            .reverse()
                                            .map(
                                                (entry, index) => (
                                                    <tr key={index}>
                                                        <td style={styles.td}>
                                                            {new Date(
                                                                entry.date
                                                            ).toLocaleDateString()}
                                                        </td>

                                                        <td
                                                            style={{
                                                                ...styles.td,
                                                                fontWeight: "600",
                                                                color:
                                                                    typeColor[entry.type] || "#000"
                                                            }}
                                                        >
                                                            {entry.type}
                                                        </td>

                                                        <td style={styles.td}>
                                                            {entry.reference}
                                                        </td>

                                                        <td style={styles.td}>

                                                            {entry.type === "Return (Cash)"
                                                                ? "-"
                                                                : entry.debit
                                                                    ? `₹ ${entry.debit}`
                                                                    : "-"}

                                                        </td>

                                                        <td style={styles.td}>

                                                            {entry.type === "Return (Cash)"
                                                                ? "-"
                                                                : entry.credit
                                                                    ? `₹ ${entry.credit}`
                                                                    : "-"}

                                                        </td>

                                                        <td
                                                            style={{
                                                                ...styles.td,
                                                                color: "#dc2626",
                                                                fontWeight: "bold"
                                                            }}
                                                        >
                                                            {entry.due > 0
                                                                ? `₹ ${entry.due.toFixed(2)}`
                                                                : "-"
                                                            }
                                                        </td>

                                                        <td
                                                            style={{
                                                                ...styles.td,
                                                                color: "green",
                                                                fontWeight: "bold"
                                                            }}
                                                        >
                                                            {entry.advance > 0
                                                                ? `₹ ${entry.advance.toFixed(2)}`
                                                                : "-"
                                                            }
                                                        </td>

                                                        <td style={styles.td}>

                                                            {entry.type === "Opening Balance" &&
                                                                "Migrated from previous system"}

                                                            {entry.type === "Invoice" &&
                                                                "Purchase added"}

                                                            {entry.type === "Invoice Payment" &&
                                                                "Payment received during invoice creation"}

                                                            {entry.type === "Payment" &&
                                                                "Customer payment received"}

                                                            {entry.type === "Return (Cash)" &&
                                                                "Cash refunded to customer"}

                                                            {entry.type === "Return (Advance)" &&
                                                                "Return adjusted against balance"}

                                                            {entry.type === "Advance Used" &&
                                                                "Advance adjusted"}

                                                            {entry.type === "Advance Received" &&
                                                                "Advance received"}

                                                        </td>
                                                    </tr>
                                                )
                                            )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {

    summaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
        marginTop: "20px"
    },
    ledgerSummaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, 1fr)",
        gap: "20px",
        marginTop: "20px",
        marginBottom: "30px"
    },
    card: {
        background:
            "linear-gradient(135deg,#8ea5b8,#7d9ab0)",
        borderRadius: "16px",
        padding: "20px",
        color: "#fff",
        textAlign: "center",
        boxShadow:
            "0 4px 12px rgba(0,0,0,0.15)",
        minHeight: "120px",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        background: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },
    th: {
        background: "#01292f",
        color: "#fff",
        padding: "12px",
        textAlign: "left"
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #e5e7eb"
    },
    pageContainer: {
        width: "100%",
        padding: "20px"
    },

    sectionContainer: {
        marginTop: "30px",
        width: "100%"
    },

    sectionTitle: {
        marginBottom: "15px",
        color: "#01292f",
        fontSize: "24px",
        fontWeight: "700"
    },
    viewBtn: {
        background: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600"
    },
    tabs: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "30px",
        marginBottom: "20px"
    },
    tab: {
        padding: "10px 20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
        cursor: "pointer",
        fontWeight: "600"
    },
    activeTab: {
        padding: "10px 20px",
        borderRadius: "8px",
        background: "#01292f",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontWeight: "600"
    },
    tableWrapper: {
        width: "100%",
        background: "#fff",
        borderRadius: "12px",
        maxHeight: "500px",
        overflowY: "auto",
        overflowX: "auto",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)"
    },
    customerInfo: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        wordBreak: "break-word"
    },
};

export default CustomerDetails;