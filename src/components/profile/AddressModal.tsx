"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address } from "@/types/types";

type AddressFormData = Omit<Address, "id" | "isDefault">;

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddressFormData) => void;
  addressToEdit?: Address | null;
}

const initialFormState: AddressFormData = {
  name: "",
  address: "",
  city: "",
  state: "",
  postalCode: "020020",
  country: "Chile",
};

export function AddressModal({
  isOpen,
  onClose,
  onSave,
  addressToEdit,
}: AddressModalProps) {
  const [formData, setFormData] = useState<AddressFormData>(initialFormState);

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        name: addressToEdit.name,
        address: addressToEdit.address,
        city: addressToEdit.city,
        state: addressToEdit.state,
        postalCode: addressToEdit.postalCode,
        country: addressToEdit.country,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [addressToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8 max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Nueva Dirección</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para añadir una nueva dirección de envío.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
            >
              Nombre (Ej: Casa / Oficina)
            </label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="rounded-xl bg-slate-50 border-slate-100 h-12 focus:ring-indigo-500"
              placeholder="Ej: Mi Casa"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="address"
              className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
            >
              Dirección Completa
            </label>
            <Input
              id="address"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="rounded-xl bg-slate-50 border-slate-100 h-12 focus:ring-indigo-500"
              placeholder="Calle, número, piso..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="city"
                className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
              >
                Ciudad
              </label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="rounded-xl bg-slate-50 border-slate-100 h-12 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="postalCode"
                className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
              >
                C. Postal
              </label>
              <Input
                id="postalCode"
                required
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
                className="rounded-xl bg-slate-50 border-slate-100 h-12 focus:ring-indigo-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase italic tracking-tighter transition-all active:scale-95 mt-2"
          >
            {addressToEdit ? "Guardar Cambios" : "Crear Dirección"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
