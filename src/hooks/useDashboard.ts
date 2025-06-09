import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/api";

export function useDashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: UserService.getDashboard,
  });

  return {
    dashboardData: data,
    isLoading,
    error,
    refetchCompanies: refetch,
  };
}
