import api from "./api";

export const createInvoice = async (
    invoiceData
) => {
    const response = await api.post(
        "/api/invoices/create",
        invoiceData
    );

    return response.data;
};

export const getAllInvoices =
    async () => {

        const { data } =
            await api.get("/api/invoices");

        return data.invoices || data;
    };