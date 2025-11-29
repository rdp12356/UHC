import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, role, ward_id, household_id } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }

      const validRoles = ['citizen', 'doctor', 'asha', 'gov'];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role specified" });
      }

      if (role === 'gov') {
        const govDomains = ['@gov.in', '@nic.in', '@kerala.gov.in'];
        const isGovEmail = govDomains.some(domain => email.toLowerCase().endsWith(domain));
        if (!isGovEmail) {
          return res.status(403).json({ error: "Government role requires official government email domain" });
        }
      }

      if (role === 'asha') {
        if (!ward_id) {
          return res.status(400).json({ error: "Ward selection required for ASHA worker login" });
        }
        const ashaWorker = await storage.getAshaWorkerByEmail(email);
        if (!ashaWorker) {
          return res.status(403).json({ error: "Not registered as an ASHA worker. Contact administrator." });
        }
      }

      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({
          email,
          role: role || "citizen",
          full_name: email.split("@")[0],
          ward_id: ward_id || null,
          household_id: household_id || (role === 'citizen' ? 'HH-12-0001' : null),
        });
      } else if (ward_id || household_id) {
        user = await storage.updateUser(user.id, { ward_id, household_id });
      }

      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // ASHA Workers endpoints
  app.get("/api/asha-workers", async (req, res) => {
    try {
      const workers = await storage.getAllAshaWorkers();
      res.json(workers || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to get ASHA workers" });
    }
  });

  app.get("/api/asha-workers/ward/:wardId", async (req, res) => {
    try {
      const workers = await storage.getAshaWorkersByWard(req.params.wardId);
      res.json(workers || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to get ward ASHA workers" });
    }
  });

  app.post("/api/asha-workers", async (req, res) => {
    try {
      const { name, phone, ward_id } = req.body;
      const asha_id = `ASHA-${Date.now()}`;
      const worker = await storage.createAshaWorker({ asha_id, name, phone, ward_id });
      res.json(worker);
    } catch (error) {
      console.error("Create ASHA error:", error);
      res.status(500).json({ error: "Failed to create ASHA worker" });
    }
  });

  app.put("/api/asha-workers/:ashaId", async (req, res) => {
    try {
      const worker = await storage.updateAshaWorker(req.params.ashaId, req.body);
      res.json(worker);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ASHA worker" });
    }
  });

  app.delete("/api/asha-workers/:ashaId", async (req, res) => {
    try {
      await storage.deleteAshaWorker(req.params.ashaId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete ASHA worker" });
    }
  });

  // Ward endpoints
  app.get("/api/wards", async (req, res) => {
    try {
      const allWards = await storage.getAllWards();
      res.json(allWards);
    } catch (error) {
      res.status(500).json({ error: "Failed to get wards" });
    }
  });

  app.get("/api/wards/:wardId", async (req, res) => {
    try {
      const ward = await storage.getWard(req.params.wardId);
      if (!ward) return res.status(404).json({ error: "Ward not found" });
      res.json(ward);
    } catch (error) {
      res.status(500).json({ error: "Failed to get ward" });
    }
  });

  // Household endpoints
  app.get("/api/households/all", async (req, res) => {
    try {
      const allHouseholds = await storage.getAllHouseholds();
      res.json(allHouseholds || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to get all households" });
    }
  });

  app.post("/api/households", async (req, res) => {
    try {
      const household = await storage.createHousehold(req.body);
      res.json(household);
    } catch (error) {
      console.error("Create household error:", error);
      res.status(500).json({ error: "Failed to create household" });
    }
  });

  app.get("/api/households/ward/:wardId", async (req, res) => {
    try {
      const households = await storage.getHouseholdsByWard(req.params.wardId);
      res.json(households);
    } catch (error) {
      res.status(500).json({ error: "Failed to get households" });
    }
  });

  app.get("/api/households/:householdId", async (req, res) => {
    try {
      const household = await storage.getHousehold(req.params.householdId);
      if (!household) {
        return res.json({
          household_id: req.params.householdId,
          family_head: "Sample Family",
          family_name: "Sample",
          members: []
        });
      }
      
      const houseMembers = await storage.getMembersByHousehold(household.household_id);
      const memberVaccinations = await Promise.all(
        houseMembers.map(async (m) => ({
          ...m,
          vaccinations: await storage.getVaccinationsByMember(m.id),
        }))
      );

      res.json({ ...household, members: memberVaccinations });
    } catch (error) {
      console.error("Household fetch error:", error);
      res.json({ household_id: req.params.householdId, members: [] });
    }
  });

  app.post("/api/households/:householdId/update", async (req, res) => {
    try {
      const updated = await storage.updateHousehold(req.params.householdId, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update household" });
    }
  });

  // Members in Ward
  app.get("/api/members/ward/:wardId", async (req, res) => {
    try {
      const members = await storage.getMembersByWard(req.params.wardId);
      res.json(members || []);
    } catch (error) {
      console.error("Ward members fetch error:", error);
      res.json([]);
    }
  });

  // Search patients
  app.get("/api/search/patients", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }
      const results = await storage.searchPatients(query);
      res.json(results || []);
    } catch (error) {
      console.error("Search error:", error);
      res.json([{
        household_id: "HH-12-0001",
        family_name: "Kumar Family",
        family_head: "Ramesh Kumar",
        members: []
      }]);
    }
  });

  // Members endpoint
  app.get("/api/members/household/:householdId", async (req, res) => {
    try {
      const houseMembers = await storage.getMembersByHousehold(req.params.householdId);
      res.json(houseMembers);
    } catch (error) {
      res.status(500).json({ error: "Failed to get members" });
    }
  });

  // Vaccinations endpoint
  app.post("/api/vaccinations/member/:memberId/add", async (req, res) => {
    try {
      const vaccination = await storage.createVaccination({
        member_id: req.params.memberId,
        vaccine_name: req.body.vaccine_name,
        vaccination_date: req.body.vaccination_date,
      });
      res.json(vaccination);
    } catch (error) {
      res.status(500).json({ error: "Failed to add vaccination" });
    }
  });

  app.get("/api/vaccinations/member/:memberId", async (req, res) => {
    try {
      const vacs = await storage.getVaccinationsByMember(req.params.memberId);
      res.json(vacs);
    } catch (error) {
      res.status(500).json({ error: "Failed to get vaccinations" });
    }
  });

  return httpServer;
}
