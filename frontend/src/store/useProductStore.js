import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";


// base url will be dynamic depending on the environment
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

export const useProductStore = create((set, get) => ({
  // products state
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  // form state
  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {

      const { formData } = get();
      //console.log("addProduct function called", {BASE_URL});
      await axios.post(`${BASE_URL}/product`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("Error in addProduct function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    
    try {
      const response = await axios.get(`${BASE_URL}/product/producthome`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      if (err.status == 429) set({ error: "Rate limit exceeded", products: [] });
      else set({ error: "Something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    //console.log("deleteProduct function called", id);
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/product/${id}`);
      set((prev) => ({ products: prev.products.filter((product) => product.id !== id) }));
      toast.success(t('tr: Product deleted successfully'));
    } catch (error) {
      console.log("Error in deleteProduct function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/product/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data, // pre-fill form with current product data
        error: null,
      });
    } catch (error) {
      console.log("Error in fetchProduct function", error);
      set({ error: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },
  updateProduct: async (id, tmupd_succesfull,tmupd_error) => {
    set({ loading: true });
    
    try {
      const { formData } = get();
      const response = await axios.put(`${BASE_URL}/product/${id}`, formData);
      set({ currentProduct: response.data.data });
      //const tm = t('tr: Product updated successfully')
      toast.success(tmupd_succesfull);
    } catch (error) {
      toast.error(tmupd_error);
      console.log("Error in updateProduct function", error);
    } finally {
      set({ loading: false });
    }
  },
}));
