import { db } from "./db";
import { wards, asha_workers, households, members, vaccinations } from "@shared/schema";

const seedData = async () => {
  try {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    await db.delete(vaccinations);
    await db.delete(members);
    await db.delete(households);
    await db.delete(asha_workers);
    await db.delete(wards);

    // Create Ward
    const ward = await db
      .insert(wards)
      .values({
        ward_id: "WARD-KL-ER-12",
        state: "Kerala",
        district: "Ernakulam",
        ward_name: "Gandhi Nagar",
        ward_number: 12,
        cleanliness_rate: 78,
        vaccination_completion_rate: 91,
      })
      .returning();

    console.log("✓ Ward created:", ward[0].ward_id);

    // Create ASHA Workers
    const ashaWorkers = await db
      .insert(asha_workers)
      .values([
        {
          asha_id: "ASHA-12-001",
          ward_id: "WARD-KL-ER-12",
          name: "Anitha K",
          phone: "9876543210",
          email: "anitha@asha.kerala.gov.in",
        },
        {
          asha_id: "ASHA-12-002",
          ward_id: "WARD-KL-ER-12",
          name: "Lekha R",
          phone: "9876543211",
          email: "lekha@asha.kerala.gov.in",
        },
      ])
      .returning();

    console.log("✓ ASHA Workers created:", ashaWorkers.length);

    // Create Households
    const householdsData = [
      {
        household_id: "HH-12-0001",
        ward_id: "WARD-KL-ER-12",
        family_name: "Kumar Family",
        family_head: "Ramesh Kumar",
        cleanliness_score: 82,
        vaccination_completion: 100,
        last_visit: new Date("2024-11-25"),
        address: "Gandhi Nagar, Ward 12",
        uhc_id: "UHC-2024-0001",
      },
      {
        household_id: "HH-12-0002",
        ward_id: "WARD-KL-ER-12",
        family_name: "Shaji Family",
        family_head: "Shaji",
        cleanliness_score: 74,
        vaccination_completion: 80,
        last_visit: new Date("2024-11-20"),
        address: "Gandhi Nagar, Ward 12",
        uhc_id: "UHC-2024-0002",
      },
      {
        household_id: "HH-12-0003",
        ward_id: "WARD-KL-ER-12",
        family_name: "Fatima Family",
        family_head: "Fatima",
        cleanliness_score: 89,
        vaccination_completion: 100,
        last_visit: new Date("2024-11-22"),
        address: "Gandhi Nagar, Ward 12",
        uhc_id: "UHC-2024-0003",
      },
      {
        household_id: "HH-12-0004",
        ward_id: "WARD-KL-ER-12",
        family_name: "Rajan Family",
        family_head: "Rajan",
        cleanliness_score: 70,
        vaccination_completion: 83,
        last_visit: new Date("2024-11-18"),
        address: "Gandhi Nagar, Ward 12",
        uhc_id: "UHC-2024-0004",
      },
      {
        household_id: "HH-12-0005",
        ward_id: "WARD-KL-ER-12",
        family_name: "Sumi Family",
        family_head: "Sumi",
        cleanliness_score: 90,
        vaccination_completion: 100,
        last_visit: new Date("2024-11-24"),
        address: "Gandhi Nagar, Ward 12",
        uhc_id: "UHC-2024-0005",
      },
    ];

    const createdHouseholds = await db.insert(households).values(householdsData).returning();
    console.log("✓ Households created:", createdHouseholds.length);

    // Create Members and Vaccinations
    const membersData = [
      // HH-12-0001 (Kumar Family)
      {
        household_id: "HH-12-0001",
        name: "Ramesh Kumar",
        age: 42,
        relation: "Father",
      },
      {
        household_id: "HH-12-0001",
        name: "Lakshmi Kumar",
        age: 38,
        relation: "Mother",
      },
      {
        household_id: "HH-12-0001",
        name: "Rahul Kumar",
        age: 12,
        relation: "Son",
      },
      {
        household_id: "HH-12-0001",
        name: "Riya Kumar",
        age: 7,
        relation: "Daughter",
      },
      // HH-12-0002 (Shaji Family)
      {
        household_id: "HH-12-0002",
        name: "Shaji",
        age: 48,
        relation: "Father",
      },
      {
        household_id: "HH-12-0002",
        name: "Mary Shaji",
        age: 45,
        relation: "Mother",
      },
      {
        household_id: "HH-12-0002",
        name: "Joel Shaji",
        age: 19,
        relation: "Son",
      },
      {
        household_id: "HH-12-0002",
        name: "Anna Shaji",
        age: 15,
        relation: "Daughter",
      },
      {
        household_id: "HH-12-0002",
        name: "Grandmother",
        age: 71,
        relation: "Grandmother",
      },
      // HH-12-0003 (Fatima Family)
      {
        household_id: "HH-12-0003",
        name: "Fatima",
        age: 35,
        relation: "Mother",
      },
      {
        household_id: "HH-12-0003",
        name: "Ahmed",
        age: 10,
        relation: "Son",
      },
      {
        household_id: "HH-12-0003",
        name: "Sara",
        age: 6,
        relation: "Daughter",
      },
      // HH-12-0004 (Rajan Family)
      {
        household_id: "HH-12-0004",
        name: "Rajan",
        age: 50,
        relation: "Father",
      },
      {
        household_id: "HH-12-0004",
        name: "Divya Rajan",
        age: 46,
        relation: "Mother",
      },
      {
        household_id: "HH-12-0004",
        name: "Rishi",
        age: 17,
        relation: "Son",
      },
      {
        household_id: "HH-12-0004",
        name: "Riya",
        age: 14,
        relation: "Daughter",
      },
      {
        household_id: "HH-12-0004",
        name: "Rahul",
        age: 12,
        relation: "Son",
      },
      {
        household_id: "HH-12-0004",
        name: "Grandfather",
        age: 70,
        relation: "Grandfather",
      },
      // HH-12-0005 (Sumi Family)
      {
        household_id: "HH-12-0005",
        name: "Sumi",
        age: 31,
        relation: "Mother",
      },
      {
        household_id: "HH-12-0005",
        name: "Arya",
        age: 5,
        relation: "Daughter",
      },
    ];

    const createdMembers = await db.insert(members).values(membersData).returning();
    console.log("✓ Members created:", createdMembers.length);

    // Create Vaccinations (mapping by member name and household)
    const memberMap = new Map();
    createdMembers.forEach((m) => {
      memberMap.set(`${m.household_id}-${m.name}`, m.id);
    });

    const vaccinationsData = [
      // Ramesh Kumar
      { member_id: memberMap.get("HH-12-0001-Ramesh Kumar"), vaccine_name: "COVID Dose 1", vaccination_date: new Date("2021-05-12") },
      { member_id: memberMap.get("HH-12-0001-Ramesh Kumar"), vaccine_name: "COVID Dose 2", vaccination_date: new Date("2021-08-15") },
      { member_id: memberMap.get("HH-12-0001-Ramesh Kumar"), vaccine_name: "Flu 2024", vaccination_date: new Date("2024-01-20") },
      // Lakshmi Kumar
      { member_id: memberMap.get("HH-12-0001-Lakshmi Kumar"), vaccine_name: "COVID Dose 1", vaccination_date: new Date("2021-06-02") },
      { member_id: memberMap.get("HH-12-0001-Lakshmi Kumar"), vaccine_name: "COVID Dose 2", vaccination_date: new Date("2021-09-10") },
      { member_id: memberMap.get("HH-12-0001-Lakshmi Kumar"), vaccine_name: "Tetanus Booster", vaccination_date: new Date("2023-10-12") },
      // Rahul Kumar
      { member_id: memberMap.get("HH-12-0001-Rahul Kumar"), vaccine_name: "DTP Booster", vaccination_date: new Date("2023-06-11") },
      { member_id: memberMap.get("HH-12-0001-Rahul Kumar"), vaccine_name: "MMR", vaccination_date: new Date("2018-04-19") },
      // Riya Kumar
      { member_id: memberMap.get("HH-12-0001-Riya Kumar"), vaccine_name: "Polio Oral", vaccination_date: new Date("2023-09-05") },
      { member_id: memberMap.get("HH-12-0001-Riya Kumar"), vaccine_name: "MMR", vaccination_date: new Date("2022-03-10") },
      // Shaji
      { member_id: memberMap.get("HH-12-0002-Shaji"), vaccine_name: "COVID Dose 1", vaccination_date: new Date("2021-04-20") },
      { member_id: memberMap.get("HH-12-0002-Shaji"), vaccine_name: "COVID Dose 2", vaccination_date: new Date("2021-07-18") },
      // Mary Shaji
      { member_id: memberMap.get("HH-12-0002-Mary Shaji"), vaccine_name: "COVID Dose 1", vaccination_date: new Date("2021-05-10") },
      { member_id: memberMap.get("HH-12-0002-Mary Shaji"), vaccine_name: "COVID Dose 2", vaccination_date: new Date("2021-08-09") },
      { member_id: memberMap.get("HH-12-0002-Mary Shaji"), vaccine_name: "Flu 2024", vaccination_date: new Date("2024-02-01") },
      // Joel Shaji
      { member_id: memberMap.get("HH-12-0002-Joel Shaji"), vaccine_name: "COVID Dose 1", vaccination_date: new Date("2021-09-02") },
      { member_id: memberMap.get("HH-12-0002-Joel Shaji"), vaccine_name: "COVID Dose 2", vaccination_date: new Date("2021-12-06") },
      // Anna Shaji
      { member_id: memberMap.get("HH-12-0002-Anna Shaji"), vaccine_name: "MMR", vaccination_date: new Date("2015-06-15") },
      { member_id: memberMap.get("HH-12-0002-Anna Shaji"), vaccine_name: "DTP Booster", vaccination_date: new Date("2021-03-12") },
      // Grandmother (Shaji Family)
      { member_id: memberMap.get("HH-12-0002-Grandmother"), vaccine_name: "COVID Dose 1", vaccination_date: new Date("2021-03-10") },
      // Fatima
      { member_id: memberMap.get("HH-12-0003-Fatima"), vaccine_name: "Flu 2024", vaccination_date: new Date("2024-01-22") },
      { member_id: memberMap.get("HH-12-0003-Fatima"), vaccine_name: "Hepatitis B", vaccination_date: new Date("2023-08-14") },
      // Ahmed
      { member_id: memberMap.get("HH-12-0003-Ahmed"), vaccine_name: "DTP", vaccination_date: new Date("2023-05-09") },
      { member_id: memberMap.get("HH-12-0003-Ahmed"), vaccine_name: "Polio Oral", vaccination_date: new Date("2022-11-10") },
      // Sara
      { member_id: memberMap.get("HH-12-0003-Sara"), vaccine_name: "MMR", vaccination_date: new Date("2021-02-18") },
      { member_id: memberMap.get("HH-12-0003-Sara"), vaccine_name: "Polio", vaccination_date: new Date("2022-03-10") },
      // Rajan
      { member_id: memberMap.get("HH-12-0004-Rajan"), vaccine_name: "COVID Dose 1", vaccination_date: new Date("2021-05-12") },
      // Divya Rajan
      { member_id: memberMap.get("HH-12-0004-Divya Rajan"), vaccine_name: "COVID Dose 1", vaccination_date: new Date("2021-06-20") },
      { member_id: memberMap.get("HH-12-0004-Divya Rajan"), vaccine_name: "COVID Dose 2", vaccination_date: new Date("2021-09-28") },
      // Rishi
      { member_id: memberMap.get("HH-12-0004-Rishi"), vaccine_name: "MMR", vaccination_date: new Date("2010-04-19") },
      { member_id: memberMap.get("HH-12-0004-Rishi"), vaccine_name: "DTP Booster", vaccination_date: new Date("2021-09-14") },
      // Riya (Rajan Family)
      { member_id: memberMap.get("HH-12-0004-Riya"), vaccine_name: "MMR", vaccination_date: new Date("2012-03-21") },
      // Rahul (Rajan Family)
      { member_id: memberMap.get("HH-12-0004-Rahul"), vaccine_name: "DTP", vaccination_date: new Date("2022-12-11") },
      // Sumi
      { member_id: memberMap.get("HH-12-0005-Sumi"), vaccine_name: "COVID Dose 1", vaccination_date: new Date("2021-07-15") },
      { member_id: memberMap.get("HH-12-0005-Sumi"), vaccine_name: "COVID Dose 2", vaccination_date: new Date("2021-10-14") },
      // Arya
      { member_id: memberMap.get("HH-12-0005-Arya"), vaccine_name: "Polio Oral", vaccination_date: new Date("2023-09-05") },
      { member_id: memberMap.get("HH-12-0005-Arya"), vaccine_name: "MMR", vaccination_date: new Date("2021-10-02") },
    ].filter((v) => v.member_id); // Filter out any undefined member_ids

    const createdVaccinations = await db.insert(vaccinations).values(vaccinationsData).returning();
    console.log("✓ Vaccinations created:", createdVaccinations.length);

    console.log("✅ Database seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedData();
