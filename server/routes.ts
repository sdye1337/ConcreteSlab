import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Get all calculations
  app.get("/api/calculations", async (req: Request, res: Response) => {
    try {
      const calculations = await storage.getCalculations();
      res.json(calculations);
    } catch (error) {
      console.error("Error fetching calculations:", error);
      res.status(500).json({ message: "Failed to fetch calculations" });
    }
  });

  // Get calculation by ID
  app.get("/api/calculations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid calculation ID" });
      }
      
      const calculation = await storage.getCalculation(id);
      if (!calculation) {
        return res.status(404).json({ message: "Calculation not found" });
      }
      
      res.json(calculation);
    } catch (error) {
      console.error("Error fetching calculation:", error);
      res.status(500).json({ message: "Failed to fetch calculation" });
    }
  });

  // Create a new calculation
  app.post("/api/calculations", async (req: Request, res: Response) => {
    try {
      const validationResult = insertCalculationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newCalculation = await storage.createCalculation(validationResult.data);
      res.status(201).json(newCalculation);
    } catch (error) {
      console.error("Error creating calculation:", error);
      res.status(500).json({ message: "Failed to create calculation" });
    }
  });

  // Delete a calculation
  app.delete("/api/calculations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid calculation ID" });
      }
      
      const deleted = await storage.deleteCalculation(id);
      if (!deleted) {
        return res.status(404).json({ message: "Calculation not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting calculation:", error);
      res.status(500).json({ message: "Failed to delete calculation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
