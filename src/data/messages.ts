export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  replied: boolean;
  createdAt: string;
}

const STORAGE_KEY = "ar_messages";

const defaults: ContactMessage[] = [
  {
    id: "m1", name: "Emily Watson", email: "emily@example.com", phone: "+1 555-0101",
    subject: "Website Inquiry", message: "Hi, I'm interested in building a business website for my bakery. Can you share your pricing for the Standard package?",
    replied: false, createdAt: "2026-06-10T08:30:00Z",
  },
  {
    id: "m2", name: "Raj Patel", email: "raj@example.com", phone: "+91 98765 43210",
    subject: "UI/UX Design Project", message: "We need a complete redesign of our SaaS dashboard. Looking for a modern, clean interface. Please share your availability.",
    replied: true, createdAt: "2026-06-08T14:20:00Z",
  },
  {
    id: "m3", name: "Lisa Chen", email: "lisa@example.com", phone: "+65 9123 4567",
    subject: "WordPress Development", message: "Need help with an existing WordPress site. It's slow and needs optimization. Can you take a look?",
    replied: false, createdAt: "2026-06-05T11:00:00Z",
  },
];

export function loadMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaults;
  } catch { return defaults; }
}

export function saveMessages(list: ContactMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
