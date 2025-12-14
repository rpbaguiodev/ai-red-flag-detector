export function getScoreColor(value: number) {
  if (value <= 20) return "#4CAF50";
  if (value <= 40) return "#FFEB3B";
  if (value <= 60) return "#FF9800";
  if (value <= 80) return "#F44336";
  return "#B71C1C";
}
