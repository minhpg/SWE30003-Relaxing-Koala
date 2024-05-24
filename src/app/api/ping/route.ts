import { sendInvoiceEmail } from "@/server/helpers/emailHelper";

export function GET() {
  sendInvoiceEmail(1);
}
