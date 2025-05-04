import {  useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/apiFetch';

export const useSignup= () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: {
        email: string;
        username: string;
        password: string;
        firstName: string;
        lastName: string;
      }) => {
        const res = await apiFetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auth", "@me"] });
      },
    });
  };
  export const useLoginMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: { username: string; password: string }) => {
        const res = await apiFetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auth", "@me"] });
      },
    });
  };
  export const useGuestLoginMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async () => {
        const res = await apiFetch("/api/auth/guest", {
          method: "POST",
        });
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auth", "@me"] });
      },
    });
  }; 
  export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async () => {
        const res = await apiFetch("/api/auth/logout", {
          method: "POST",
        });
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auth", "@me"] });
      },
    });
  };

