"use client";

import React, { useMemo } from "react";
import Select, { SingleValue } from "react-select";
import { shadcnSelectStyles } from "./select-styles";

type GroupedOption = {
  label: string;
  value: string;
};

type GroupedOptionGroup = {
  label: string;
  options: GroupedOption[];
};

type GroupedSelectProps = {
  value?: string | null;
  onChange: (value?: string) => void;
  options: GroupedOptionGroup[];
  disabled?: boolean;
  placeholder?: string;
};

export function GroupedSelect({
  value,
  onChange,
  options,
  disabled,
  placeholder,
}: GroupedSelectProps) {
  const selectedOption = useMemo(() => {
    for (const group of options) {
      const match = group.options.find((option) => option.value === value);

      if (match) return match;
    }

    return null;
  }, [options, value]);

  const handleChange = (option: SingleValue<GroupedOption>) => {
    onChange(option?.value);
  };

  return (
    <Select
      placeholder={placeholder}
      styles={shadcnSelectStyles}
      value={selectedOption}
      onChange={handleChange}
      options={options}
      isDisabled={disabled}
    />
  );
}
