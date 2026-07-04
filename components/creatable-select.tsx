"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import Creatable from "react-select/creatable";
import { shadcnSelectStyles } from "./select-styles";

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const CreatableSelect = ({
  value,
  onChange,
  disabled,
  onCreate,
  options = [],
  placeholder,
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <Creatable
      placeholder={placeholder}
      styles={shadcnSelectStyles}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  );
};
