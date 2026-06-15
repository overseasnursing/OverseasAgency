export type CountryLink = { name: string; href: string }

export function normalizeCountry(country: string): string {
  const c = country.toLowerCase().trim()
  if (c.includes('saudi') || c === 'ksa') return 'saudi-arabia'
  if (c.includes('uae') || c.includes('dubai') || c.includes('emirates') || c.includes('abu dhabi')) return 'uae'
  if (c === 'uk' || c.includes('united kingdom') || c.includes('britain') || c.includes('england')) return 'uk'
  if (c.includes('australia') || c === 'aus') return 'australia'
  if (c.includes('germany') || c === 'de') return 'germany'
  if (c.includes('canada') || c === 'ca') return 'canada'
  if (c.includes('ireland')) return 'ireland'
  if (c.includes('new zealand') || c === 'nz') return 'new-zealand'
  if (c === 'usa' || c.includes('united states') || c.includes('america')) return 'usa'
  if (c.includes('singapore') || c === 'sg') return 'singapore'
  if (c.includes('bahrain')) return 'bahrain'
  if (c.includes('qatar')) return 'qatar'
  if (c.includes('kuwait')) return 'kuwait'
  if (c.includes('oman')) return 'oman'
  return c.replace(/\s+/g, '-')
}

export const EXAM_MAP: Record<string, CountryLink[]> = {
  'saudi-arabia': [
    { name: 'SNLE — Saudi Nurses Licensing Exam', href: '/guides/snle-exam' },
    { name: 'SCFHS Registration', href: '/guides/scfhs-registration' },
    { name: 'Saudi Prometric', href: '/guides/saudi-prometric' },
  ],
  'uae': [
    { name: 'DHA Exam (Dubai)', href: '/guides/dha-exam' },
    { name: 'DOH Registration (Abu Dhabi)', href: '/guides/doh-abu-dhabi' },
    { name: 'MOH UAE Licensing', href: '/guides/moh-uae' },
  ],
  'uk': [
    { name: 'NMC CBT', href: '/guides/nmc-cbt' },
    { name: 'OSCE', href: '/guides/osce' },
    { name: 'OET vs IELTS', href: '/guides/oet-vs-ielts' },
  ],
  'australia': [
    { name: 'AHPRA Registration', href: '/guides/ahpra-registration' },
    { name: 'OET vs IELTS', href: '/guides/oet-vs-ielts' },
    { name: 'ANMAC Skills Assessment', href: '/guides/anmac-assessment' },
  ],
  'germany': [
    { name: 'Goethe B2 / TestDaF', href: '/guides/germany-language-exam' },
    { name: 'Approbation (Recognition)', href: '/guides/germany-approbation' },
    { name: 'Kenntnisprüfung', href: '/guides/germany-kenntnisprufung' },
  ],
  'canada': [
    { name: 'NCLEX-RN', href: '/guides/nclex-process' },
    { name: 'NNAS Assessment', href: '/guides/nnas-canada' },
    { name: 'IELTS / CELPIP', href: '/guides/ielts-nursing' },
  ],
  'ireland': [
    { name: 'NMBI Registration', href: '/guides/nmbi-ireland' },
    { name: 'OET vs IELTS', href: '/guides/oet-vs-ielts' },
  ],
  'new-zealand': [
    { name: 'NCNZ Registration', href: '/guides/ncnz-new-zealand' },
    { name: 'OET vs IELTS', href: '/guides/oet-vs-ielts' },
  ],
  'usa': [
    { name: 'NCLEX-RN', href: '/guides/nclex-process' },
    { name: 'CGFNS Certification', href: '/guides/cgfns' },
    { name: 'VisaScreen', href: '/guides/visascreen' },
  ],
  'singapore': [
    { name: 'SNB Registration', href: '/guides/snb-singapore' },
    { name: 'OET vs IELTS', href: '/guides/oet-vs-ielts' },
  ],
  'bahrain': [
    { name: 'NHRA Registration', href: '/guides' },
    { name: 'Prometric Exam', href: '/guides' },
  ],
  'qatar': [
    { name: 'QCHP Registration', href: '/guides' },
    { name: 'Prometric Exam', href: '/guides' },
  ],
  'kuwait': [
    { name: 'MOH Kuwait Registration', href: '/guides' },
    { name: 'Prometric Exam', href: '/guides' },
  ],
  'oman': [
    { name: 'OMSB Registration', href: '/guides' },
    { name: 'Prometric Exam', href: '/guides' },
  ],
}

