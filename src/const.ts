const dateRegexString = '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})'
const timeRegexString = '(?<hour>\\d{2}):(?<minute>\\d{2}):(?<second>\\d{2})'
const tzOffsetRegexString = '(?<tzOffsetHour>[+-]\\d{2}):(?<tzOffsetMinute>\\d{2})'
const parseRegexString = `^${dateRegexString}T${timeRegexString}${tzOffsetRegexString}$`
const parseRegex = new RegExp(parseRegexString)

const Iana = {
  '-12:00': 'Etc/GMT+12',
  '-11:00': 'Etc/GMT+11',
  '-10:00': 'Etc/GMT+10',
  '-09:30': 'Pacific/Marquesas',
  '-09:00': 'Etc/GMT+9',
  '-08:00': 'Etc/GMT+8',
  '-07:00': 'Etc/GMT+7',
  '-06:00': 'Etc/GMT+6',
  '-05:00': 'Etc/GMT+5',
  '-04:00': 'Etc/GMT+4',
  '-03:00': 'Etc/GMT+3',
  '-02:00': 'Etc/GMT+2',
  '-01:00': 'Etc/GMT+1',
  '+00:00': 'Etc/GMT',
  '+01:00': 'Etc/GMT-1',
  '+02:00': 'Etc/GMT-2',
  '+03:00': 'Etc/GMT-3',
  '+03:30': 'Asia/Tehran',
  '+04:00': 'Etc/GMT-4',
  '+04:30': 'Asia/Kabul',
  '+05:00': 'Etc/GMT-5',
  '+05:30': 'Asia/Kolkata',
  '+05:45': 'Asia/Kathmandu',
  '+06:00': 'Etc/GMT-6',
  '+06:30': 'Asia/Yangon',
  '+07:00': 'Etc/GMT-7',
  '+08:00': 'Etc/GMT-8',
  '+08:45': 'Australia/Eucla',
  '+09:00': 'Etc/GMT-9',
  '+09:30': 'Australia/Darwin',
  '+10:00': 'Etc/GMT-10',
  '+11:00': 'Etc/GMT-11',
  '+12:00': 'Etc/GMT-12',
  '+13:00': 'Etc/GMT-13',
  '+14:00': 'Etc/GMT-14',
}

export {
  Iana, parseRegex, tzOffsetRegexString
}

