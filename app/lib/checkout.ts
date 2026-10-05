import type { CartLine } from "@/app/lib/cart-utils";

export interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export type CheckoutFieldName = keyof CheckoutFormValues;
export type CheckoutFormErrors = Partial<Record<CheckoutFieldName, string>>;

export interface CheckoutOrderPayload {
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    selectedVariant: Record<string, string>;
  }>;
}

export const initialCheckoutFormValues: CheckoutFormValues = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pinCode: "",
  country: "India",
};

const fieldLabels: Record<CheckoutFieldName, string> = {
  fullName: "Full name",
  email: "Email",
  phone: "Phone number",
  addressLine1: "Address line 1",
  addressLine2: "Address line 2",
  city: "City",
  state: "State",
  pinCode: "PIN code",
  country: "Country",
};

export function getCheckoutFieldLabel(field: CheckoutFieldName): string {
  return fieldLabels[field];
}

export function validateCheckoutField(
  field: CheckoutFieldName,
  value: string,
  country: string,
): string | undefined {
  const normalized = value.trim();

  if (field === "addressLine2") return undefined;
  if (!normalized) return `${fieldLabels[field]} is required.`;

  if (field === "fullName" && normalized.length < 2) {
    return "Enter your full name.";
  }

  if (
    field === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalized)
  ) {
    return "Enter a valid email address.";
  }

  if (field === "phone") {
    const digits = normalized.replace(/\D/g, "");
    if (!/^\+?[\d\s().-]+$/.test(normalized) || digits.length < 7 || digits.length > 15) {
      return "Enter a valid phone number with 7 to 15 digits.";
    }
  }

  if (field === "pinCode") {
    const validPin =
      country.trim().toLowerCase() === "india"
        ? /^[1-9]\d{5}$/.test(normalized)
        : /^[a-z\d][a-z\d -]{2,11}$/i.test(normalized);
    if (!validPin) {
      return country.trim().toLowerCase() === "india"
        ? "Enter a valid 6-digit Indian PIN code."
        : "Enter a valid postal or ZIP code.";
    }
  }

  return undefined;
}

export function validateCheckoutForm(
  values: CheckoutFormValues,
): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};
  const fields: CheckoutFieldName[] = [
    "fullName",
    "email",
    "phone",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "pinCode",
    "country",
  ];

  for (const field of fields) {
    const error = validateCheckoutField(field, values[field], values.country);
    if (error) errors[field] = error;
  }

  return errors;
}

export function createCheckoutOrderPayload(
  values: CheckoutFormValues,
  cartLines: CartLine[],
): CheckoutOrderPayload {
  return {
    customer: {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    },
    shippingAddress: {
      addressLine1: values.addressLine1.trim(),
      ...(values.addressLine2.trim()
        ? { addressLine2: values.addressLine2.trim() }
        : {}),
      city: values.city.trim(),
      state: values.state.trim(),
      pinCode: values.pinCode.trim(),
      country: values.country.trim(),
    },
    items: cartLines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      selectedVariant: { ...line.selectedOptions },
    })),
  };
}
