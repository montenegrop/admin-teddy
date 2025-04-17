import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/api";

export function useCompanies() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: UserService.getCompanies,
    staleTime: 1000 * 60 * 1,
  });

  return {
    companies: data,
    isLoading,
    error,
    refetchUsers: refetch,
  };
}
