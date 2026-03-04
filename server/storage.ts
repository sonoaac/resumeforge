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

export class MemStorage implements IStorage {
  private _users = new Map<string, User>();
  private _resumes = new Map<string, Resume>();
  private _templates = new Map<string, Template>();
  private _subscriptions = new Map<string, Subscription>();
  private _payments: Payment[] = [];
  private _exports: Export[] = [];

  async getUser(id: string): Promise<User | undefined> {
    return this._users.get(id);
  }

  async getResume(id: string): Promise<Resume | undefined> {
    return this._resumes.get(id);
  }

  async getResumesByUser(userId: string): Promise<Resume[]> {
    return Array.from(this._resumes.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.lastSaved!).getTime() - new Date(a.lastSaved!).getTime());
  }

  async createResume(resume: InsertResume): Promise<Resume> {
    const now = new Date();
    const newResume: Resume = {
      id: randomUUID(),
      userId: resume.userId,
      title: resume.title || "My Resume",
      templateId: resume.templateId || "classic-one",
      resumeData: (resume.resumeData || sampleResumeData) as ResumeData,
      isPublic: resume.isPublic ?? false,
      shareCode: resume.shareCode ?? null,
      lastSaved: now,
      createdAt: now,
    };
    this._resumes.set(newResume.id, newResume);
    return newResume;
  }

  async updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume | undefined> {
    const resume = this._resumes.get(id);
    if (!resume) return undefined;
    const updated: Resume = { ...resume, ...(updates as any), lastSaved: new Date() };
    this._resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: string): Promise<boolean> {
    return this._resumes.delete(id);
  }

  async duplicateResume(id: string): Promise<Resume | undefined> {
    const original = this._resumes.get(id);
    if (!original) return undefined;
    return this.createResume({
      userId: original.userId,
      title: `${original.title} (Copy)`,
      templateId: original.templateId || "classic-one",
      resumeData: original.resumeData,
      isPublic: false,
    });
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this._templates.get(id);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this._templates.values());
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const now = new Date();
    const newTemplate: Template = {
      id: template.id || randomUUID(),
      name: template.name,
      family: template.family,
      isPremium: template.isPremium ?? false,
      isReleased: template.isReleased ?? true,
      bestFor: template.bestFor ?? null,
      previewImage: template.previewImage ?? null,
      createdAt: now,
    };
    this._templates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  async getSubscription(userId: string): Promise<Subscription | undefined> {
    return this._subscriptions.get(userId);
  }

  async createOrUpdateSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const now = new Date();
    const existing = this._subscriptions.get(subscription.userId);
    const newSub: Subscription = {
      id: existing?.id || randomUUID(),
      userId: subscription.userId,
      status: subscription.status || "free",
      paypalSubscriptionId: subscription.paypalSubscriptionId ?? null,
      exportsRemaining: subscription.exportsRemaining ?? null,
      currentPeriodEnd: subscription.currentPeriodEnd ?? null,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    this._subscriptions.set(subscription.userId, newSub);
    return newSub;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const newPayment: Payment = {
      id: randomUUID(),
      userId: payment.userId,
      resumeId: payment.resumeId ?? null,
      paypalOrderId: payment.paypalOrderId ?? null,
      paypalSubscriptionId: payment.paypalSubscriptionId ?? null,
      amount: payment.amount,
      currency: payment.currency ?? "USD",
      type: payment.type,
      status: payment.status,
      createdAt: new Date(),
    };
    this._payments.push(newPayment);
    return newPayment;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return this._payments
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createExport(exportData: InsertExport): Promise<Export> {
    const newExport: Export = {
      id: randomUUID(),
      userId: exportData.userId,
      resumeId: exportData.resumeId,
      exportType: exportData.exportType,
      hasWatermark: exportData.hasWatermark ?? true,
      createdAt: new Date(),
    };
    this._exports.push(newExport);
    return newExport;
  }

  async getExportsByUser(userId: string): Promise<Export[]> {
    return this._exports
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async seedTemplates(): Promise<void> {
    if (this._templates.size > 0) return;
    const templates = [
      { id: "classic-one",       name: "Classic One",        family: "classic",      isPremium: false, isReleased: true, bestFor: "Business, Finance, Law" },
      { id: "modern-slate",      name: "Modern Slate",       family: "modern",       isPremium: false, isReleased: true, bestFor: "Tech, Engineering, Data" },
      { id: "executive-bold",    name: "Executive Bold",     family: "professional", isPremium: false, isReleased: true, bestFor: "Executive, Management, C-Suite" },
      { id: "minimal-clean",     name: "Minimal Clean",      family: "minimal",      isPremium: false, isReleased: true, bestFor: "Consulting, Finance, Legal" },
      { id: "creative-vibrant",  name: "Creative Vibrant",   family: "creative",     isPremium: false, isReleased: true, bestFor: "Design, Marketing, Media" },
      { id: "academic-formal",   name: "Academic Formal",    family: "academic",     isPremium: false, isReleased: true, bestFor: "Academia, Research, Tenure" },
      { id: "research-focused",  name: "Research Focused",   family: "academic",     isPremium: false, isReleased: true, bestFor: "Research, Lab, Science" },
      { id: "scholar-modern",    name: "Scholar Modern",     family: "academic",     isPremium: false, isReleased: true, bestFor: "Graduate, Postdoc, Faculty" },
      { id: "professor-elegant", name: "Professor Elegant",  family: "academic",     isPremium: false, isReleased: true, bestFor: "Professor, Teaching, University" },
      { id: "phd-dynamic",       name: "PhD Dynamic",        family: "academic",     isPremium: false, isReleased: true, bestFor: "PhD Student, Researcher, Postdoc" },
    ];
    for (const t of templates) await this.createTemplate(t);
  }
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  // Resumes
  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db!.select().from(resumes).where(eq(resumes.id, id));
    return resume || undefined;
  }

  async getResumesByUser(userId: string): Promise<Resume[]> {
    return db!.select().from(resumes).where(eq(resumes.userId, userId)).orderBy(desc(resumes.lastSaved));
  }

  async createResume(resume: InsertResume): Promise<Resume> {
    const [newResume] = await db!.insert(resumes).values({
      ...resume,
      resumeData: (resume.resumeData || sampleResumeData) as ResumeData,
    }).returning();
    return newResume;
  }

  async updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume | undefined> {
    const [updated] = await db!
      .update(resumes)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .set({ ...updates, lastSaved: new Date() } as any)
      .where(eq(resumes.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteResume(id: string): Promise<boolean> {
    const result = await db!.delete(resumes).where(eq(resumes.id, id)).returning();
    return result.length > 0;
  }

  async duplicateResume(id: string): Promise<Resume | undefined> {
    const original = await this.getResume(id);
    if (!original) return undefined;

    const [newResume] = await db!.insert(resumes).values({
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
    const [template] = await db!.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async getAllTemplates(): Promise<Template[]> {
    return db!.select().from(templates);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db!.insert(templates).values(template).returning();
    return newTemplate;
  }

  // Subscriptions
  async getSubscription(userId: string): Promise<Subscription | undefined> {
    const [sub] = await db!.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return sub || undefined;
  }

  async createOrUpdateSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const existing = await this.getSubscription(subscription.userId);
    if (existing) {
      const [updated] = await db!
        .update(subscriptions)
        .set({ ...subscription, updatedAt: new Date() })
        .where(eq(subscriptions.userId, subscription.userId))
        .returning();
      return updated;
    }
    const [newSub] = await db!.insert(subscriptions).values(subscription).returning();
    return newSub;
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db!.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return db!.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }

  // Exports
  async createExport(exportData: InsertExport): Promise<Export> {
    const [newExport] = await db!.insert(exports).values(exportData).returning();
    return newExport;
  }

  async getExportsByUser(userId: string): Promise<Export[]> {
    return db!.select().from(exports).where(eq(exports.userId, userId)).orderBy(desc(exports.createdAt));
  }

  // Seed templates
  async seedTemplates(): Promise<void> {
    const existing = await this.getAllTemplates();
    if (existing.length > 0) return;

    const templateData = [
      { id: "classic-one",       name: "Classic One",       family: "classic",      isPremium: false, isReleased: true, bestFor: "Business, Finance, Law" },
      { id: "modern-slate",      name: "Modern Slate",      family: "modern",       isPremium: false, isReleased: true, bestFor: "Tech, Engineering, Data" },
      { id: "executive-bold",    name: "Executive Bold",    family: "professional", isPremium: false, isReleased: true, bestFor: "Executive, Management, C-Suite" },
      { id: "minimal-clean",     name: "Minimal Clean",     family: "minimal",      isPremium: false, isReleased: true, bestFor: "Consulting, Finance, Legal" },
      { id: "creative-vibrant",  name: "Creative Vibrant",  family: "creative",     isPremium: false, isReleased: true, bestFor: "Design, Marketing, Media" },
      { id: "academic-formal",   name: "Academic Formal",   family: "academic",     isPremium: false, isReleased: true, bestFor: "Academia, Research, Tenure" },
      { id: "research-focused",  name: "Research Focused",  family: "academic",     isPremium: false, isReleased: true, bestFor: "Research, Lab, Science" },
      { id: "scholar-modern",    name: "Scholar Modern",    family: "academic",     isPremium: false, isReleased: true, bestFor: "Graduate, Postdoc, Faculty" },
      { id: "professor-elegant", name: "Professor Elegant", family: "academic",     isPremium: false, isReleased: true, bestFor: "Professor, Teaching, University" },
      { id: "phd-dynamic",       name: "PhD Dynamic",       family: "academic",     isPremium: false, isReleased: true, bestFor: "PhD Student, Researcher, Postdoc" },
    ];

    for (const template of templateData) {
      await db!.insert(templates).values(template).onConflictDoNothing();
    }
  }
}

export const storage: IStorage = db ? new DatabaseStorage() : new MemStorage();
