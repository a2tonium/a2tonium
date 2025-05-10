import { Minus, Plus } from "lucide-react";

import {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputScrubArea,
} from "@/components/ui/number-input";

import { Label } from "@/components/ui/label";

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function PriceInput({ value, onChange }: PriceInputProps) {
  return (
    <NumberInput
      value={value}
      onValueChange={(val) => {
        if (val !== null) onChange(val);
      }}
      defaultValue={1} min={1}
      className="max-w-3xs"
    >
      <NumberInputScrubArea direction="horizontal">
        <Label className="cursor-ew-resize">Price</Label>
      </NumberInputScrubArea>
      <NumberInputGroup>
        <NumberInputDecrement>
          <Minus className="text-goluboy" />
        </NumberInputDecrement>
        <NumberInputField />
        <NumberInputIncrement>
          <Plus className="text-goluboy"/>
        </NumberInputIncrement>
      </NumberInputGroup>
    </NumberInput>
  );
}
