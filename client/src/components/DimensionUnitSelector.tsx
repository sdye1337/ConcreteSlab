import React from 'react';
import { getUnitsForSystem } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DimensionUnitSelectorProps {
  unit: string;
  unitType: string; // 'metric' or 'imperial'
  onUnitChange: (unit: string) => void;
}

const DimensionUnitSelector: React.FC<DimensionUnitSelectorProps> = ({
  unit,
  unitType,
  onUnitChange
}) => {
  const availableUnits = getUnitsForSystem(unitType);

  return (
    <Select defaultValue={unit} onValueChange={onUnitChange}>
      <SelectTrigger className="w-16 h-12">
        <SelectValue placeholder={unit} />
      </SelectTrigger>
      <SelectContent>
        {availableUnits.map((unit) => (
          <SelectItem key={unit} value={unit}>
            {unit}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DimensionUnitSelector;