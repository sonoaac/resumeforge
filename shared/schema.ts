import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Import users from auth for relations
import { users } from "./models/auth";

// Resume Data Structure - The one true structure all templates use
export const resumeDataSchema = z.object({
  profile: z.object({
    fullName: z.string().default(""),
    professionalTitle: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
    city: z.string().default(""),
    state: z.string().default(""),
    country: z.string().default(""),
    linkedIn: z.string().default(""),
    portfolio: z.string().default(""),
    website: z.string().default(""),
  }),
  summary: z.object({
    headline: z.string().default(""),
    text: z.string().default(""),
  }),
  experience: z.array(z.object({
    id: z.string(),
    jobTitle: z.string().default(""),
    company: z.string().default(""),
    location: z.string().default(""),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    isCurrent: z.boolean().default(false),
    bullets: z.array(z.string()).default([]),
  })).default([]),
  education: z.array(z.object({
    id: z.string(),
    degree: z.string().default(""),
    fieldOfStudy: z.string().default(""),
    school: z.string().default(""),
    location: z.string().default(""),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    isCurrent: z.boolean().default(false),
    honors: z.string().default(""),
  })).default([]),
  skills: z.array(z.object({
    id: z.string(),
    name: z.string().default(""),
    level: z.enum(["beginner", "intermediate", "advanced", "expert"]).default("intermediate"),
  })).default([]),
  projects: z.array(z.object({
    id: z.string(),
    name: z.string().default(""),
    role: z.string().default(""),
    description: z.string().default(""),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    tools: z.string().default(""),
    link: z.string().default(""),
  })).default([]),
  certifications: z.array(z.object({
    id: z.string(),
    name: z.string().default(""),
    issuer: z.string().default(""),
    issueDate: z.string().default(""),
    expirationDate: z.string().default(""),
    credentialLink: z.string().default(""),
  })).default([]),
  awards: z.array(z.object({
    id: z.string(),
    name: z.string().default(""),
    awardingBody: z.string().default(""),
    date: z.string().default(""),
    description: z.string().default(""),
  })).default([]),
  languages: z.array(z.object({
    id: z.string(),
    name: z.string().default(""),
    proficiency: z.enum(["basic", "conversational", "fluent", "native"]).default("conversational"),
  })).default([]),
  customSections: z.array(z.object({
    id: z.string(),
    title: z.string().default(""),
    entries: z.array(z.object({
      id: z.string(),
      title: z.string().default(""),
      description: z.string().default(""),
      dates: z.string().default(""),
    })).default([]),
  })).default([]),
});

export type ResumeData = z.infer<typeof resumeDataSchema>;

// Templates table
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  family: varchar("family").notNull(), // classic, modern, professional, creative, technical, minimal
  isPremium: boolean("is_premium").default(false),
  isReleased: boolean("is_released").default(true),
  bestFor: varchar("best_for"), // business, student, designer, developer, executive
  previewImage: varchar("preview_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templates);
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// Resumes table
export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull().default("My Resume"),
  templateId: varchar("template_id").references(() => templates.id),
  resumeData: jsonb("resume_data").$type<ResumeData>().notNull(),
  isPublic: boolean("is_public").default(false),
  shareCode: varchar("share_code"),
  lastSaved: timestamp("last_saved").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resumesRelations = relations(resumes, ({ one }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [resumes.templateId],
    references: [templates.id],
  }),
}));

export const insertResumeSchema = createInsertSchema(resumes).omit({ id: true, createdAt: true, lastSaved: true });
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  resumeId: varchar("resume_id").references(() => resumes.id),
  paypalOrderId: varchar("paypal_order_id"),
  paypalSubscriptionId: varchar("paypal_subscription_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  type: varchar("type").notNull(), // onetime, subscription
  status: varchar("status").notNull(), // pending, completed, failed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  resume: one(resumes, {
    fields: [payments.resumeId],
    references: [resumes.id],
  }),
}));

export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// User subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  paypalSubscriptionId: varchar("paypal_subscription_id"),
  status: varchar("status").notNull().default("free"), // free, onetime, pro
  exportsRemaining: integer("exports_remaining").default(0),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Exports history table
export const exports = pgTable("exports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id),
  exportType: varchar("export_type").notNull(), // pdf, docx
  hasWatermark: boolean("has_watermark").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exportsRelations = relations(exports, ({ one }) => ({
  user: one(users, {
    fields: [exports.userId],
    references: [users.id],
  }),
  resume: one(resumes, {
    fields: [exports.resumeId],
    references: [resumes.id],
  }),
}));

export const insertExportSchema = createInsertSchema(exports).omit({ id: true, createdAt: true });
export type InsertExport = z.infer<typeof insertExportSchema>;
export type Export = typeof exports.$inferSelect;

// Default sample resume data for new users
export const sampleResumeData: ResumeData = {
  profile: {
    fullName: "Alex Johnson",
    professionalTitle: "Senior Software Engineer",
    email: "alex.johnson@email.com",
    phone: "(555) 123-4567",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    linkedIn: "linkedin.com/in/alexjohnson",
    portfolio: "alexjohnson.dev",
    website: "",
  },
  summary: {
    headline: "Innovative Software Engineer",
    text: "Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Proven track record of delivering high-impact projects on time and within budget.",
  },
  experience: [
    {
      id: "exp1",
      jobTitle: "Senior Software Engineer",
      company: "Tech Innovations Inc",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "",
      isCurrent: true,
      bullets: [
        "Led development of microservices architecture serving 2M+ daily active users",
        "Mentored team of 5 junior developers, improving code quality by 40%",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
        "Collaborated with product team to define technical requirements for new features",
      ],
    },
    {
      id: "exp2",
      jobTitle: "Software Engineer",
      company: "Digital Solutions LLC",
      location: "Oakland, CA",
      startDate: "2019-01",
      endDate: "2021-02",
      isCurrent: false,
      bullets: [
        "Developed responsive web applications using React and TypeScript",
        "Optimized database queries improving application performance by 35%",
        "Participated in agile ceremonies and contributed to sprint planning",
      ],
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      school: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2015-08",
      endDate: "2019-05",
      isCurrent: false,
      honors: "Magna Cum Laude",
    },
  ],
  skills: [
    { id: "skill1", name: "JavaScript", level: "expert" },
    { id: "skill2", name: "TypeScript", level: "expert" },
    { id: "skill3", name: "React", level: "expert" },
    { id: "skill4", name: "Node.js", level: "advanced" },
    { id: "skill5", name: "Python", level: "advanced" },
    { id: "skill6", name: "PostgreSQL", level: "advanced" },
    { id: "skill7", name: "AWS", level: "intermediate" },
    { id: "skill8", name: "Docker", level: "intermediate" },
  ],
  projects: [
    {
      id: "proj1",
      name: "Open Source CLI Tool",
      role: "Creator & Maintainer",
      description: "Built a command-line tool for automating development workflows with 500+ GitHub stars",
      startDate: "2022-01",
      endDate: "",
      tools: "Node.js, TypeScript, GitHub Actions",
      link: "github.com/alexj/cli-tool",
    },
  ],
  certifications: [
    {
      id: "cert1",
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      issueDate: "2022-06",
      expirationDate: "2025-06",
      credentialLink: "",
    },
  ],
  awards: [],
  languages: [
    { id: "lang1", name: "English", proficiency: "native" },
    { id: "lang2", name: "Spanish", proficiency: "conversational" },
  ],
  customSections: [],
};
