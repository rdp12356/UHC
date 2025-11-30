import { type User, type InsertUser, type Ward, type AshaWorker, type Household, type Member, type Vaccination, type Hospital, type Citizen, type Funding, type Appointment, type InsertAppointment, type AshaReview, type InsertAshaReview } from "@shared/schema";
import { db } from "./db";
import { users, wards, asha_workers, households, members, vaccinations, hospitals, citizens, funding, appointments, asha_reviews } from "@shared/schema";
import { eq, like, inArray } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: any): Promise<User>;

  // Wards
  getWard(wardId: string): Promise<Ward | undefined>;
  getAllWards(): Promise<Ward[]>;
  createWard(ward: any): Promise<Ward>;

  // ASHA Workers
  getAshaWorker(ashaId: string): Promise<AshaWorker | undefined>;
  getAshaWorkerByEmail(email: string): Promise<AshaWorker | undefined>;
  getAshaWorkersByWard(wardId: string): Promise<AshaWorker[]>;
  getAllAshaWorkers(): Promise<AshaWorker[]>;
  createAshaWorker(asha: any): Promise<AshaWorker>;
  updateAshaWorker(ashaId: string, data: any): Promise<AshaWorker>;
  deleteAshaWorker(ashaId: string): Promise<void>;

  // Households
  getHousehold(householdId: string): Promise<Household | undefined>;
  getHouseholdsByWard(wardId: string): Promise<Household[]>;
  getAllHouseholds(): Promise<Household[]>;
  createHousehold(household: any): Promise<Household>;
  updateHousehold(householdId: string, data: any): Promise<Household>;

  // Members
  getMember(memberId: string): Promise<Member | undefined>;
  getMembersByHousehold(householdId: string): Promise<Member[]>;
  getMembersByWard(wardId: string): Promise<Member[]>;
  createMember(member: any): Promise<Member>;

  // Vaccinations
  getVaccination(vaccinationId: string): Promise<Vaccination | undefined>;
  getVaccinationsByMember(memberId: string): Promise<Vaccination[]>;
  createVaccination(vaccination: any): Promise<Vaccination>;

  // Hospitals
  getHospital(hospitalId: string): Promise<Hospital | undefined>;
  getAllHospitals(): Promise<Hospital[]>;
  createHospital(hospital: any): Promise<Hospital>;
  updateHospital(hospitalId: string, data: any): Promise<Hospital>;

  // Citizens
  getCitizen(citizenId: string): Promise<Citizen | undefined>;
  getAllCitizens(): Promise<Citizen[]>;
  createCitizen(citizen: any): Promise<Citizen>;
  getCitizenByUhcId(uhcId: string): Promise<Citizen | undefined>;

  // Funding
  getFunding(fundingId: string): Promise<Funding | undefined>;
  getFundingByHousehold(householdId: string): Promise<Funding | undefined>;
  getAllFunding(): Promise<Funding[]>;
  createFunding(funding: any): Promise<Funding>;
  updateFunding(fundingId: string, data: any): Promise<Funding>;

  // Appointments
  getAppointment(appointmentId: string): Promise<Appointment | undefined>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(appointmentId: string, data: any): Promise<Appointment>;
  deleteAppointment(appointmentId: string): Promise<void>;

  // ASHA Reviews & Suspension
  getAshaReviews(ashaId: string): Promise<AshaReview[]>;
  createAshaReview(review: InsertAshaReview): Promise<AshaReview>;
  suspendAshaWorker(ashaId: string, reason: string, suspendedBy: string): Promise<AshaWorker>;
  reactivateAshaWorker(ashaId: string): Promise<AshaWorker>;

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

  async updateUser(id: string, data: any): Promise<User> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
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

  async getAshaWorkerByEmail(email: string): Promise<AshaWorker | undefined> {
    const result = await db.select().from(asha_workers).where(eq(asha_workers.email, email));
    return result[0];
  }

  async getAllAshaWorkers(): Promise<AshaWorker[]> {
    return await db.select().from(asha_workers);
  }

  async createAshaWorker(asha: any): Promise<AshaWorker> {
    const result = await db.insert(asha_workers).values(asha).returning();
    return result[0];
  }

  async updateAshaWorker(ashaId: string, data: any): Promise<AshaWorker> {
    const result = await db.update(asha_workers).set(data).where(eq(asha_workers.asha_id, ashaId)).returning();
    return result[0];
  }

  async deleteAshaWorker(ashaId: string): Promise<void> {
    await db.delete(asha_workers).where(eq(asha_workers.asha_id, ashaId));
  }

  async getHousehold(householdId: string): Promise<Household | undefined> {
    const result = await db.select().from(households).where(eq(households.household_id, householdId));
    return result[0];
  }

  async getHouseholdsByWard(wardId: string): Promise<Household[]> {
    return await db.select().from(households).where(eq(households.ward_id, wardId));
  }

  async getAllHouseholds(): Promise<Household[]> {
    return await db.select().from(households);
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

  async getMembersByWard(wardId: string): Promise<Member[]> {
    const wardHouseholds = await db.select().from(households).where(eq(households.ward_id, wardId));
    const householdIds = wardHouseholds.map(h => h.household_id);
    if (householdIds.length === 0) return [];
    
    return await db.select().from(members).where(inArray(members.household_id, householdIds));
  }

  async createMember(member: any): Promise<Member> {
    // Generate member_id if not provided
    if (!member.member_id) {
      const householdId = member.household_id;
      const existingMembers = await db.select().from(members).where(eq(members.household_id, householdId));
      const memberCount = existingMembers.length + 1;
      const householdNumber = householdId.split('-')[2]; // Extract from HH-12-0001
      member.member_id = `MEM-${householdNumber}-${String(memberCount).padStart(3, '0')}`;
    }
    
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

  async getHospital(hospitalId: string): Promise<Hospital | undefined> {
    const result = await db.select().from(hospitals).where(eq(hospitals.hospital_id, hospitalId));
    return result[0];
  }

  async getAllHospitals(): Promise<Hospital[]> {
    return await db.select().from(hospitals);
  }

  async createHospital(hospital: any): Promise<Hospital> {
    const result = await db.insert(hospitals).values(hospital).returning();
    return result[0];
  }

  async updateHospital(hospitalId: string, data: any): Promise<Hospital> {
    const result = await db.update(hospitals).set(data).where(eq(hospitals.hospital_id, hospitalId)).returning();
    return result[0];
  }

  async getCitizen(citizenId: string): Promise<Citizen | undefined> {
    const result = await db.select().from(citizens).where(eq(citizens.citizen_id, citizenId));
    return result[0];
  }

  async getAllCitizens(): Promise<Citizen[]> {
    return await db.select().from(citizens);
  }

  async createCitizen(citizen: any): Promise<Citizen> {
    const result = await db.insert(citizens).values(citizen).returning();
    return result[0];
  }

  async getCitizenByUhcId(uhcId: string): Promise<Citizen | undefined> {
    const result = await db.select().from(citizens).where(eq(citizens.uhc_id, uhcId));
    return result[0];
  }

  async getFunding(fundingId: string): Promise<Funding | undefined> {
    const result = await db.select().from(funding).where(eq(funding.id, fundingId));
    return result[0];
  }

  async getFundingByHousehold(householdId: string): Promise<Funding | undefined> {
    const result = await db.select().from(funding).where(eq(funding.household_id, householdId));
    return result[0];
  }

  async getAllFunding(): Promise<Funding[]> {
    return await db.select().from(funding);
  }

  async createFunding(fundingData: any): Promise<Funding> {
    const result = await db.insert(funding).values(fundingData).returning();
    return result[0];
  }

  async updateFunding(fundingId: string, data: any): Promise<Funding> {
    const result = await db.update(funding).set(data).where(eq(funding.id, fundingId)).returning();
    return result[0];
  }

  async getAppointment(appointmentId: string): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, appointmentId));
    return result[0];
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.doctor_id, doctorId));
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.patient_id, patientId));
  }

  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values(appointmentData).returning();
    return result[0];
  }

  async updateAppointment(appointmentId: string, data: any): Promise<Appointment> {
    const result = await db.update(appointments).set(data).where(eq(appointments.id, appointmentId)).returning();
    return result[0];
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, appointmentId));
  }

  async getAshaReviews(ashaId: string): Promise<AshaReview[]> {
    return await db.select().from(asha_reviews).where(eq(asha_reviews.asha_id, ashaId));
  }

  async createAshaReview(reviewData: InsertAshaReview): Promise<AshaReview> {
    const result = await db.insert(asha_reviews).values(reviewData).returning();
    return result[0];
  }

  async suspendAshaWorker(ashaId: string, reason: string, suspendedBy: string): Promise<AshaWorker> {
    const result = await db.update(asha_workers).set({
      status: "suspended",
      suspension_reason: reason,
      suspended_by: suspendedBy,
      suspended_at: new Date().toISOString().split('T')[0]
    }).where(eq(asha_workers.asha_id, ashaId)).returning();
    return result[0];
  }

  async reactivateAshaWorker(ashaId: string): Promise<AshaWorker> {
    const result = await db.update(asha_workers).set({
      status: "active",
      suspension_reason: null,
      suspended_by: null,
      suspended_at: null
    }).where(eq(asha_workers.asha_id, ashaId)).returning();
    return result[0];
  }
}

export const storage = new DrizzleStorage();
