import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';


export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    ordersLoading: false,
    orders: [],
    orderError: null,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });
        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("password do not match");
        }

        try {
            const res = await axios.post("/auth/signup", { name, email, password });
            set({ user: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occuredwe ")
        }

    },

    login: async ({ email, password }) => {
        set({ loading: true })

        try {
            const res = await axios.post("/auth/login", { email, password });
            set({ user: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occured ")
        }

    },

    checkAuth: async () => { //this is used to check if the user is logged in when the app loads
        set({ checkingAuth: true }); // first set checkingAuth to true

        try {
            const response = await axios.get("/auth/profile"); // from this endpoint we get the user if logged in
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            set({ checkingAuth: false, user: null });

        }
    },

    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ user: null });
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred ")
        }
    },

    fetchOrders: async () => {
        set({ ordersLoading: true, orderError: null });
        try {
            const response = await axios.get("/payments/user-orders");
            set({ orders: response.data.orders, ordersLoading: false });
        } catch (error) {
            set({
                orderError: error.response?.data?.message || "Error fetching orders",
                ordersLoading: false
            });
            toast.error(error.response?.data?.message || "Error fetching orders");
        }
    },
    refreshToken: async () => {
        // Prevent multiple simultaneous refresh attempts
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
            const response = await axios.post("/auth/refresh-token");
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    },

}))
let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // If a refresh is already in progress, wait for it to complete
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }

                // Start a new refresh process
                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login or handle as needed
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);