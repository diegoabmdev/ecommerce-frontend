// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthInput } from "@/components/auth/AuthInput";

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "emilys",
    password: "emilyspass",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      router.push("/profile");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#FAFAFA]">
      <AuthFormWrapper
        title="Acceso"
        subtitle="Secure Terminal Login"
        icon={Zap}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Identity"
            icon={User}
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />

          <div className="space-y-1">
            <div className="flex justify-between items-center px-5 mb-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Passcode
              </label>
              <Link
                href="#"
                className="text-[10px] font-black uppercase text-indigo-500 hover:underline"
              >
                Recuperar
              </Link>
            </div>
            <AuthInput
              label=""
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-18 bg-indigo-600 hover:bg-slate-950 text-white rounded-2xl text-lg font-black uppercase italic tracking-tighter shadow-xl shadow-indigo-100 transition-all py-8"
          >
            {loading ? (
              "Verificando..."
            ) : (
              <span className="flex items-center gap-2">
                Entrar al Sistema <ArrowRight size={20} />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <ShieldCheck size={14} /> Encrypted Terminal
          </div>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-tight">
            ¿No eres miembro?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:text-slate-950 underline decoration-2 underline-offset-4"
            >
              Registrarte
            </Link>
          </p>
        </div>
      </AuthFormWrapper>
    </div>
  );
}
