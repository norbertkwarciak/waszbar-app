interface ExtraService {
  id: string;
  label: string;
  price: number;
  description?: string;
}

export interface EmailParams {
  date: string;
  email: string;
  fullName: string;
  notes: string;
  numberOfGuests: number;
  packagePrice: number;
  phone: string;
  selectedBar: string;
  selectedPackage: string;
  selectedServices: ExtraService[];
  senderEmail: string;
  senderName: string;
  totalCost: number;
  travelCost: number;
  venueLocation: string;
}

export interface EmailData {
  to: { email: string; name: string }[];
  sender: { email: string; name: string };
  subject: string;
  htmlContent: string;
}
