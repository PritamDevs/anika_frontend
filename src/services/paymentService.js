import api from "./api";

export const getAllPayments = async () => {
    const { data } =
        await api.get("/api/payments");

    return data;
};

export const createPayment = async (
    payload
) => {
    const { data } =
        await api.post(
            "/api/payments",
            payload
        );

    return data;
};

export const updatePayment = async (
    id,
    payload
) => {
    const { data } =
        await api.put(
            `/api/payments/${id}`,
            payload
        );

    return data;
};