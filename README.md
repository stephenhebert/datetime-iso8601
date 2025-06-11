# datetime-iso8601

A lightweight TypeScript library for parsing, manipulating, and formatting ISO8601 date-time strings with time zone support.

## Features

- Parse ISO8601 date-time strings
- Manipulate date and time components
- Convert between time zones (IANA and UTC offset)
- Format date-time as ISO8601 strings
- Extract individual date/time components (e.g., weekday)

## Installation

```sh
npm install @stephenhebert/datetime-iso8601
```

## Usage

```typescript
import { DateTimeIso8601 } from '@stephenhebert/datetime-iso8601'

const dt = new DateTimeIso8601('2024-06-01T12:34:56+00:00')

// Get all components
console.log(dt.get())

// Get a specific component
console.log(dt.get('year')) // 2024

// Convert to a different time zone
dt.tz('-05:00')
console.log(dt.toString()) // e.g. "2024-06-01T07:34:56-05:00"

// Update components
dt.update({ hour: 15, minute: 0 })
console.log(dt.toString()) // "2024-06-01T15:00:56-05:00"
```

## API

### `class DateTimeIso8601`

#### `constructor(isoString: string)`

Creates a new instance from an ISO8601 string.

#### `get(key?: string)`

Returns all parsed components or a specific component.

- `year`, `month`, `day`, `hour`, `minute`, `second`, `tzOffsetHour`, `tzOffsetMinute`, `date`, `time`, `tzOffset`, `weekday`, `weekdayIndex`

#### `tz(tzOffset: string): this`

Converts the date-time to the specified time zone offset (e.g., `'+00:00'`, `'-05:00'`).

#### `update(newComponents: Partial<DateTimeComponents>, relative = false): this`

Updates date-time components. If `relative` is `true`, adds values to current components.

#### `toString(): string`

Returns the ISO8601 string representation.

## License

MIT
