import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/api";

export function useCalls() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["calls"],
    queryFn: UserService.getCalls,
  });

  return {
    calls: data,
    isLoading,
    error,
    refetchCalls: refetch,
  };
}
