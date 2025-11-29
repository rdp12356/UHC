import { type User, type InsertUser, type Ward, type AshaWorker, type Household, type Member, type Vaccination } from "@shared/schema";
import { db } from "./db";
import { users, wards, asha_workers, households, members, vaccinations } from "@shared/schema";
import { eq, like } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Wards
  getWard(wardId: string): Promise<Ward | undefined>;
  getAllWards(): Promise<Ward[]>;
  createWard(ward: any): Promise<Ward>;

  // ASHA Workers
  getAshaWorker(ashaId: string): Promise<AshaWorker | undefined>;
  getAshaWorkersByWard(wardId: string): Promise<AshaWorker[]>;
  createAshaWorker(asha: any): Promise<AshaWorker>;

  // Households
  getHousehold(householdId: string): Promise<Household | undefined>;
  getHouseholdsByWard(wardId: string): Promise<Household[]>;
  createHousehold(household: any): Promise<Household>;
  updateHousehold(householdId: string, data: any): Promise<Household>;

  // Members
  getMember(memberId: string): Promise<Member | undefined>;
  getMembersByHousehold(householdId: string): Promise<Member[]>;
  createMember(member: any): Promise<Member>;

  // Vaccinations
  getVaccination(vaccinationId: string): Promise<Vaccination | undefined>;
  getVaccinationsByMember(memberId: string): Promise<Vaccination[]>;
  createVaccination(vaccination: any): Promise<Vaccination>;

  // Search
  searchPatients(query: string): Promise<(Household & { members: Member[] })[]>;
}

export class DrizzleStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getWard(wardId: string): Promise<Ward | undefined> {
    const result = await db.select().from(wards).where(eq(wards.ward_id, wardId));
    return result[0];
  }

  async getAllWards(): Promise<Ward[]> {
    return await db.select().from(wards);
  }

  async createWard(ward: any): Promise<Ward> {
    const result = await db.insert(wards).values(ward).returning();
    return result[0];
  }

  async getAshaWorker(ashaId: string): Promise<AshaWorker | undefined> {
    const result = await db.select().from(asha_workers).where(eq(asha_workers.asha_id, ashaId));
    return result[0];
  }

  async getAshaWorkersByWard(wardId: string): Promise<AshaWorker[]> {
    return await db.select().from(asha_workers).where(eq(asha_workers.ward_id, wardId));
  }

  async createAshaWorker(asha: any): Promise<AshaWorker> {
    const result = await db.insert(asha_workers).values(asha).returning();
    return result[0];
  }

  async getHousehold(householdId: string): Promise<Household | undefined> {
    const result = await db.select().from(households).where(eq(households.household_id, householdId));
    return result[0];
  }

  async getHouseholdsByWard(wardId: string): Promise<Household[]> {
    return await db.select().from(households).where(eq(households.ward_id, wardId));
  }

  async createHousehold(household: any): Promise<Household> {
    const result = await db.insert(households).values(household).returning();
    return result[0];
  }

  async updateHousehold(householdId: string, data: any): Promise<Household> {
    const result = await db.update(households).set(data).where(eq(households.household_id, householdId)).returning();
    return result[0];
  }

  async getMember(memberId: string): Promise<Member | undefined> {
    const result = await db.select().from(members).where(eq(members.id, memberId));
    return result[0];
  }

  async getMembersByHousehold(householdId: string): Promise<Member[]> {
    return await db.select().from(members).where(eq(members.household_id, householdId));
  }

  async createMember(member: any): Promise<Member> {
    const result = await db.insert(members).values(member).returning();
    return result[0];
  }

  async getVaccination(vaccinationId: string): Promise<Vaccination | undefined> {
    const result = await db.select().from(vaccinations).where(eq(vaccinations.id, vaccinationId));
    return result[0];
  }

  async getVaccinationsByMember(memberId: string): Promise<Vaccination[]> {
    return await db.select().from(vaccinations).where(eq(vaccinations.member_id, memberId));
  }

  async createVaccination(vaccination: any): Promise<Vaccination> {
    const result = await db.insert(vaccinations).values(vaccination).returning();
    return result[0];
  }

  async searchPatients(query: string): Promise<(Household & { members: Member[] })[]> {
    const searchHouseholds = await db.select().from(households).where(
      like(households.family_head, `%${query}%`)
    );
    
    const results = await Promise.all(
      searchHouseholds.map(async (h) => ({
        ...h,
        members: await this.getMembersByHousehold(h.household_id),
      }))
    );
    return results;
  }
}

export const storage = new DrizzleStorage();
