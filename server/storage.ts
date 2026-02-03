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
      resumeData: resume.resumeData || sampleResumeData,
    }).returning();
    return newResume;
  }

  async updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume | undefined> {
    const [updated] = await db
      .update(resumes)
      .set({ ...updates, lastSaved: new Date() })
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
      // Free Classic (5)
      { id: "classic-one", name: "Classic One", family: "classic", isPremium: false, isReleased: true, bestFor: "business" },
      { id: "classic-two", name: "Classic Two", family: "classic", isPremium: false, isReleased: true, bestFor: "executive" },
      { id: "classic-three", name: "Classic Three", family: "classic", isPremium: false, isReleased: true, bestFor: "business" },
      { id: "classic-four", name: "Classic Four", family: "classic", isPremium: false, isReleased: true, bestFor: "manager" },
      { id: "classic-five", name: "Classic Five", family: "classic", isPremium: false, isReleased: true, bestFor: "business" },
      
      // Free Modern (5)
      { id: "modern-one", name: "Modern One", family: "modern", isPremium: false, isReleased: true, bestFor: "developer" },
      { id: "modern-two", name: "Modern Two", family: "modern", isPremium: false, isReleased: true, bestFor: "designer" },
      { id: "modern-three", name: "Modern Three", family: "modern", isPremium: false, isReleased: true, bestFor: "developer" },
      { id: "modern-four", name: "Modern Four", family: "modern", isPremium: false, isReleased: true, bestFor: "startup" },
      { id: "modern-five", name: "Modern Five", family: "modern", isPremium: false, isReleased: true, bestFor: "designer" },
      
      // Free Professional (5)
      { id: "professional-one", name: "Professional One", family: "professional", isPremium: false, isReleased: true, bestFor: "executive" },
      { id: "professional-two", name: "Professional Two", family: "professional", isPremium: false, isReleased: true, bestFor: "manager" },
      { id: "professional-three", name: "Professional Three", family: "professional", isPremium: false, isReleased: true, bestFor: "business" },
      { id: "professional-four", name: "Professional Four", family: "professional", isPremium: false, isReleased: true, bestFor: "executive" },
      { id: "professional-five", name: "Professional Five", family: "professional", isPremium: false, isReleased: true, bestFor: "manager" },
      
      // Free Minimal (5)
      { id: "minimal-one", name: "Minimal One", family: "minimal", isPremium: false, isReleased: true, bestFor: "student" },
      { id: "minimal-two", name: "Minimal Two", family: "minimal", isPremium: false, isReleased: true, bestFor: "student" },
      { id: "minimal-three", name: "Minimal Three", family: "minimal", isPremium: false, isReleased: true, bestFor: "student" },
      { id: "minimal-four", name: "Minimal Four", family: "minimal", isPremium: false, isReleased: true, bestFor: "student" },
      { id: "minimal-five", name: "Minimal Five", family: "minimal", isPremium: false, isReleased: true, bestFor: "student" },
      
      // Premium Modern (released)
      { id: "modern-prime", name: "Modern Prime", family: "modern", isPremium: true, isReleased: true, bestFor: "developer" },
      { id: "modern-flow", name: "Modern Flow", family: "modern", isPremium: true, isReleased: true, bestFor: "designer" },
      { id: "modern-edge", name: "Modern Edge", family: "modern", isPremium: true, isReleased: true, bestFor: "developer" },
      { id: "modern-clean", name: "Modern Clean", family: "modern", isPremium: true, isReleased: true, bestFor: "startup" },
      
      // Premium Executive (released)
      { id: "executive-one", name: "Executive One", family: "professional", isPremium: true, isReleased: true, bestFor: "executive" },
      { id: "executive-two", name: "Executive Two", family: "professional", isPremium: true, isReleased: true, bestFor: "executive" },
      { id: "corporate-one", name: "Corporate One", family: "professional", isPremium: true, isReleased: true, bestFor: "manager" },
      { id: "corporate-two", name: "Corporate Two", family: "professional", isPremium: true, isReleased: true, bestFor: "manager" },
      
      // Premium Creative (released)
      { id: "creative-aura", name: "Creative Aura", family: "creative", isPremium: true, isReleased: true, bestFor: "designer" },
      { id: "creative-vision", name: "Creative Vision", family: "creative", isPremium: true, isReleased: true, bestFor: "designer" },
      { id: "creative-spark", name: "Creative Spark", family: "creative", isPremium: true, isReleased: true, bestFor: "designer" },
      { id: "creative-wave", name: "Creative Wave", family: "creative", isPremium: true, isReleased: true, bestFor: "designer" },
      
      // Premium Technical (released)
      { id: "tech-prime", name: "Tech Prime", family: "technical", isPremium: true, isReleased: true, bestFor: "developer" },
      { id: "tech-matrix", name: "Tech Matrix", family: "technical", isPremium: true, isReleased: true, bestFor: "developer" },
      { id: "tech-logic", name: "Tech Logic", family: "technical", isPremium: true, isReleased: true, bestFor: "developer" },
      { id: "tech-build", name: "Tech Build", family: "technical", isPremium: true, isReleased: true, bestFor: "developer" },
      
      // Premium Minimal (released)
      { id: "minimal-soft", name: "Minimal Soft", family: "minimal", isPremium: true, isReleased: true, bestFor: "student" },
      { id: "minimal-pure", name: "Minimal Pure", family: "minimal", isPremium: true, isReleased: true, bestFor: "student" },
    ];

    for (const template of templateData) {
      await db.insert(templates).values(template).onConflictDoNothing();
    }
  }
}

export const storage = new DatabaseStorage();
