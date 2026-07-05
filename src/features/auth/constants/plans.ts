export interface PlanTier {
  key: string
  name: string
  apiTier: string
  monthlyPrice: number
  maxTeamMembers: number
  features: string[]
  cta: string
  highlight?: boolean
  dark?: boolean
}

export const PLANS: PlanTier[] = [
  {
    key: 'solo',
    name: 'SOLO TRADIE',
    apiTier: 'SoloTradie',
    monthlyPrice: 15,
    maxTeamMembers: 1,
    features: ['1 User Account', 'Unlimited Jobs', 'Basic Reporting', 'Automated Payment Reminders'],
    cta: 'Upgrade to Solo',
  },
  {
    key: 'crew',
    name: 'THE GROWING CREW',
    apiTier: 'GrowingCrew',
    monthlyPrice: 29,
    maxTeamMembers: 5,
    features: ['Up to 5 Users', 'Unlimited invoices', 'Contractor invoicing', 'Project management'],
    cta: 'Upgrade to Crew',
    highlight: true,
  },
  {
    key: 'commercial',
    name: 'THE COMMERCIAL OUTFIT',
    apiTier: 'CommercialOutfit',
    monthlyPrice: 89,
    maxTeamMembers: 20,
    features: ['Up to 20 Users', 'Custom Reporting', 'White-label Client Portal', 'Dedicated Account Manager'],
    cta: 'Go Professional',
    dark: true,
  },
]

export function annualEquivalent(monthlyPrice: number) {
  return Math.round(monthlyPrice * 0.8)
}
