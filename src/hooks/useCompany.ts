import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService, type UpdateCompanyData } from "@/services/api";

export function useCompany(companyId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => UserService.getCompany(companyId),
    enabled: !!companyId,
  });

  const updateMutation = useMutation({
    mutationFn: (updateData: UpdateCompanyData) => 
      UserService.updateCompany(companyId, updateData),
    onSuccess: () => {
      // Invalidate and refetch company data
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
      // Also invalidate companies list to ensure it's updated
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return {
    company: data,
    isLoading,
    error,
    refetchCompany: refetch,
    updateCompany: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    updateSuccess: updateMutation.isSuccess,
  };
}