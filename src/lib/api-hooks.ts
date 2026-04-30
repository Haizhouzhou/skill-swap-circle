import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useBootstrapQuery() {
  return useQuery({
    queryKey: ["bootstrap"],
    queryFn: async () => (await api.bootstrap()).data,
  });
}

export function useBrowseListingsQuery(params: Parameters<typeof api.browseListings>[0]) {
  return useQuery({
    queryKey: ["listings", "browse", params],
    queryFn: async () => (await api.browseListings(params)).data,
  });
}

export function useRecommendationsQuery(userId: string | null | undefined, intent: "learn" | "teach", limit = 4) {
  return useQuery({
    queryKey: ["recommendations", userId ?? "visitor", intent, limit],
    queryFn: async () => (await api.getRecommendations(userId ?? null, intent, limit)).data,
  });
}

export function useUserProfileQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ["users", "profile", userId],
    queryFn: async () => (await api.getUserProfile(userId!)).data,
    enabled: Boolean(userId),
  });
}

export function useUserDashboardQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ["users", "dashboard", userId],
    queryFn: async () => (await api.getUserDashboard(userId!)).data,
    enabled: Boolean(userId),
  });
}

export function useListingDetailQuery(listingId: string | undefined, userId?: string | null) {
  return useQuery({
    queryKey: ["listings", "detail", listingId, userId ?? null],
    queryFn: async () => (await api.getListingDetail(listingId!, userId)).data,
    enabled: Boolean(listingId),
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bootstrap"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useCreateListingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bootstrap"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
