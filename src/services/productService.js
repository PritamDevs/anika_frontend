import api from "./api";

export const getProducts = async (
    page = 1,
    limit = 20,
    search = ""
) => {
    const response = await api.get(
        `/api/products?page=${page}&limit=${limit}&search=${search}`
    );

    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(
        `/api/products/${id}`
    );

    return response.data;
};

export const createProduct = async (
    productData
) => {
    const response = await api.post(
        "/api/products/add",
        productData
    );

    return response.data;
};

export const updateProduct = async (
    id,
    productData
) => {
    const response = await api.put(
        `/api/products/${id}`,
        productData
    );

    return response.data;
};

export const getAllProductsList =
    async () => {

        const { data } =
            await api.get(
                "/api/products/all"
            );

        return data.products || [];
    };