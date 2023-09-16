import { InferModel } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userSystemEnum = pgEnum("user_system", ["system", "user"]);

export const chats = pgTable("chats", {
  id: varchar("id", { length: 256 }).primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  useId: varchar("use_id", { length: 256 }).notNull(),
  fileKey: text("file_key").notNull(),
});

export const massages = pgTable("massages", {
  id: varchar("id", { length: 256 }).primaryKey(),
  chatId: varchar("chat_id", { length: 256 })
    .references(() => chats.id)
    .notNull(),
  contents: text("contents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});

export type Chat = InferModel<typeof chats>;
export type Massage = InferModel<typeof massages>;
