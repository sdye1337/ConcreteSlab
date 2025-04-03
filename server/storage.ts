import { users, type User, type InsertUser, calculations, type Calculation, type InsertCalculation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Calculation methods
  getCalculations(): Promise<Calculation[]>;
  getCalculation(id: number): Promise<Calculation | undefined>;
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  deleteCalculation(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private calculationsMap: Map<number, Calculation>;
  private userCurrentId: number;
  private calculationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.calculationsMap = new Map();
    this.userCurrentId = 1;
    this.calculationCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCalculations(): Promise<Calculation[]> {
    return Array.from(this.calculationsMap.values()).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  async getCalculation(id: number): Promise<Calculation | undefined> {
    return this.calculationsMap.get(id);
  }

  async createCalculation(calculation: InsertCalculation): Promise<Calculation> {
    const id = this.calculationCurrentId++;
    const newCalculation: Calculation = {
      ...calculation,
      id,
      date: new Date(),
    };
    this.calculationsMap.set(id, newCalculation);
    return newCalculation;
  }

  async deleteCalculation(id: number): Promise<boolean> {
    return this.calculationsMap.delete(id);
  }
}

export const storage = new MemStorage();
