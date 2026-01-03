// components/ethiopian-date-input.tsx
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ETHIOPIAN_MONTHS = [
  "መስከረም", "ጥቅምት", "ኅዳር", "ታህሳስ", 
  "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", 
  "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"
]

export function EthiopianDateInput({ value, onChange }: { 
  value?: { day: string, month: string, year: string }, 
  onChange: (date: { day: string, month: string, year: string }) => void 
}) {
  // Generate years (e.g., 2000-2017 Ethiopian)
  const years = Array.from({ length: 65 }, (_, i) => (1960 + i).toString())

  return (
    <div className="flex gap-2">
      {/* Day (1-30) */}
      <Select
        value={value?.day}
        onValueChange={(day) => onChange({ ...value, day } as { day: string, month: string, year: string })}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="ቀን" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <SelectItem key={day} value={day.toString()}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Month */}
      <Select
        value={value?.month}
        onValueChange={(month) => onChange({ ...value, month } as { day: string, month: string, year: string })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="ወር" />
        </SelectTrigger>
        <SelectContent>
          {ETHIOPIAN_MONTHS.map((month, index) => (
            <SelectItem key={month} value={(index + 1).toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year */}
      <Select
        value={value?.year}
        onValueChange={(year) => onChange({ ...value, year } as { day: string, month: string, year: string })}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="ዓመት" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}