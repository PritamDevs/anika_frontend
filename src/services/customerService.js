import api from "./api";

export const getCustomers = async (
    page = 1,
    limit = 20,
    search = ""
) => {
    const response = await api.get(
        `/api/customers?page=${page}&limit=${limit}&search=${search}`
    );

    return response.data;
};

export const deleteCustomer = async (id) => {
    const response = await api.delete(
        `/api/customers/${id}`
    );

    return response.data;
};

export const createCustomer = async (
    customerData
) => {
    const response = await api.post(
        "/api/customers/add",
        customerData
    );

    return response.data;
};

export const updateCustomer = async (
    id,
    customerData
) => {
    const response = await api.put(
        `/api/customers/${id}`,
        customerData
    );

    return response.data;
};

export const getAllCustomers =
    async () => {

        let allCustomers = [];

        let page = 1;

        let totalPages = 1;

        while (page <= totalPages) {

            const { data } =
                await api.get(
                    `/api/customers?page=${page}`
                );

            allCustomers = [
                ...allCustomers,
                ...(data.customers || [])
            ];

            totalPages =
                data.totalPages || 1;

            page++;
        }

        return allCustomers;
    };

export const updateOpeningBalance =
    async (
        customerId,
        openingBalance
    ) => {

        const { data } =
            await api.put(
                `/api/customers/${customerId}/opening-balance`,
                {
                    openingBalance
                }
            );

        return data;
    };