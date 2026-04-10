import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface AdminProfile {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  notificationSettings: {
    push_enabled: boolean;
    email_enabled: boolean;
    transactions: boolean;
    promotions: boolean;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  role?: string;
  notificationSettings?: Partial<AdminProfile["notificationSettings"]>;
}

export function useProfile() {
  return useQuery<AdminProfile>({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const res = await api.get<AdminProfile>("/api/admin/profile");
      return res.data;
    },
    staleTime: 0,
  });
}

export interface TeamMember {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export function useTeamMembers() {
  return useQuery<TeamMember[]>({
    queryKey: ["team-members"],
    queryFn: async () => {
      const res = await api.get<TeamMember[]>("/api/admin/team");
      return res.data;
    },
  });
}

export function useAddTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      fullName: string;
      email: string;
      phone: string;
      role: string;
    }) => {
      const res = await api.post<{ message: string; user: AdminProfile }>("/api/admin/team", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      const res = await api.put<{ message: string }>("/api/admin/profile/password", payload);
      return res.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const res = await api.put<{ message: string; admin: AdminProfile }>("/api/admin/profile", payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["admin-profile"], data.admin);
    },
  });
}

export interface ServiceZone {
  _id: string;
  name: string;
  coverageAreas: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useZones() {
  return useQuery<ServiceZone[]>({
    queryKey: ["zones"],
    queryFn: async () => {
      const res = await api.get<ServiceZone[]>("/api/admin/zones");
      return res.data;
    },
  });
}

export function useAddZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      coverageAreas: string[];
      activateImmediately: boolean;
    }) => {
      const res = await api.post<{ message: string; zone: ServiceZone }>("/api/admin/zones", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

export function useDeleteZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (zoneId: string) => {
      const res = await api.delete<{ message: string }>(`/api/admin/zones/${zoneId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}
