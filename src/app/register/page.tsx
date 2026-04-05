// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { UserPlus, Mail, ArrowRight, KeyRound, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthInput } from "@/components/auth/AuthInput";
import { authService } from "@/services/authService";
import { RegisterData } from "@/types/types";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange =
    (field: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.register(formData);
      toast.success(`¡Bienvenido, ${data.firstName}! Redirigiendo...`);
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      toast.error("Error en el protocolo de registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#FAFAFA]">
      <AuthFormWrapper
        title="Únete"
        subtitle="Protocol Registration"
        icon={UserPlus}
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6"
        >
          <AuthInput
            label="Nombre"
            icon={User}
            placeholder="First Name"
            required
            onChange={handleChange("firstName")}
          />
          <AuthInput
            label="Apellido"
            icon={User}
            placeholder="Last Name"
            required
            onChange={handleChange("lastName")}
          />

          <div className="md:col-span-2 space-y-6">
            <AuthInput
              label="Email Corporativo"
              icon={Mail}
              type="email"
              placeholder="you@example.tech"
              required
              onChange={handleChange("email")}
            />
            <AuthInput
              label="Usuario Único"
              icon={User}
              placeholder="indigo_explorer"
              required
              onChange={handleChange("username")}
            />
            <AuthInput
              label="Passcode"
              icon={KeyRound}
              type="password"
              placeholder="Min. 8 characters"
              required
              onChange={handleChange("password")}
            />

            <Button
              disabled={loading}
              className="w-full h-18 bg-slate-950 hover:bg-indigo-600 text-white rounded-2xl text-lg font-black uppercase italic tracking-tighter transition-all group py-8"
            >
              {loading ? (
                "Procesando..."
              ) : (
                <span className="flex items-center gap-2">
                  Registrarme{" "}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-4 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase max-w-70 leading-relaxed">
            Sujeto a protocolos de privacidad Nova Cart.
          </p>
          <Link
            href="/login"
            className="text-sm font-black uppercase italic text-indigo-600 hover:text-slate-950 transition-colors"
          >
            ¿Ya tienes acceso? Inicia Sesión
          </Link>
        </div>
      </AuthFormWrapper>
    </div>
  );
}
