import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  full_name: text("full_name").notNull(),
  ward_id: varchar("ward_id"),
  household_id: varchar("household_id"),
});

export const wards = pgTable("wards", {
  ward_id: varchar("ward_id").primaryKey(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  ward_name: text("ward_name").notNull(),
  ward_number: integer("ward_number").notNull(),
  cleanliness_rate: integer("cleanliness_rate"),
  vaccination_completion_rate: integer("vaccination_completion_rate"),
});

export const asha_workers = pgTable("asha_workers", {
  asha_id: varchar("asha_id").primaryKey(),
  ward_id: varchar("ward_id").notNull().references(() => wards.ward_id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
});

export const households = pgTable("households", {
  household_id: varchar("household_id").primaryKey(),
  ward_id: varchar("ward_id").notNull().references(() => wards.ward_id),
  family_name: text("family_name").notNull(),
  family_head: text("family_head").notNull(),
  cleanliness_score: integer("cleanliness_score"),
  vaccination_completion: integer("vaccination_completion"),
  last_visit: date("last_visit"),
  address: text("address"),
  uhc_id: varchar("uhc_id").unique(),
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  member_id: varchar("member_id").unique(),
  household_id: varchar("household_id").notNull().references(() => households.household_id),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  relation: text("relation").notNull(),
});

export const vaccinations = pgTable("vaccinations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  member_id: uuid("member_id").notNull().references(() => members.id),
  vaccine_name: text("vaccine_name").notNull(),
  vaccination_date: date("vaccination_date").notNull(),
});

export const hospitals = pgTable("hospitals", {
  hospital_id: uuid("hospital_id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  type: text("type").notNull(), // government, private, ngo
  rating: integer("rating"), // 1-5
  specializations: text("specializations").array(), // array of specializations
  phone: text("phone"),
  email: text("email"),
});

export const citizens = pgTable("citizens", {
  citizen_id: uuid("citizen_id").primaryKey().default(sql`gen_random_uuid()`),
  uhc_id: varchar("uhc_id").unique(),
  name: text("name").notNull(),
  age: integer("age"),
  gender: text("gender"),
  address: text("address"),
  ward_id: varchar("ward_id").references(() => wards.ward_id),
  category: text("category"), // 10000, 25000, 30000, VIP
});

export const funding = pgTable("funding", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  household_id: varchar("household_id").notNull().references(() => households.household_id),
  recommended_amount: integer("recommended_amount"),
  govt_share_percent: integer("govt_share_percent"),
  gst_share_percent: integer("gst_share_percent"),
  status: text("status"), // recommended, approved, disbursed
  created_at: date("created_at").default(sql`CURRENT_DATE`),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertWardSchema = createInsertSchema(wards).omit({});
export const insertAshaSchema = createInsertSchema(asha_workers).omit({});
export const insertHouseholdSchema = createInsertSchema(households).omit({});
export const insertMemberSchema = createInsertSchema(members).omit({ id: true });
export const insertVaccinationSchema = createInsertSchema(vaccinations).omit({ id: true });
export const insertHospitalSchema = createInsertSchema(hospitals).omit({ hospital_id: true });
export const insertCitizenSchema = createInsertSchema(citizens).omit({ citizen_id: true });
export const insertFundingSchema = createInsertSchema(funding).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Ward = typeof wards.$inferSelect;
export type AshaWorker = typeof asha_workers.$inferSelect;
export type Household = typeof households.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Vaccination = typeof vaccinations.$inferSelect;
export type Hospital = typeof hospitals.$inferSelect;
export type Citizen = typeof citizens.$inferSelect;
export type Funding = typeof funding.$inferSelect;
