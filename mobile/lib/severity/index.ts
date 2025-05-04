type SeverityInternal = "low" | "med" | "high";
type SeverityDisplay = "Slight" | "Medium" | "Severe";

export const toDisplaySeverity = (
  severity: SeverityInternal,
): SeverityDisplay => {
  switch (severity) {
    case "low":
      return "Slight";
    case "med":
      return "Medium";
    case "high":
      return "Severe";
  }
};
