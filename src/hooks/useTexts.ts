import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/api";

export function useTexts() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["texts"],
    queryFn: UserService.getTexts,
  });

  return {
    texts: data,
    isLoading,
    error,
    refetchtexts: refetch,
  };
}
