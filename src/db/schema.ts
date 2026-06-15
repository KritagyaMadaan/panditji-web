import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  pgEnum,
  jsonb,
  customType,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// Custom PostGIS Geometry Type
const geometry = customType<{ data: string; driverData: string }>({
  dataType() {
    return "geometry(Point, 4326)";
  },
  toDriver(value: string) {
    return value;
  },
  fromDriver(value: string) {
    return value;
  },
});

// Enums
export const roleEnum = pgEnum("role", ["customer", "pandit", "admin"]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]);
export const aadharStatusEnum = pgEnum("aadhar_status", [
  "pending",
  "verified",
  "rejected",
]);
export const astrologyTypeEnum = pgEnum("astrology_type", [
  "kundli",
  "palmistry",
  "vastu",
  "numerology",
  "other",
]);
export const astrologyModeEnum = pgEnum("astrology_mode", [
  "video_call",
  "voice_call",
  "chat",
  "offline",
]);

// Core Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  phone: text("phone").unique(),
  email: text("email"),
  name: text("name").notNull(),
  role: roleEnum("role").default("customer").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  photoUrl: text("photo_url"),
  location: geometry("location"), // PostGIS Point (latitude, longitude)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const panditProfiles = pgTable("pandit_profiles", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio"),
  experience: integer("experience").default(0).notNull(),
  languages: jsonb("languages").default([]).notNull(), // Array of language codes
  specializations: jsonb("specializations").default([]).notNull(), // Array of service categories
  aadharStatus: aadharStatusEnum("aadhar_status").default("pending").notNull(),
  ratingAvg: numeric("rating_avg", { precision: 3, scale: 2 }).default("0.00"),
  pricingTier: text("pricing_tier").default("standard").notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  durationMins: integer("duration_mins").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .references(() => users.id)
    .notNull(),
  panditId: integer("pandit_id")
    .references(() => users.id)
    .notNull(),
  serviceId: integer("service_id")
    .references(() => services.id)
    .notNull(),
  status: bookingStatusEnum("status").default("pending").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  address: text("address").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  commission: numeric("commission", { precision: 10, scale: 2 }).notNull(),
  payoutAmount: numeric("payout_amount", { precision: 10, scale: 2 }).notNull(),
  paymentId: text("payment_id"), // Razorpay Payment ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .references(() => bookings.id)
    .notNull(),
  customerId: integer("customer_id")
    .references(() => users.id)
    .notNull(),
  panditId: integer("pandit_id")
    .references(() => users.id)
    .notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Extended Entities
export const weddingPackages = pgTable("wedding_packages", {
  id: serial("id").primaryKey(),
  panditId: integer("pandit_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priceRange: text("price_range").notNull(), // e.g. "50000 - 100000"
  inclusions: jsonb("inclusions").default([]).notNull(), // List of rituals/items
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const astrologyConsultations = pgTable("astrology_consultations", {
  id: serial("id").primaryKey(),
  panditId: integer("pandit_id")
    .references(() => users.id)
    .notNull(),
  customerId: integer("customer_id")
    .references(() => users.id)
    .notNull(),
  type: astrologyTypeEnum("type").notNull(),
  mode: astrologyModeEnum("mode").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum("status").default("pending").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const panditAvailability = pgTable("pandit_availability", {
  id: serial("id").primaryKey(),
  panditId: integer("pandit_id")
    .references(() => users.id)
    .notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6
  startTime: text("start_time").notNull(), // HH:MM
  endTime: text("end_time").notNull(), // HH:MM
  isBlocked: boolean("is_blocked").default(false).notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(), // e.g. "booking", "user"
  entityId: integer("entity_id").notNull(),
  action: text("action").notNull(), // e.g. "status_change", "creation"
  actorId: integer("actor_id")
    .references(() => users.id)
    .notNull(),
  metadata: jsonb("metadata").default({}).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  panditProfile: one(panditProfiles, {
    fields: [users.id],
    references: [panditProfiles.userId],
  }),
  bookingsAsCustomer: many(bookings, { relationName: "customer" }),
  bookingsAsPandit: many(bookings, { relationName: "pandit" }),
  astrologyConsultationsAsCustomer: many(astrologyConsultations, { relationName: "astrology_customer" }),
  astrologyConsultationsAsPandit: many(astrologyConsultations, { relationName: "astrology_pandit" }),
}));

export const panditProfilesRelations = relations(panditProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [panditProfiles.userId],
    references: [users.id],
  }),
  weddingPackages: many(weddingPackages),
  availability: many(panditAvailability),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(users, {
    fields: [bookings.customerId],
    references: [users.id],
    relationName: "customer",
  }),
  pandit: one(users, {
    fields: [bookings.panditId],
    references: [users.id],
    relationName: "pandit",
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  reviews: many(reviews),
}));

// Inferred Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PanditProfile = typeof panditProfiles.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type WeddingPackage = typeof weddingPackages.$inferSelect;
export type AstrologyConsultation = typeof astrologyConsultations.$inferSelect;
export type PanditAvailability = typeof panditAvailability.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
