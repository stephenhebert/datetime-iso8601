interface DateComponents {
  year: number
  month: number
  day: number
}

interface TimeComponents {
  hour: number
  minute: number
  second: number
}

interface TimeZoneOffsetComponents {
  tzOffsetHour: number
  tzOffsetMinute: number
}

type DateTimeComponents = DateComponents & TimeComponents & TimeZoneOffsetComponents

interface DateObject { date: string }
interface TimeObject { time: string }
interface TimeZoneOffsetObject { tzOffset: string }
interface WeekdayObject { weekday: string }
interface WeekdayIndexObject { weekdayIndex: number }

type ParsedTimeComponents = DateTimeComponents &
  DateObject &
  TimeObject &
  TimeZoneOffsetObject &
  WeekdayObject &
  WeekdayIndexObject

type BuildComponents = Partial<
  DateComponents &
  TimeComponents &
  TimeZoneOffsetComponents &
  DateObject &
  TimeObject &
  TimeZoneOffsetObject
>

type DateTimeComponentKey = keyof DateTimeComponents
type ParsedTimeComponentKey = keyof ParsedTimeComponents

export type {
  BuildComponents,
  DateComponents,
  DateTimeComponentKey,
  DateTimeComponents,
  ParsedTimeComponentKey,
  ParsedTimeComponents,
  TimeComponents,
  TimeZoneOffsetComponents,
}

