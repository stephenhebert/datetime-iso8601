import { Iana, parseRegex, tzOffsetRegexString } from './const'
import type {
  BuildComponents,
  DateComponents,
  DateTimeComponents,
  ParsedTimeComponentKey,
  ParsedTimeComponents,
  TimeComponents,
  TimeZoneOffsetComponents,
} from './types'

/**
 * A utility class for parsing, manipulating, and formatting ISO8601 date-time strings.
 */
class DateTimeIso8601 {
  #state: string

  /**
   * Constructs a new DateTimeIso8601 instance.
   * @param isoString An ISO8601 date-time string.
   * @throws {Error} If the string cannot be parsed.
   */
  constructor(isoString: string) {
    if (!parseRegex.test(isoString)) throw new Error('Unable to parse time string')
    this.#state = isoString
  }

  static #pad(value: string | number, length: number): string {
    return value.toString().padStart(length, '0')
  }

  static #formatTzOffsetHour(v: string | number): string {
    const { sign = '+', value = '0' }
      = /(?<sign>[+-])?(?<value>\d+)/.exec(v.toString())?.groups ?? {}
    return `${sign}${value.toString().padStart(2, '0')}`
  }

  #buildDate({ year, month, day }: DateComponents): string {
    return [
      DateTimeIso8601.#pad(year, 4),
      DateTimeIso8601.#pad(month, 2),
      DateTimeIso8601.#pad(day, 2),
    ].join('-')
  }

  #buildTime({ hour, minute, second }: TimeComponents): string {
    return [
      DateTimeIso8601.#pad(hour, 2),
      DateTimeIso8601.#pad(minute, 2),
      DateTimeIso8601.#pad(second, 2),
    ].join(':')
  }

  #buildTzOffset({ tzOffsetHour, tzOffsetMinute }: TimeZoneOffsetComponents): string {
    return [
      DateTimeIso8601.#formatTzOffsetHour(tzOffsetHour),
      DateTimeIso8601.#pad(tzOffsetMinute, 2),
    ].join(':')
  }

  #getWeekdayIndex(str = this.#state): number {
    const { year, month, day } = this.#parse(str)
    return new Date(year, month - 1, day).getDay()
  }

  #getWeekday(str = this.#state): string {
    return [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ][this.#getWeekdayIndex(str)]
  }

  #parse(str = this.#state): DateTimeComponents {
    const match = parseRegex.exec(str)
    if (!match?.groups) throw new Error('Invalid ISO string')
    const {
      year,
      month,
      day,
      hour,
      minute,
      second,
      tzOffsetHour,
      tzOffsetMinute,
    } = match.groups as Record<string, string>
    return {
      year: +year,
      month: +month,
      day: +day,
      hour: +hour,
      minute: +minute,
      second: +second,
      tzOffsetHour: +tzOffsetHour,
      tzOffsetMinute: +tzOffsetMinute,
    }
  }

  #build(components: BuildComponents): string {
    const date = components.date ?? this.#buildDate(components as DateComponents)
    const time = components.time ?? this.#buildTime(components as TimeComponents)
    const tzOffset
      = components.tzOffset
        ?? this.#buildTzOffset(components as TimeZoneOffsetComponents)
    return `${date}T${time}${tzOffset}`
  }

  #convertTz(tzOffset: keyof typeof Iana, str: string = this.#state): string {
    if (!new RegExp(tzOffsetRegexString).test(tzOffset))
      throw new Error(`Expect tz format as UTC offset: ${tzOffsetRegexString}`)
    let timeZone: string = tzOffset
    // Node < v22 does not accept UTC tzOffset as timezone, so for compatibility we use IANA table
    // https://github.com/nodejs/node/issues/53419
    const isNode
      = typeof globalThis !== 'undefined'
        && Object.prototype.toString.call(globalThis) === '[object global]'
    if (isNode && Iana[tzOffset] === undefined)
      throw new Error('tzOffset not supported')
    if (isNode) timeZone = Iana[tzOffset]
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone,
    }
    const dtf = new Intl.DateTimeFormat('en-US', options)
    const date = new Date(str)
    const parts = dtf.formatToParts(date)
    const components = Object.fromEntries(
      parts.filter(p => p.type !== 'literal').map(p => [p.type,
        p.value]),
    )
    return this.#build({ ...components, tzOffset })
  }

  /**
   * Converts the current date-time to the specified time zone offset.
   * @param tzOffset The time zone offset as a key of the IANA mapping (e.g., '+00:00').
   * @returns The current instance for chaining.
   * @throws {Error} If the tzOffset is not supported.
   */
  tz(tzOffset: keyof typeof Iana): this {
    this.#state = this.#convertTz(tzOffset)
    return this
  }

  #reconcile(components: BuildComponents): string {
    const tzOffset = this.#buildTzOffset(components as TimeZoneOffsetComponents) as keyof typeof Iana
    let d = new Date(
      (components.year as number) ?? 0,
      components.month === undefined ? 0 : (components.month as number) - 1,
      (components.day as number) ?? 0,
      (components.hour as number) ?? 0,
      (components.minute as number) ?? 0,
      (components.second as number) ?? 0,
    )
    if (d.toISOString().endsWith('Z')) {
      d = new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000)
    }
    const iso = `${d.toISOString().slice(0, 19)}${tzOffset}`
    return this.#convertTz(tzOffset, iso)
  }

  /**
   * Gets a parsed component or all components of the current date-time.
   * @param key Optional. The specific component key to retrieve.
   * @returns The requested component value or an object with all components.
   */
  get<K extends ParsedTimeComponentKey>(
    key?: K,
  ): ParsedTimeComponents | ParsedTimeComponents[K] {
    const parsed = this.#parse()
    const values: ParsedTimeComponents = {
      ...parsed,
      date: this.#buildDate(parsed),
      time: this.#buildTime(parsed),
      tzOffset: this.#buildTzOffset(parsed),
      weekday: this.#getWeekday(),
      weekdayIndex: this.#getWeekdayIndex(),
    }
    return key ? values[key] : values
  }

  /**
   * Updates the current date-time with new components.
   * @param newComponents Partial date-time components to update.
   * @param relative If true, adds values to the current components; otherwise, replaces them.
   * @returns The current instance for chaining.
   */
  update(
    newComponents: Partial<DateTimeComponents>,
    relative = false,
  ): this {
    const old = this.#parse()
    const merged: DateTimeComponents = relative
      ? (Object.fromEntries(
          Object.entries(old).map(([k,
            v]) => [
            k,
            v + (newComponents[k as keyof DateTimeComponents] ?? 0),
          ]),
        ) as DateTimeComponents)
      : { ...old, ...newComponents }
    this.#state = this.#reconcile(merged)
    return this
  }

  /**
   * Returns the ISO8601 string representation of the current date-time.
   * @returns The ISO8601 string.
   */
  toString(): string {
    return this.#state
  }
}

export { DateTimeIso8601 }

