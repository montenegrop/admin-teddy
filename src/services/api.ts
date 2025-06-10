import axios, { AxiosError } from "axios";
import { AuthStorage } from "@/lib/auth";
import { FDEV_API_URL } from "@/constants";

const apiClient = axios.create({
  baseURL: FDEV_API_URL + "admin/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Error response type
interface ErrorResponse {
  detail?: string | { message: string; errors?: any[] };
  message?: string;
  error?: boolean;
  error_type?: string;
}

// Helper function to extract error message
const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === "string") {
      return detail;
    } else if (detail.message) {
      return detail.message;
    }
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// Custom error class
export class ApiError extends Error {
  public statusCode: number;
  public errorType?: string;
  public errors?: any[];

  constructor(
    message: string,
    statusCode: number,
    errorType?: string,
    errors?: any[]
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.errors = errors;
  }
}

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const statusCode = error.response?.status || 500;
    const errorMessage = extractErrorMessage(error);
    const errorType = error.response?.data?.error_type;
    const errors = error.response?.data?.detail.errors;

    // Log error for debugging
    console.error(`API Error [${statusCode}]:`, errorMessage);

    // Special handling for authentication errors
    if (statusCode === 401) {
      // Clear stored password on authentication failure
      AuthStorage.clearPassword();
    }

    throw new ApiError(errorMessage, statusCode, errorType, errors);
  }
);

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
  created_at: string;
}

export interface Dashboard {
  companies_count: number;
  calls_count: number;
  calls_today: number;
  sms_today: number;
  low_sms_companies: Company[];
  no_calls_companies: Company[];
}

export interface CompanyUpdateData {
  name: string;
  email: string;
  phone: string;
  twilio_phone: string;
  address: string;
  sms_remining: number;
}

export const UserService = {
  getCompanies: async (): Promise<Company[]> => {
    const password = AuthStorage.getPassword();
    if (!password) {
      throw new ApiError(
        "Please enter your admin password",
        401,
        "no_password"
      );
    }

    try {
      const response = await apiClient.get<Company[]>("/companies/", {
        params: { password },
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch companies", 500);
    }
  },

  getCompany: async (companyId: string): Promise<Company> => {
    const password = AuthStorage.getPassword();
    if (!password) {
      throw new ApiError(
        "Please enter your admin password",
        401,
        "no_password"
      );
    }

    try {
      const response = await apiClient.get<Company>(
        `/companies/${companyId}/`,
        {
          params: { password },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch company details", 500);
    }
  },

  updateCompany: async (
    companyId: string,
    data: CompanyUpdateData
  ): Promise<Company> => {
    const password = AuthStorage.getPassword();
    if (!password) {
      throw new ApiError(
        "Please enter your admin password",
        401,
        "no_password"
      );
    }

    try {
      const response = await apiClient.post<Company>(
        `/companies/${companyId}/update/`,
        { ...data, password }
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to update company", 500);
    }
  },

  getCalls: async (): Promise<Call[]> => {
    const password = AuthStorage.getPassword();
    if (!password) {
      throw new ApiError(
        "Please enter your admin password",
        401,
        "no_password"
      );
    }

    try {
      const response = await apiClient.get<Call[]>("/calls/", {
        params: { password, limit: 20, offset: 0 },
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch calls", 500);
    }
  },

  getDashboard: async (): Promise<Dashboard> => {
    const password = AuthStorage.getPassword();
    if (!password) {
      throw new ApiError(
        "Please enter your admin password",
        401,
        "no_password"
      );
    }

    try {
      const response = await apiClient.get<Dashboard>("/dashboard/", {
        params: { password },
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch dashboard data", 500);
    }
  },
};
