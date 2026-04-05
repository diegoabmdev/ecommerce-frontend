// src/components/auth/AuthInput.tsx
import { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useId } from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
}

export const AuthInput = ({
  label,
  value,
  icon: Icon,
  className,
  ...props
}: AuthInputProps) => {
  const inputId = useId();
  return (
    <div className="space-y-1 group">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-5">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
        <Input
          id={inputId}
          value={value}
          {...props}
          className={`pl-12 h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium 
          placeholder:text-slate-300 placeholder:font-normal placeholder:italic
          ${className}`}
        />
      </div>
    </div>
  );
};
