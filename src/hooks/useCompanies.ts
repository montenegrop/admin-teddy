import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/api";

export function useCompanies() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["companies"],
    queryFn: UserService.getCompanies,
  });

  return {
    companies: data,
    isLoading,
    error,
    refetchCompanies: refetch,
  };
}
