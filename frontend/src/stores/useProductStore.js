import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';
//import products from 'razorpay/dist/types/products';


export const useProductStore = create((set, get) => ({

    products: [],
    loading: false,

    setProducts: (products) => set({ products }),
    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post('/products', productData);
            set((prevState) => {
                return { products: [...prevState.products, res.data], loading: false }
            })
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occured while creating product");
            set({ loading: false });
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const res = await axios.get('/products');
            set({ products: res.data.products, loading: false });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occured while fetching products");
            set({ loading: false });
        }
    },

    deleteProduct: async (ProductId) => {
        set({ loading: true });
        try {
            await axios.delete(`/products/${ProductId}`);

            set((prevState) => ({
                products: prevState.products.filter((product) => product._id !== ProductId),
                featuredProducts: prevState.featuredProducts
                    ? prevState.featuredProducts.filter((product) => product._id !== ProductId)
                    : prevState.featuredProducts, // safety check in case it's undefined
                loading: false,
            }));

            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while deleting product");
            set({ loading: false });
        }
    },


    toggleFeaturedProduct: async (ProductId) => {
        set({ loading: true });
        try {
            const res = await axios.patch(`/products/${ProductId}`);
            // int this function first it take previous state of product and then it map through all the products and if the product id is same as the id passed in the function then it update that product with the response data otherwise it return the same product
            //let when user click on the featured button it will toggle the featured state of the product and update the product in the state
            set((prevProduct) => ({
                products: prevProduct.products.map((product) =>
                    product._id === ProductId ? res.data : product
                ),
                loading: false
            }))
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occured while toggling featured product");
            set({ loading: false });

        }
    },

    fetchProductByCategory: async (category) => {
        set({ loading: true });
        try {
            const res = await axios.get(`/products/category/${category}`);
            set({ products: res.data.products, loading: false });

        } catch (error) {
            toast.error(error.response?.data?.message || "An error occured while fetching products by category");
            set({ loading: false });

        }
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/products/featured");
            set({ products: res.data.products || [], loading: false });
        } catch (error) {
            set({ error: "Failed to Fetch Products ", loading: false });
            console.log("Error in fetching Featurd Product :", error);
        }
    },


}));