export function pragueStartOfToday() {
  const now = new Date()

  // ziskej dnesni datum v Prague
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)

  const y = parts.find(p => p.type === "year")!.value
  const m = parts.find(p => p.type === "month")!.value
  const d = parts.find(p => p.type === "day")!.value

  // vytvorime PRAZSKOU pulnoc, ale jako UTC timestamp
  return new Date(`${y}-${m}-${d}T00:00:00.000+01:00`)
}