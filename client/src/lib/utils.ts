import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format numbers with commas for thousands
export function formatNumber(value: number, decimalPlaces = 3): string {
  return value.toLocaleString('en-US', { 
    minimumFractionDigits: decimalPlaces, 
    maximumFractionDigits: decimalPlaces 
  });
}

// Unit conversion constants
const UNIT_CONVERSION = {
  // Metric
  m: 1,            // base unit for metric
  cm: 0.01,        // 1 cm = 0.01 m
  mm: 0.001,       // 1 mm = 0.001 m
  
  // Imperial
  ft: 0.3048,      // 1 ft = 0.3048 m
  yd: 0.9144,      // 1 yd = 0.9144 m
  in: 0.0254       // 1 in = 0.0254 m
};

// List of available units by system
export const METRIC_UNITS = ['m', 'cm', 'mm'];
export const IMPERIAL_UNITS = ['ft', 'yd', 'in'];

// Get all available units for the given unit system
export function getUnitsForSystem(unitType: string): string[] {
  return unitType === 'metric' ? METRIC_UNITS : IMPERIAL_UNITS;
}

// Convert a value from one unit to another
export function convertValue(value: number, fromUnit: string, toUnit: string): number {
  // Convert to meters first (base unit)
  const valueInMeters = value * (UNIT_CONVERSION[fromUnit as keyof typeof UNIT_CONVERSION] || 1);
  
  // Then convert from meters to the target unit
  return valueInMeters / (UNIT_CONVERSION[toUnit as keyof typeof UNIT_CONVERSION] || 1);
}

// Calculate number of concrete bags needed
export function calculateBags(volumeInCubicMeters: number, bagSize: number, unitType: string): number {
  // Average density of concrete is about 2400 kg/m³
  const concreteDensity = 2400; // kg/m³
  
  // Calculate total weight of concrete needed
  const totalWeightKg = volumeInCubicMeters * concreteDensity;
  
  // Convert bag size to kg if it's in lb (for imperial)
  const bagWeightKg = unitType === 'metric' ? bagSize : bagSize * 0.453592; // 1 lb = 0.453592 kg
  
  // Calculate number of bags
  return Math.ceil(totalWeightKg / bagWeightKg);
}

// Format a dimension with unit
export function formatDimension(value: number, unit: string): string {
  return `${formatNumber(value, 2)} ${unit}`;
}
