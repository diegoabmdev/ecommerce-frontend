import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/UserContext";

export const useCheckoutForm = () => {
  const { user } = useUser();
  const [shippingData, setShippingData] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "+56",
  });

  const [touched, setTouched] = useState({
    fullName: false,
    address: false,
    city: false,
    phone: false,
  });

  const validation = useMemo(() => ({
    fullName: shippingData.fullName.trim().length < 3 ? "Nombre muy corto" : null,
    address: shippingData.address.trim().length < 5 ? "Dirección incompleta" : null,
    city: shippingData.city.trim().length < 3 ? "Ciudad no válida" : null,
    phone: shippingData.phone.length < 12 ? "Formato: +56 9 XXXX XXXX" : null,
  }), [shippingData]);

  const isFormValid = !Object.values(validation).some((v) => v !== null);

  useEffect(() => {
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        fullName: prev.fullName || `${user.firstName} ${user.lastName}`,
        phone: prev.phone === "+56" && user.phone 
          ? `+56${user.phone.replace(/\D/g, "").slice(-9)}` 
          : prev.phone,
      }));
    }
  }, [user]);

  const handleInputChange = (field: keyof typeof shippingData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    if (value.startsWith("+56")) {
      const numbers = value.slice(3).replace(/\D/g, "").slice(0, 9);
      setShippingData((prev) => ({ ...prev, phone: "+56" + numbers }));
    }
  };

  const markAllAsTouched = () => {
    setTouched({ fullName: true, address: true, city: true, phone: true });
  };

  return {
    shippingData,
    setShippingData,
    touched,
    setTouched,
    validation,
    isFormValid,
    handleInputChange,
    handlePhoneChange,
    markAllAsTouched,
  };
};