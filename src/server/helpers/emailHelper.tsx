import { env } from "@/env";
import { Resend } from "resend";
import { db } from "../db";
import { orders } from "../db/schema";
import { eq, InferSelectModel } from "drizzle-orm";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import ReactPDF from "@react-pdf/renderer";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { InvoiceEmailTemplate } from "@/components/email-templates/invoice";
const resendClient = new Resend(env.RESEND_API_KEY);

export const sendEmail = async () => {
  return await resendClient.emails.send({
    from: "Relaxing Koala <do-not-reply@r3veal.cloud>",
    to: ["minhpg@gmail.com"],
    subject: "Hello world",
    // react: EmailTemplate({ firstName: "John" }),
    text: "test",
  });
};

export const sendInvoiceEmail = async (orderId: number) => {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      payment: true,
      menuItemsToOrder: {
        with: {
          menuItem: true,
        },
      },
    },
  });
  if (!order) throw new Error("order not found");
  if (!order.payment.invoiceEmailAddress) return;
  const stream = await ReactPDF.renderToStream(
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleContainer}>
          <Text style={styles.reportTitle}>Relaxing Koala</Text>
        </View>{" "}
        <>
          <View style={styles.invoiceNoContainer}>
            <Text style={styles.label}>Invoice No:</Text>
            <Text style={styles.invoiceDate}>{order.payment.id}</Text>
          </View>
          <View style={styles.invoiceDateContainer}>
            <Text style={styles.label}>Date: </Text>
            <Text>{format(new Date(Date.now()), "dd/MM/yyyy")}</Text>
          </View>
        </>
        <View style={styles.headerContainer}>
          <Text style={styles.billTo}>Bill To:</Text>
          <Text>{order.payment.invoiceName}</Text>
          <Text>{order.payment.invoiceAddress}</Text>
          <Text>{order.payment.invoiceEmailAddress}</Text>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.container}>
            <Text style={styles.description}>Item Description</Text>
            <Text style={styles.qty}>Qty</Text>
            <Text style={styles.rate}>@</Text>
            <Text style={styles.amount}>Amount</Text>
          </View>
          <>
            {order.menuItemsToOrder.map((item) => (
              <View
                style={invoiceTableRowStyles.row}
                key={item.menuItemId.toString()}
              >
                <Text style={invoiceTableRowStyles.description}>
                  {item.menuItem.name}
                </Text>
                <Text style={invoiceTableRowStyles.qty}>{item.quantity}</Text>
                <Text style={invoiceTableRowStyles.rate}>
                  {formatCurrency(item.menuItem.price)}
                </Text>
                <Text style={invoiceTableRowStyles.amount}>
                  {formatCurrency(item.quantity * item.menuItem.price)}
                </Text>
              </View>
            ))}
          </>
          <>
            {Array(10)
              .fill(0)
              .map((x, i) => (
                <View style={invoiceTableEmptyRowsStyle.row} key={`BR${i}`}>
                  <Text style={invoiceTableEmptyRowsStyle.description}>-</Text>
                  <Text style={invoiceTableEmptyRowsStyle.qty}>-</Text>
                  <Text style={invoiceTableEmptyRowsStyle.rate}>-</Text>
                  <Text style={invoiceTableEmptyRowsStyle.amount}>-</Text>
                </View>
              ))}
          </>
          <View style={invoiceTableFooterStyle.row}>
            <Text style={invoiceTableFooterStyle.description}>TOTAL</Text>
            <Text style={invoiceTableFooterStyle.total}>
              {formatCurrency(order.payment.amount)}
            </Text>
          </View>{" "}
        </View>
      </Page>
    </Document>,
  );

  const chunks: Buffer[] = [];
  for await (let chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return await resendClient.emails.send({
    from: "Relaxing Koala <do-not-reply@r3veal.cloud>",
    to: [order.payment.invoiceEmailAddress],
    subject: "Hello world",
    html: "",
    react: InvoiceEmailTemplate({ orderId: order.id }),
    attachments: [
      {
        content: Buffer.concat(chunks),
        filename: `Invoice_${order.payment.id}.pdf`,
      },
    ],
  });
};

Font.register({
  family: "Inter",
  src: "https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap",
});

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  reportTitle: {
    color: "black",
    fontWeight: "bold",
    letterSpacing: 0,
    fontSize: 25,
    textAlign: "center",
    textTransform: "uppercase",
  },
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: "auto",
    marginRight: "auto",
  },
  invoiceNoContainer: {
    flexDirection: "row",
    marginTop: 36,
    justifyContent: "flex-end",
  },
  invoiceDateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {
    width: 60,
  },
  headerContainer: {
    marginTop: 36,
  },
  billTo: {
    marginTop: 20,
    paddingBottom: 3,
    fontFamily: "Helvetica-Oblique",
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "black",
  },
  container: {
    flexDirection: "row",
    borderBottomColor: "black",
    backgroundColor: "black",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontStyle: "bold",
    flexGrow: 1,
  },
  description: {
    width: "60%",
    borderRightColor: "black",
    borderRightWidth: 1,
  },
  qty: {
    width: "10%",
    borderRightColor: "black",
    borderRightWidth: 1,
  },
  rate: {
    width: "15%",
    borderRightColor: "black",
    borderRightWidth: 1,
  },
  amount: {
    width: "15%",
  },
});

const invoiceTableRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  description: {
    width: "60%",
    textAlign: "left",
    borderRightColor: "black",
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: "10%",
    borderRightColor: "black",
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  rate: {
    width: "15%",
    borderRightColor: "black",
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  amount: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const invoiceTableEmptyRowsStyle = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
    color: "white",
  },
  description: {
    width: "60%",
    borderRightColor: "black",
    borderRightWidth: 1,
  },
  qty: {
    width: "10%",
    borderRightColor: "black",
    borderRightWidth: 1,
  },
  rate: {
    width: "15%",
    borderRightColor: "black",
    borderRightWidth: 1,
  },
  amount: {
    width: "15%",
  },
});

const invoiceTableFooterStyle = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontSize: 12,
    fontStyle: "bold",
  },
  description: {
    width: "85%",
    textAlign: "right",
    borderRightColor: "black",
    borderRightWidth: 1,
    paddingRight: 8,
  },
  total: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});