export const MOCK_TEST_MAP: Record<string, CountryLink[]> = {
  'saudi-arabia': [
    { name: 'SNLE Mock Test', href: '/guides/snle-mock-test' },
    { name: 'SCFHS Mock Test', href: '/guides/scfhs-mock-test' },
    { name: 'Saudi Prometric Mock Test', href: '/guides/saudi-prometric-mock' },
  ],
  'uae': [
    { name: 'DHA Mock Test', href: '/guides/dha-mock-test' },
    { name: 'DOH Mock Test', href: '/guides/doh-mock-test' },
    { name: 'MOH Mock Test', href: '/guides/moh-uae-mock-test' },
  ],
  'uk': [
    { name: 'NMC CBT Mock Test', href: '/guides/nmc-cbt-mock-test' },
    { name: 'OSCE Mock Test', href: '/guides/osce-mock-test' },
    { name: 'OET Mock Test', href: '/guides/oet-mock-test' },
  ],
  'australia': [
    { name: 'AHPRA Mock Test', href: '/guides/ahpra-mock-test' },
    { name: 'OET Mock Test', href: '/guides/oet-mock-test' },
    { name: 'IELTS Mock Test', href: '/guides/ielts-mock-test' },
  ],
  'germany': [
    { name: 'Goethe B2 Mock Test', href: '/guides/goethe-b2-mock-test' },
    { name: 'TestDaF Mock Test', href: '/guides/testdaf-mock-test' },
  ],
  'canada': [
    { name: 'NCLEX Mock Test', href: '/guides/nclex-mock-test' },
    { name: 'NNAS Mock Assessment', href: '/guides' },
  ],
  'ireland': [
    { name: 'NMBI Mock Test', href: '/guides' },
    { name: 'OET Mock Test', href: '/guides/oet-mock-test' },
  ],
  'new-zealand': [
    { name: 'NCNZ Mock Test', href: '/guides' },
    { name: 'OET Mock Test', href: '/guides/oet-mock-test' },
  ],
  'usa': [
    { name: 'NCLEX Mock Test', href: '/guides/nclex-mock-test' },
    { name: 'CGFNS Mock Test', href: '/guides' },
  ],
  'singapore': [
    { name: 'SNB Mock Test', href: '/guides' },
    { name: 'OET Mock Test', href: '/guides/oet-mock-test' },
  ],
  'bahrain': [
    { name: 'NHRA Mock Test', href: '/guides' },
    { name: 'Prometric Mock Test', href: '/guides' },
  ],
  'qatar': [
    { name: 'QCHP Mock Test', href: '/guides' },
    { name: 'Prometric Mock Test', href: '/guides' },
  ],
  'kuwait': [
    { name: 'MOH Kuwait Mock Test', href: '/guides' },
    { name: 'Prometric Mock Test', href: '/guides' },
  ],
  'oman': [
    { name: 'OMSB Mock Test', href: '/guides' },
    { name: 'Prometric Mock Test', href: '/guides' },
  ],
}

