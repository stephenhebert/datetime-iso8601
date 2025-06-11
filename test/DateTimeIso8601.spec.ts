import { describe, expect, it } from 'vitest'
import { DateTimeIso8601 } from '../src'
import type { ParsedTimeComponents } from '../src/types'

const validIso = '2024-06-01T12:34:56+02:00'

describe('DateTimeIso8601', () => {
  it('constructs with valid ISO8601 string', () => {
    expect(() => new DateTimeIso8601(validIso)).not.toThrow()
  })

  it('throws with invalid ISO8601 string', () => {
    expect(() => new DateTimeIso8601('not-a-date')).toThrow()
  })

  it('get() returns correct components', () => {
    const dt = new DateTimeIso8601(validIso)
    const all = dt.get() as ParsedTimeComponents
    expect(all.year).toBe(2024)
    expect(all.month).toBe(6)
    expect(all.day).toBe(1)
    expect(all.hour).toBe(12)
    expect(all.minute).toBe(34)
    expect(all.second).toBe(56)
    expect(all.tzOffsetHour).toBe(2)
    expect(all.tzOffsetMinute).toBe(0)
    expect(all.date).toBe('2024-06-01')
    expect(all.time).toBe('12:34:56')
    expect(all.tzOffset).toBe('+02:00')
    expect(all.weekday).toBe('saturday')
    expect(all.weekdayIndex).toBeGreaterThanOrEqual(0)
    expect(all.weekdayIndex).toBeLessThanOrEqual(6)
  })

  it('get(key) returns correct single value', () => {
    const dt = new DateTimeIso8601(validIso)
    expect(dt.get('year')).toBe(2024)
    expect(dt.get('date')).toBe('2024-06-01')
    expect(dt.get('tzOffset')).toBe('+02:00')
    expect(['sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday']).toContain(dt.get('weekday'))
  })

  it('toString() returns the original string', () => {
    const dt = new DateTimeIso8601(validIso)
    expect(dt.toString()).toBe(validIso)
  })

  it('tz() changes the timezone offset', () => {
    const dt = new DateTimeIso8601(validIso)
    const result = dt.tz('-05:00').toString()
    expect(result!.endsWith('-05:00')).toBe(true)
  })

  it('update() with absolute values', () => {
    const dt = new DateTimeIso8601(validIso)
    dt.update({ year: 2025, month: 1, day: 2, hour: 3, minute: 4, second: 5 })
    const all = dt.get() as ParsedTimeComponents
    expect(all.year).toBe(2025)
    expect(all.month).toBe(1)
    expect(all.day).toBe(2)
    expect(all.hour).toBe(3)
    expect(all.minute).toBe(4)
    expect(all.second).toBe(5)
  })

  it('update() with relative values', () => {
    const dt = new DateTimeIso8601(validIso)
    dt.update({ year: 1, month: 1, day: 1, hour: 1, minute: 1, second: 1 }, true)
    const all = dt.get() as ParsedTimeComponents
    expect(all.year).toBe(2025)
    expect(all.month).toBe(7)
    expect(all.day).toBe(2)
    expect(all.hour).toBe(13)
    expect(all.minute).toBe(35)
    expect(all.second).toBe(57)
  })

  it('throws on unsupported tzOffset in tz()', () => {
    const dt = new DateTimeIso8601(validIso)
    // @ts-expect-error intentionally bad value for failing test
    expect(() => dt.tz('+99:99')).toThrow()
  })
})
