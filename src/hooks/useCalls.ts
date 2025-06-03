import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/api";

export function useCalls() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: UserService.getCalls,
    staleTime: 1000 * 60 * 1,
  });

  return {
    calls: data,
    isLoading,
    error,
    refetchUsers: refetch,
  };
}
