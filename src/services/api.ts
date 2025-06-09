import axios from "axios";
import { AuthStorage } from "@/lib/auth";
import { FDEV_API_URL } from "@/constants";

const apiClient = axios.create({
  baseURL: FDEV_API_URL + "admin/",
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
  address: string;
  created_at: string;
  email: string;
  last_activity: string;
  sms_remining: number;
}

export interface Call {
  id: string;
  name: string;
  twilio: string;
  caller: string;
  duration: string;
  summary: string;
  audio_url: string;
  grade: string;
}

export interface Dashboard {
  companies_count: number;
  calls_count: number;
  calls_today: number;
  sms_today: number;
  low_sms_companies: Company[];
}

export const UserService = {
  getCompanies: async (): Promise<Company[]> => {
    try {
      const password = AuthStorage.getPassword();
      const response = await apiClient.get<Company[]>("/companies/", {
        params: { password },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },
  getCalls: async (): Promise<Call[]> => {
    try {
      const password = AuthStorage.getPassword();
      const response = await apiClient.get<Call[]>("/calls/", {
        params: { password, limit: 20, offset: 0 },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },
  getDashboard: async (): Promise<Dashboard> => {
    try {
      const password = AuthStorage.getPassword();
      const response = await apiClient.get<Dashboard>("/dashboard/", {
        params: { password },
      });
      return response.data;
    } catch (error) {
      return {
        companies_count: -1,
        calls_count: -1,
        calls_today: -1,
        sms_today: -1,
        low_sms_companies: [],
      };
    }
  },
};
