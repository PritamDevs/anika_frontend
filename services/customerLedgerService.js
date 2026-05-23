import axios from "axios";

export const getCustomerLedger = async (
    customerId
) => {

    const response = await axios.get(
        `http://localhost:5000/api/customers/${customerId}/ledger`
    );

    return response.data;
};