import {
    useState,
    useEffect
} from "react";

import toast from "react-hot-toast";

import {
    getAllCustomers,
    updateOpeningBalance
} from "../../services/customerService";

const OpeningBalance = () => {

    const [customers, setCustomers] =
        useState([]);

    const [selectedCustomer,
        setSelectedCustomer] =
        useState("");

    const [openingBalance,
        setOpeningBalance] =
        useState("");

    useEffect(() => {

        const load = async () => {

            const data =
                await getAllCustomers();

            setCustomers(data);

        };

        load();

    }, []);

    const handleSave =
        async () => {

            try {

                await updateOpeningBalance(
                    selectedCustomer,
                    Number(openingBalance)
                );

                toast.success(
                    "Opening balance saved"
                );

            } catch {

                toast.error(
                    "Failed to save"
                );

            }
        };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <>
                    <h2 style={styles.title}>
                        Customer Opening Balance
                    </h2>

                    <p
                        style={{
                            color: "#ffffff",
                            marginTop: "-10px",
                            marginBottom: "25px"
                        }}
                    >
                        Configure balances from your previous accounting system.
                    </p>
                </>

                <select
                    style={styles.input}
                    value={selectedCustomer}
                    onChange={(e) =>
                        setSelectedCustomer(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Select Customer
                    </option>

                    {customers.map((c) => (
                        <option
                            key={c._id}
                            value={c._id}
                        >
                            {c.name}
                        </option>
                    ))}
                </select>

                <input
                    style={styles.input}
                    type="number"
                    placeholder="5000 = Due, -1200 = Advance"
                    value={openingBalance}
                    onChange={(e) =>
                        setOpeningBalance(
                            e.target.value
                        )
                    }
                />

                <div style={styles.helpText}>
                    Positive amount = Opening Due
                    <br />
                    Negative amount = Opening Advance
                </div>

                <button
                    style={styles.saveBtn}
                    onClick={handleSave}
                >
                    Save Opening Balance
                </button>

            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "30px",
        minHeight: "100vh",
        backgroundColor: "#f8fafc"
    },

    card: {
        maxWidth: "700px",
        margin: "0 auto",
        background:
            "linear-gradient(135deg, #60a3a9 0%, #86a2b8 100%)",
        padding: "30px",
        borderRadius: "16px",
        boxShadow:
            "0 10px 25px rgba(0,0,0,0.12)"
    },

    title: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#fff",
        marginBottom: "25px"
    },

    input: {
        width: "100%",
        padding: "14px",
        borderRadius: "10px",
        border: "1px solid #dbeafe",
        marginBottom: "15px",
        fontSize: "15px",
        outline: "none"
    },

    helpText: {
        color: "#fff",
        fontSize: "14px",
        marginBottom: "20px",
        lineHeight: "1.6"
    },

    saveBtn: {
        width: "100%",
        padding: "14px",
        backgroundColor: "#01292f",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        fontWeight: "bold",
        fontSize: "15px",
        cursor: "pointer"
    }
};

export default OpeningBalance;