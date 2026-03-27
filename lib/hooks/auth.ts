import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    _id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

async function adminLogin({ rememberMe: _, ...payload }: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/api/auth/admin/login",
    payload
  );
  return data;
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: adminLogin,
    onSuccess: (data, variables) => {
      const storage = variables.rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));
    },
  });
}

// ── Forgot Password ──────────────────────────────────────────────────────────

async function forgotPassword(payload: { email: string }): Promise<{ message: string }> {
  const { data } = await api.post("/api/auth/admin/forgot-password", payload);
  return data;
}

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}

// ── Reset Password ───────────────────────────────────────────────────────────

interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  const { data } = await api.post("/api/auth/admin/reset-password", payload);
  return data;
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}
