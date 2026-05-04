export type ProposalStatus = "active" | "passed" | "rejected" | "flagged";

export type Comment = {
  id: string;
  proposalId: string;
  author: string;
  text: string;
  type: "text" | "voice";
  createdAt: number;
  durationSec?: number;
};

export type Proposal = {
  id: string;
  title: string;
  summary: string;
  description: string;
  impact: string;
  approve: number;
  reject: number;
  quorum: number;
  endsAt: number;
  status: ProposalStatus;
  flagged?: boolean;
  flagReason?: string;
  region: string;
};

export type Allocation = {
  id: string;
  project: string;
  region: string;
  amount: number;
  status: "Funded" | "In Progress" | "Completed";
  date: string;
  category: string;
};

const now = Date.now();
const days = (n: number) => now + n * 86400000;
const daysAgo = (n: number) => now - n * 86400000;

export const proposals: Proposal[] = [
  {
    id: "p1",
    title: "Restore the Lower Birch Creek Watershed",
    summary: "Allocate $50,000 to native re-planting and stream bank repair across 4 km of creek.",
    description:
      "A coalition of local landholders and the Birch Creek Stewardship Group propose a two-season restoration program. Funds cover native sedges, willow removal, three community planting days, and water-quality monitoring.",
    impact:
      "Projected 32% reduction in sediment runoff and habitat for at least 4 endangered species, based on the 2025 measurement report.",
    approve: 312,
    reject: 48,
    quorum: 500,
    endsAt: days(2),
    status: "active",
    region: "North Valley",
  },
  {
    id: "p2",
    title: "Community Solar Microgrid — Phase II",
    summary: "Expand the rooftop solar cooperative to 40 additional households.",
    description:
      "Phase II adds 220 kW of distributed solar plus battery storage, governed by the existing energy cooperative bylaws.",
    impact: "Estimated 180 tonnes CO₂ avoided per year and ~$72k in energy savings returned to members.",
    approve: 478,
    reject: 122,
    quorum: 500,
    endsAt: days(5),
    status: "active",
    region: "East Mesa",
  },
  {
    id: "p3",
    title: "Mobile Health Clinic for Outer Hamlets",
    summary: "Fund a part-time clinician and converted van serving five remote hamlets monthly.",
    description:
      "Partnership with the Regional Health Trust to operate a mobile clinic. Includes vaccinations, prenatal care, and chronic disease check-ups.",
    impact: "Reaches an estimated 1,400 residents currently >60 minutes from the nearest clinic.",
    approve: 201,
    reject: 219,
    quorum: 500,
    endsAt: days(1),
    status: "flagged",
    flagged: true,
    flagReason: "Conflict of interest: 3 council members declared affiliation with Regional Health Trust.",
    region: "South Ridge",
  },
  {
    id: "p4",
    title: "Annual Seed Library & Tool Share",
    summary: "Renew operating budget for the seed and tool lending library.",
    description: "Covers librarian stipend, seed sourcing, and a new repair workshop.",
    impact: "Served 612 households last year; expected 800+ in the coming cycle.",
    approve: 540,
    reject: 30,
    quorum: 500,
    endsAt: days(7),
    status: "active",
    region: "North Valley",
  },
];

export const initialComments: Comment[] = [
  {
    id: "c1",
    proposalId: "p1",
    author: "Maren O.",
    text: "I farm just upstream — happy to host a planting day on the south paddock.",
    type: "text",
    createdAt: daysAgo(1),
  },
  {
    id: "c2",
    proposalId: "p1",
    author: "Jules R.",
    text: "Voice note: concerns about willow disposal logistics.",
    type: "voice",
    createdAt: daysAgo(0.4),
    durationSec: 38,
  },
  {
    id: "c3",
    proposalId: "p2",
    author: "Devi K.",
    text: "Can we see the projected payback period for new households?",
    type: "text",
    createdAt: daysAgo(2),
  },
];

export const allocations: Allocation[] = [
  { id: "a1", project: "Birch Creek Watershed Restoration", region: "North Valley", amount: 50000, status: "Funded", date: "2026-04-12", category: "Ecology" },
  { id: "a2", project: "Solar Microgrid Phase I", region: "East Mesa", amount: 128000, status: "Completed", date: "2025-11-02", category: "Energy" },
  { id: "a3", project: "Mobile Health Clinic", region: "South Ridge", amount: 92000, status: "In Progress", date: "2026-02-20", category: "Health" },
  { id: "a4", project: "Seed & Tool Library", region: "North Valley", amount: 18000, status: "Funded", date: "2026-04-30", category: "Community" },
  { id: "a5", project: "Greywater Pilot — 12 homes", region: "East Mesa", amount: 36000, status: "In Progress", date: "2026-01-15", category: "Water" },
  { id: "a6", project: "Youth Council Stipends", region: "South Ridge", amount: 22000, status: "Funded", date: "2026-03-08", category: "Community" },
  { id: "a7", project: "Pollinator Corridor Survey", region: "West Flats", amount: 14500, status: "Completed", date: "2025-09-21", category: "Ecology" },
  { id: "a8", project: "Repair Café Toolset", region: "West Flats", amount: 8200, status: "Funded", date: "2026-04-01", category: "Community" },
];

export const regions = ["North Valley", "East Mesa", "South Ridge", "West Flats"];
export const categories = ["Ecology", "Energy", "Health", "Community", "Water"];

export function timeRemaining(endsAt: number): string {
  const diff = endsAt - Date.now();
  if (diff <= 0) return "Closed";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}