export const GUIDE_MAP: Record<string, CountryLink[]> = {
  'saudi-arabia': [
    { name: 'Saudi Nursing Registration Guide', href: '/country/saudi-arabia' },
    { name: 'Saudi Nurse Salary Guide', href: '/guides/saudi-nurse-salary' },
    { name: 'Saudi Arabia Nursing Visa Guide', href: '/guides/saudi-visa-guide' },
  ],
  'uae': [
    { name: 'UAE Nursing Registration Guide', href: '/country/dubai' },
    { name: 'UAE Nurse Salary Guide', href: '/guides/uae-nurse-salary' },
    { name: 'UAE Nursing Visa Guide', href: '/guides/uae-visa-guide' },
  ],
  'uk': [
    { name: 'UK Nursing Registration (NMC) Guide', href: '/country/uk' },
    { name: 'UK Nurse Salary Guide', href: '/guides/uk-nurse-salary' },
    { name: 'UK Health and Care Worker Visa Guide', href: '/guides/uk-tier-2-visa' },
  ],
  'australia': [
    { name: 'Australia AHPRA Registration Guide', href: '/country/australia' },
    { name: 'Australia Nurse Salary Guide', href: '/guides/australia-nurse-salary' },
    { name: 'Australia Skilled Visa Guide', href: '/guides/australia-visa' },
  ],
  'germany': [
    { name: 'Germany Nursing Registration Guide', href: '/country/germany' },
    { name: 'Germany Nurse Salary Guide', href: '/guides/germany-nurse-salary' },
    { name: 'Germany Nursing Visa Guide', href: '/guides/germany-visa-guide' },
  ],
  'canada': [
    { name: 'Canada Nursing Registration Guide', href: '/country/canada' },
    { name: 'Canada Nurse Salary Guide', href: '/guides/canada-nurse-salary' },
    { name: 'Canada Immigration Guide for Nurses', href: '/guides/canada-immigration' },
  ],
  'ireland': [
    { name: 'Ireland NMBI Registration Guide', href: '/country/ireland' },
    { name: 'Ireland Nurse Salary Guide', href: '/guides/ireland-nurse-salary' },
    { name: 'Ireland Critical Skills Visa Guide', href: '/guides/ireland-visa' },
  ],
  'new-zealand': [
    { name: 'New Zealand NCNZ Registration Guide', href: '/country/new-zealand' },
    { name: 'New Zealand Nurse Salary Guide', href: '/guides/new-zealand-nurse-salary' },
    { name: 'New Zealand Skilled Migrant Visa Guide', href: '/guides/new-zealand-visa' },
  ],
  'usa': [
    { name: 'USA NCLEX Registration Guide', href: '/guides/nclex-process' },
    { name: 'USA Nurse Salary Guide', href: '/guides/usa-nurse-salary' },
    { name: 'USA H-1B / EB-3 Visa Guide for Nurses', href: '/guides/usa-visa-guide' },
  ],
  'singapore': [
    { name: 'Singapore SNB Registration Guide', href: '/country/singapore' },
    { name: 'Singapore Nurse Salary Guide', href: '/guides/singapore-nurse-salary' },
    { name: 'Singapore Employment Pass Guide', href: '/guides/singapore-visa' },
  ],
  'bahrain': [
    { name: 'Bahrain NHRA Registration Guide', href: '/guides' },
    { name: 'Bahrain Nurse Salary Guide', href: '/guides' },
    { name: 'Bahrain Work Visa Guide', href: '/guides' },
  ],
  'qatar': [
    { name: 'Qatar QCHP Registration Guide', href: '/guides' },
    { name: 'Qatar Nurse Salary Guide', href: '/guides' },
    { name: 'Qatar Work Visa Guide', href: '/guides' },
  ],
  'kuwait': [
    { name: 'Kuwait MOH Registration Guide', href: '/guides' },
    { name: 'Kuwait Nurse Salary Guide', href: '/guides' },
    { name: 'Kuwait Work Visa Guide', href: '/guides' },
  ],
  'oman': [
    { name: 'Oman OMSB Registration Guide', href: '/guides' },
    { name: 'Oman Nurse Salary Guide', href: '/guides' },
    { name: 'Oman Work Visa Guide', href: '/guides' },
  ],
}
