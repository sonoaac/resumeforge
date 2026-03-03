import { 
  users, 
  resumes, 
  templates, 
  payments, 
  subscriptions, 
  exports,
  sampleResumeData,
  type Resume, 
  type InsertResume, 
  type Template, 
  type InsertTemplate,
  type Payment,
  type InsertPayment,
  type Subscription,
  type InsertSubscription,
  type Export,
  type InsertExport,
  type ResumeData,
  type User
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  
  // Resumes
  getResume(id: string): Promise<Resume | undefined>;
  getResumesByUser(userId: string): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: string): Promise<boolean>;
  duplicateResume(id: string): Promise<Resume | undefined>;
  
  // Templates
  getTemplate(id: string): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Subscriptions
  getSubscription(userId: string): Promise<Subscription | undefined>;
  createOrUpdateSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUser(userId: string): Promise<Payment[]>;
  
  // Exports
  createExport(exportData: InsertExport): Promise<Export>;
  getExportsByUser(userId: string): Promise<Export[]>;
  
  // Seeding
  seedTemplates(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  // Resumes
  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume || undefined;
  }

  async getResumesByUser(userId: string): Promise<Resume[]> {
    return db.select().from(resumes).where(eq(resumes.userId, userId)).orderBy(desc(resumes.lastSaved));
  }

  async createResume(resume: InsertResume): Promise<Resume> {
    const [newResume] = await db.insert(resumes).values({
      ...resume,
      resumeData: (resume.resumeData || sampleResumeData) as ResumeData,
    }).returning();
    return newResume;
  }

  async updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume | undefined> {
    const [updated] = await db
      .update(resumes)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .set({ ...updates, lastSaved: new Date() } as any)
      .where(eq(resumes.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteResume(id: string): Promise<boolean> {
    const result = await db.delete(resumes).where(eq(resumes.id, id)).returning();
    return result.length > 0;
  }

  async duplicateResume(id: string): Promise<Resume | undefined> {
    const original = await this.getResume(id);
    if (!original) return undefined;

    const [newResume] = await db.insert(resumes).values({
      userId: original.userId,
      title: `${original.title} (Copy)`,
      templateId: original.templateId,
      resumeData: original.resumeData,
      isPublic: false,
    }).returning();
    return newResume;
  }

  // Templates
  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async getAllTemplates(): Promise<Template[]> {
    return db.select().from(templates);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db.insert(templates).values(template).returning();
    return newTemplate;
  }

  // Subscriptions
  async getSubscription(userId: string): Promise<Subscription | undefined> {
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return sub || undefined;
  }

  async createOrUpdateSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const existing = await this.getSubscription(subscription.userId);
    if (existing) {
      const [updated] = await db
        .update(subscriptions)
        .set({ ...subscription, updatedAt: new Date() })
        .where(eq(subscriptions.userId, subscription.userId))
        .returning();
      return updated;
    }
    const [newSub] = await db.insert(subscriptions).values(subscription).returning();
    return newSub;
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }

  // Exports
  async createExport(exportData: InsertExport): Promise<Export> {
    const [newExport] = await db.insert(exports).values(exportData).returning();
    return newExport;
  }

  async getExportsByUser(userId: string): Promise<Export[]> {
    return db.select().from(exports).where(eq(exports.userId, userId)).orderBy(desc(exports.createdAt));
  }

  // Seed templates
  async seedTemplates(): Promise<void> {
    const existingTemplates = await this.getAllTemplates();
    if (existingTemplates.length > 0) return;

    const templateData = [
      { id: "classic-one", name: "Classic One", family: "classic", isPremium: false, isReleased: true, bestFor: "business" },
    ];

    for (const template of templateData) {
      await db.insert(templates).values(template).onConflictDoNothing();
    }
  }
}

export const storage = new DatabaseStorage();
