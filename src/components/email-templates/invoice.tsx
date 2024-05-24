interface EmailTemplateProps {
  orderId: number;
}

export const InvoiceEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  orderId,
}) => (
  <div>
    <p>Hi,</p>
    <p>Attached is your invoice for Order #{orderId}</p>
    <p>Please contact us if you have any questions</p>
    <p>Best Regards,</p>
    <em>The Relaxing Koala Team</em>
  </div>
);
