/* eslint-disable */
// @ts-nocheck

export const shadcnSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "32px",
    height: "32px",
    borderRadius: "10px",
    borderColor: state.isFocused ? "var(--chart-1)" : "var(--input)",
    backgroundColor: "var(--background)",
    ":hover": {
      borderColor: state.isFocused
        ? "var(--chart-2)"
        : "color-mix(in oklab, var(--foreground) 18%, var(--input))",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
    height: "32px",
    display: "flex",
    alignItems: "center",
  }),

  placeholder: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
    fontSize: "14px",
    margin: 0,
  }),

  input: (base) => ({
    ...base,
    color: "var(--foreground)",
    fontSize: "14px",
    margin: 0,
    padding: 0,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "var(--popover)",
    border: "1px solid var(--border)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  }),
  menuList: (base) => ({
    ...base,
    padding: "6px",
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: "8px",
    fontSize: "14px",
    marginBlock: "4px",
    backgroundColor: state.isSelected
      ? "var(--chart-1)"
      : state.isFocused
        ? "color-mix(in oklab, var(--chart-1) 20%, transparent)"
        : "transparent",
    color: "var(--foreground)",
    cursor: "pointer",
  }),
  groupHeading: (base) => ({
    ...base,
    color: "var(--chart-5)",
    fontSize: "12px",
    fontWeight: 600,
    marginBottom: "2px",
    paddingInline: "12px",
    textTransform: "none",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "32px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
    ":hover": {
      color: "var(--foreground)",
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
    ":hover": {
      color: "var(--foreground)",
    },
  }),
};
