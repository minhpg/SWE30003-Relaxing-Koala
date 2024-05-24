import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `koala-cafe_${name}`);

export const roles = ["USER", "ADMIN", "STAFF"] as const;
export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified").default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  role: varchar("role", {
    enum: roles,
  }).default("USER"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token"),
    access_token: varchar("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires").notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const reservations = createTable("reservation", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  time: timestamp("time").notNull(),
  noOfGuests: integer("noOfGuests").notNull(),
  message: varchar("message", { length: 255 }),
  createdBy: varchar("createdBy", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const menus = createTable("menu", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description").notNull(),
  recommended: boolean("recommended").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdBy: varchar("createdBy", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const menuItems = createTable("menuItem", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description").notNull(),
  price: integer("price").notNull(),
  vegan: boolean("vegan").notNull().default(false),
  seafood: boolean("seafood").notNull().default(false),
  createdBy: varchar("createdBy", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const menuItemsToMenu = createTable(
  "menuItemsToMenu",
  {
    menuItemId: integer("menuItemId")
      .notNull()
      .references(() => menuItems.id),
    menuId: integer("menuId")
      .notNull()
      .references(() => menus.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.menuItemId, t.menuId] }),
  }),
);

export const menuItemsToMenuRelations = relations(
  menuItemsToMenu,
  ({ one }) => ({
    menuItem: one(menuItems, {
      fields: [menuItemsToMenu.menuItemId],
      references: [menuItems.id],
    }),
    menu: one(menus, {
      fields: [menuItemsToMenu.menuId],
      references: [menus.id],
    }),
  }),
);

export const menuRelation = relations(menus, ({ many }) => ({
  menuItemsToMenu: many(menuItemsToMenu),
}));

export const orderStatus = ["PENDING", "COMPLETED", "CANCELLED"] as const;
export const paymentMethod = ["CARD", "CASH", "CHEQUE"] as const;
export const paymentStatus = ["PENDING", "COMPLETED", "CANCELLED"] as const;

export const orders = createTable("orders", {
  id: serial("id").primaryKey(),
  tableNumber: integer("tableNumber").notNull(),
  status: varchar("status", {
    enum: orderStatus,
  }).default("PENDING"),
  notes: varchar("notes", { length: 255 }),
  createdBy: varchar("createdBy", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const menuItemsToOrder = createTable(
  "menuItemsToOrder",
  {
    menuItemId: integer("menuItemId")
      .notNull()
      .references(() => menuItems.id, {
        onDelete: "cascade",
      }),
    orderId: integer("orderId")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),
    quantity: integer("quantity").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.menuItemId, t.orderId] }),
  }),
);

export const menuItemsToOrderRelations = relations(
  menuItemsToOrder,
  ({ one }) => ({
    menuItem: one(menuItems, {
      fields: [menuItemsToOrder.menuItemId],
      references: [menuItems.id],
    }),
    order: one(orders, {
      fields: [menuItemsToOrder.orderId],
      references: [orders.id],
    }),
  }),
);

export const menuItemRelation = relations(menuItems, ({ many }) => ({
  menuItemsToMenu: many(menuItemsToMenu),
  menuItemsToOrder: many(menuItemsToOrder),
}));

export const orderRelation = relations(orders, ({ many, one }) => ({
  menuItemsToOrder: many(menuItemsToOrder),
  payment: one(payment, {
    fields: [orders.id],
    references: [payment.orderId],
  }),
}));

export const payment = createTable("payment", {
  id: serial("id").primaryKey(),
  paymentMethod: varchar("paymentMethod", {
    enum: paymentMethod,
  }).default("CASH"),
  paymentStatus: varchar("paymentStatus", {
    enum: paymentStatus,
  }).default("PENDING"),
  amount: integer("amount").notNull(),
  orderId: integer("orderId")
    .notNull()
    .references(() => orders.id),
  invoiceAddress: varchar("invoiceAddress", { length: 255 }),
  invoiceEmailAddress: varchar("invoiceEmailAddress", { length: 255 }),
  invoiceName: varchar("invoiceName", { length: 255 }),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const paymentRelation = relations(payment, ({ one }) => ({
  orders: one(orders, { fields: [payment.orderId], references: [orders.id] }),
}));

export const feedbacks = createTable("feedbacks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  rating: integer("rating").notNull().default(5),
  message: text("message"),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
