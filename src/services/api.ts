import axios from "axios";
import { AuthStorage } from "@/lib/auth";

const apiClient = axios.create({
  baseURL: "https://api.tryteddy.com/f1dev/admin/",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Company {
  id: string;
  name: string;
  twilio_phone: string;
  phone: string;
  company_category_id: number;
  timezone_offset_mins: number;
  timezone: string;
  city: string;
  email: string;
}

export const UserService = {
  getCompanies: async (): Promise<Company[]> => {
    try {
      const password = AuthStorage.getPassword();
      const response = await apiClient.get<Company[]>("/companies/", {
        params: { password, appointment_id: 1 },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },
};
