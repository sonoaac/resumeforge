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
  documentType: z.enum(["resume", "cv"]).default("resume"),
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
  // CV-specific sections
  publications: z.array(z.object({
    id: z.string(),
    title: z.string().default(""),
    authors: z.string().default(""),
    journal: z.string().default(""),
    year: z.string().default(""),
    doi: z.string().default(""),
    type: z.enum(["journal", "conference", "book", "chapter", "other"]).default("journal"),
  })).default([]),
  research: z.array(z.object({
    id: z.string(),
    title: z.string().default(""),
    institution: z.string().default(""),
    supervisor: z.string().default(""),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    isCurrent: z.boolean().default(false),
    description: z.string().default(""),
  })).default([]),
  teaching: z.array(z.object({
    id: z.string(),
    course: z.string().default(""),
    institution: z.string().default(""),
    role: z.string().default(""),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    isCurrent: z.boolean().default(false),
    description: z.string().default(""),
  })).default([]),
  presentations: z.array(z.object({
    id: z.string(),
    title: z.string().default(""),
    event: z.string().default(""),
    location: z.string().default(""),
    date: z.string().default(""),
    type: z.enum(["oral", "poster", "invited", "keynote"]).default("oral"),
  })).default([]),
  grants: z.array(z.object({
    id: z.string(),
    title: z.string().default(""),
    fundingBody: z.string().default(""),
    amount: z.string().default(""),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    role: z.string().default(""),
    description: z.string().default(""),
  })).default([]),
  references: z.array(z.object({
    id: z.string(),
    name: z.string().default(""),
    title: z.string().default(""),
    institution: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
    relationship: z.string().default(""),
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
  documentType: "resume",
  profile: {
    fullName: "Sonoaac Mark",
    professionalTitle: "Software Developer",
    email: "sonoaac@email.com",
    phone: "0000000000",
    city: "Brooklyn",
    state: "NY",
    country: "USA",
    linkedIn: "linkedin.com/in/sonoaacmark",
    portfolio: "sonoaac.dev",
    website: "",
  },
  summary: {
    headline: "Software Developer",
    text: "Versatile software developer with 5+ years of experience building web applications and IT support systems. Passionate about clean code, great user experiences, and solving real-world technical problems. Proven track record of delivering high-impact projects.",
  },
  experience: [
    {
      id: "exp1",
      jobTitle: "Software Developer",
      company: "Tech Studio NYC",
      location: "Brooklyn, NY",
      startDate: "2021-03",
      endDate: "",
      isCurrent: true,
      bullets: [
        "Built responsive web applications for 20+ clients across diverse industries",
        "Led frontend development using React, TypeScript, and Tailwind CSS",
        "Improved site performance by 45% through code optimization and lazy loading",
        "Collaborated with design team to implement pixel-perfect UI components",
      ],
    },
    {
      id: "exp2",
      jobTitle: "IT Support Specialist",
      company: "Digital Agency",
      location: "New York, NY",
      startDate: "2019-01",
      endDate: "2021-02",
      isCurrent: false,
      bullets: [
        "Developed interactive UI components for client-facing web applications",
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
      school: "City University of New York",
      location: "New York, NY",
      startDate: "2015-09",
      endDate: "2019-05",
      isCurrent: false,
      honors: "",
    },
  ],
  skills: [
    { id: "skill1", name: "JavaScript", level: "expert" },
    { id: "skill2", name: "TypeScript", level: "expert" },
    { id: "skill3", name: "React", level: "expert" },
    { id: "skill4", name: "Node.js", level: "advanced" },
    { id: "skill5", name: "CSS / Tailwind", level: "expert" },
    { id: "skill6", name: "PostgreSQL", level: "advanced" },
    { id: "skill7", name: "Git", level: "advanced" },
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
  publications: [],
  research: [],
  teaching: [],
  presentations: [],
  grants: [],
  references: [],
};

// Default sample CV data for new CV documents
export const sampleCVData: ResumeData = {
  documentType: "cv",
  profile: {
    fullName: "Dr. Sarah Mitchell",
    professionalTitle: "Assistant Professor of Biochemistry",
    email: "s.mitchell@university.edu",
    phone: "(555) 987-6543",
    city: "Boston",
    state: "MA",
    country: "USA",
    linkedIn: "linkedin.com/in/drsarahmitchell",
    portfolio: "sarahmitchell.edu",
    website: "",
  },
  summary: {
    headline: "Biochemist & Molecular Biology Researcher",
    text: "Tenure-track assistant professor with 8 years of research experience in protein folding and cellular signaling. Author of 14 peer-reviewed publications with over 800 citations. Passionate about undergraduate mentorship and translational research bridging basic science and therapeutic applications.",
  },
  experience: [],
  education: [
    {
      id: "edu1",
      degree: "Ph.D.",
      fieldOfStudy: "Biochemistry",
      school: "Harvard University",
      location: "Cambridge, MA",
      startDate: "2014-09",
      endDate: "2019-06",
      isCurrent: false,
      honors: "Dean's List; NIH F31 Fellowship",
    },
    {
      id: "edu2",
      degree: "Bachelor of Science",
      fieldOfStudy: "Chemistry & Biology",
      school: "MIT",
      location: "Cambridge, MA",
      startDate: "2010-09",
      endDate: "2014-05",
      isCurrent: false,
      honors: "Summa Cum Laude",
    },
  ],
  skills: [
    { id: "s1", name: "Protein Crystallography", level: "expert" },
    { id: "s2", name: "CRISPR-Cas9", level: "expert" },
    { id: "s3", name: "Mass Spectrometry", level: "advanced" },
    { id: "s4", name: "Python / R", level: "advanced" },
    { id: "s5", name: "Western Blotting", level: "expert" },
    { id: "s6", name: "Flow Cytometry", level: "advanced" },
  ],
  projects: [],
  certifications: [],
  awards: [
    {
      id: "aw1",
      name: "Young Investigator Award",
      awardingBody: "American Society of Biochemistry",
      date: "2022-03",
      description: "Awarded for outstanding early-career contributions to the field.",
    },
  ],
  languages: [
    { id: "lang1", name: "English", proficiency: "native" },
    { id: "lang2", name: "French", proficiency: "fluent" },
  ],
  customSections: [],
  publications: [
    {
      id: "pub1",
      title: "Allosteric regulation of mTOR complex assembly under nutrient stress",
      authors: "Mitchell S., Chen R., Patel V., Kim J.",
      journal: "Nature Chemical Biology",
      year: "2023",
      doi: "10.1038/s41589-023-1234-5",
      type: "journal",
    },
    {
      id: "pub2",
      title: "Cryo-EM structure of the human PI3K-mTOR complex",
      authors: "Mitchell S., Williams T., Zhao L.",
      journal: "Cell",
      year: "2021",
      doi: "10.1016/j.cell.2021.05.001",
      type: "journal",
    },
  ],
  research: [
    {
      id: "res1",
      title: "Postdoctoral Fellow – Structural Biology",
      institution: "Whitehead Institute for Biomedical Research",
      supervisor: "Prof. David Thompson",
      startDate: "2019-08",
      endDate: "2022-07",
      isCurrent: false,
      description: "Investigated cryo-EM structures of mTOR signaling complexes. Developed novel crosslinking mass spectrometry workflows to map protein–protein interaction surfaces.",
    },
  ],
  teaching: [
    {
      id: "teach1",
      course: "BIOL 301 – Cell Signaling",
      institution: "Boston University",
      role: "Lead Instructor",
      startDate: "2022-09",
      endDate: "",
      isCurrent: true,
      description: "Design and deliver lectures, problem sets, and exams for 120-student upper-division course.",
    },
    {
      id: "teach2",
      course: "BIOL 101 – Introductory Biology",
      institution: "Harvard University",
      role: "Teaching Fellow",
      startDate: "2015-09",
      endDate: "2018-05",
      isCurrent: false,
      description: "Led weekly laboratory sections and held office hours for 200+ students.",
    },
  ],
  presentations: [
    {
      id: "pres1",
      title: "Structural Basis of mTOR Activation",
      event: "American Society of Cell Biology Annual Meeting",
      location: "San Francisco, CA",
      date: "2022-12",
      type: "invited",
    },
    {
      id: "pres2",
      title: "Cryo-EM Approaches to Membrane Protein Complexes",
      event: "Gordon Research Conference on Proteins",
      location: "Ventura, CA",
      date: "2021-07",
      type: "oral",
    },
  ],
  grants: [
    {
      id: "grant1",
      title: "R01 GM145782 – Structural Mechanisms of Nutrient Sensing in mTOR",
      fundingBody: "National Institutes of Health (NIGMS)",
      amount: "$1,250,000",
      startDate: "2023-01",
      endDate: "2027-12",
      role: "Principal Investigator",
      description: "5-year R01 grant to elucidate structural and dynamic basis of mTOR complex assembly.",
    },
  ],
  references: [
    {
      id: "ref1",
      name: "Prof. David Thompson",
      title: "Director, Whitehead Institute",
      institution: "Whitehead Institute for Biomedical Research",
      email: "dthompson@wi.mit.edu",
      phone: "(617) 258-0000",
      relationship: "Postdoctoral Supervisor",
    },
  ],
};
