export const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won']

export const seedCompanies = [
  { id: 'co-1', name: 'Northwind Health', industry: 'Healthcare', city: 'Boston', employees: 420, owner: 'Ava Patel' },
  { id: 'co-2', name: 'Helios Logistics', industry: 'Transport', city: 'Chicago', employees: 180, owner: 'Noah Kim' },
  { id: 'co-3', name: 'Lumen Studios', industry: 'Media', city: 'Austin', employees: 64, owner: 'Mia Chen' },
  { id: 'co-4', name: 'Harbor Bank', industry: 'Finance', city: 'New York', employees: 910, owner: 'Ava Patel' },
  { id: 'co-5', name: 'Vivid Labs', industry: 'SaaS', city: 'Seattle', employees: 112, owner: 'Noah Kim' },
  { id: 'co-6', name: 'Atlas Retail', industry: 'Retail', city: 'Denver', employees: 250, owner: 'Mia Chen' },
]

export const seedContacts = [
  { id: 'ct-1', name: 'Elena Brooks', title: 'VP Operations', email: 'elena@northwind.health', phone: '+1 617 555 0142', companyId: 'co-1', status: 'Customer', lastTouch: 'Today' },
  { id: 'ct-2', name: 'Marcus Hale', title: 'Head of Supply', email: 'marcus@helios.log', phone: '+1 312 555 0198', companyId: 'co-2', status: 'Lead', lastTouch: 'Yesterday' },
  { id: 'ct-3', name: 'Priya Shah', title: 'Creative Director', email: 'priya@lumen.studio', phone: '+1 512 555 0110', companyId: 'co-3', status: 'Customer', lastTouch: '2 days ago' },
  { id: 'ct-4', name: 'Jonah Ellis', title: 'Procurement Lead', email: 'jellis@harbor.bank', phone: '+1 212 555 0177', companyId: 'co-4', status: 'Qualified', lastTouch: '3 days ago' },
  { id: 'ct-5', name: 'Sofia Nguyen', title: 'Founder', email: 'sofia@vivid.labs', phone: '+1 206 555 0133', companyId: 'co-5', status: 'Customer', lastTouch: 'Today' },
  { id: 'ct-6', name: 'Daniel Cho', title: 'Store Ops Manager', email: 'dcho@atlas.retail', phone: '+1 303 555 0164', companyId: 'co-6', status: 'Lead', lastTouch: '1 week ago' },
  { id: 'ct-7', name: 'Amelia Hart', title: 'CFO', email: 'ahart@northwind.health', phone: '+1 617 555 0188', companyId: 'co-1', status: 'Qualified', lastTouch: '4 days ago' },
  { id: 'ct-8', name: 'Luis Ortega', title: 'IT Director', email: 'luis@helios.log', phone: '+1 312 555 0121', companyId: 'co-2', status: 'Customer', lastTouch: 'Yesterday' },
]

export const seedDeals = [
  { id: 'dl-1', name: 'Northwind EHR rollout', companyId: 'co-1', value: 64000, stage: 'Proposal', closeDate: 'Sep 12', owner: 'Ava Patel' },
  { id: 'dl-2', name: 'Helios fleet tracking', companyId: 'co-2', value: 28500, stage: 'Qualified', closeDate: 'Sep 28', owner: 'Noah Kim' },
  { id: 'dl-3', name: 'Lumen production suite', companyId: 'co-3', value: 18200, stage: 'Negotiation', closeDate: 'Aug 30', owner: 'Mia Chen' },
  { id: 'dl-4', name: 'Harbor compliance pack', companyId: 'co-4', value: 91000, stage: 'Lead', closeDate: 'Oct 04', owner: 'Ava Patel' },
  { id: 'dl-5', name: 'Vivid onboarding seats', companyId: 'co-5', value: 12400, stage: 'Won', closeDate: 'Aug 08', owner: 'Noah Kim' },
  { id: 'dl-6', name: 'Atlas POS upgrade', companyId: 'co-6', value: 34600, stage: 'Proposal', closeDate: 'Sep 19', owner: 'Mia Chen' },
  { id: 'dl-7', name: 'Northwind support retain', companyId: 'co-1', value: 22000, stage: 'Qualified', closeDate: 'Oct 10', owner: 'Ava Patel' },
  { id: 'dl-8', name: 'Helios warehouse IoT', companyId: 'co-2', value: 45800, stage: 'Lead', closeDate: 'Oct 22', owner: 'Noah Kim' },
]

export const seedTasks = [
  { id: 'tk-1', title: 'Send Northwind proposal recap', due: 'Today', type: 'Email', related: 'Northwind Health', done: false },
  { id: 'tk-2', title: 'Discovery call with Helios', due: 'Today', type: 'Call', related: 'Helios Logistics', done: false },
  { id: 'tk-3', title: 'Contract review — Lumen', due: 'Tomorrow', type: 'Task', related: 'Lumen Studios', done: false },
  { id: 'tk-4', title: 'Intro demo for Harbor Bank', due: 'Aug 25', type: 'Meeting', related: 'Harbor Bank', done: false },
  { id: 'tk-5', title: 'Renewal check-in — Vivid', due: 'Aug 26', type: 'Call', related: 'Vivid Labs', done: true },
  { id: 'tk-6', title: 'Onsite walkthrough Atlas', due: 'Aug 28', type: 'Meeting', related: 'Atlas Retail', done: false },
  { id: 'tk-7', title: 'Follow up Amelia Hart', due: 'Tomorrow', type: 'Email', related: 'Northwind Health', done: false },
]

export const seedActivity = [
  { id: 'ac-1', text: 'Proposal sent to Northwind Health', time: '2h ago', tone: 'teal' },
  { id: 'ac-2', text: 'Sofia Nguyen moved to Customer', time: '4h ago', tone: 'ink' },
  { id: 'ac-3', text: 'Helios discovery call booked', time: 'Yesterday', tone: 'amber' },
  { id: 'ac-4', text: 'Vivid Labs deal marked Won', time: '2 days ago', tone: 'teal' },
  { id: 'ac-5', text: 'New lead added: Daniel Cho', time: '3 days ago', tone: 'ink' },
]

export function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
