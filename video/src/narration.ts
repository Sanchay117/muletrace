export type SceneId = "act1" | "act2" | "act3" | "act4" | "act5";

export interface NarrationLine {
  text: string;
  say?: string;
}

export interface SceneScript {
  id: SceneId;
  lead: number;
  tail: number;
  lines: NarrationLine[];
}

export const NARRATION_VOICE = "aura-2-asteria-en";

export const NARRATION: SceneScript[] = [
  {
    id: "act1",
    lead: 0.4,
    tail: 0.9,
    lines: [
      {
        text: "When scammers steal $120,000 over instant bank rails, they split it across six mule hops and crypto bridges in under four minutes.",
        say: "When scammers steal one hundred twenty thousand dollars over instant bank rails, they split it across six mule hops and crypto bridges in under four minutes.",
      },
      {
        text: "One-hop fraud rules go blind at hop two, while naive single-prompt agents choke on raw logs and freeze 42 innocent nurses' paychecks.",
        say: "One-hop fraud rules go blind at hop two, while naive single-prompt agents choke on raw logs and freeze forty two innocent nurses paychecks.",
      },
      {
        text: "MuleTrace is a speculative branch-and-backtrack reasoning architecture that catches split scam money before finality with zero false freezes.",
      },
    ],
  },
  {
    id: "act2",
    lead: 0.45,
    tail: 0.9,
    lines: [
      {
        text: "Through Zetaris federated SQL, parallel Nemotron 30B scouts trace all three outgoing branches across wire, device, and KYC schemas.",
        say: "Through Zetaris federated S Q L, parallel Nemotron thirty B scouts trace all three outgoing branches across wire, device, and K Y C schemas.",
      },
      {
        text: "At hop two, our Nemotron 120B pruning critic spots Bayview Clinic's verified 42-nurse payroll pool, prunes that branch, and backtracks.",
        say: "At hop two, our Nemotron one twenty B pruning critic spots Bayview Clinic's verified forty two nurse payroll pool, prunes that branch, and backtracks.",
      },
      {
        text: "Reallocated scouts chase Branches A and C to hop six, catching $101,500 re-converging at a Kraken bridge with 94 seconds to spare.",
        say: "Reallocated scouts chase Branches A and C to hop six, catching one hundred one thousand five hundred dollars re-converging at a Kraken bridge with ninety four seconds to spare.",
      },
    ],
  },
  {
    id: "act3",
    lead: 0.45,
    tail: 0.9,
    lines: [
      {
        text: "Why do linear agents fail deep chases? Dumping raw ledger tables across six hops explodes context past 12,500 tokens and misses the deadline.",
        say: "Why do linear agents fail deep chases? Dumping raw ledger tables across six hops explodes context past twelve thousand five hundred tokens and misses the deadline.",
      },
      {
        text: "MuleTrace runs all four Meterless Engines: Scout Intent scores urgency, and an optimistic-locked World Model tracks tainted dollar conservation.",
      },
      {
        text: "Meanwhile, Markovian compresses every hop into a compact capsule under 210 tokens, slashing total prompt tokens by 92.7%.",
        say: "Meanwhile, Markovian compresses every hop into a compact capsule under two hundred ten tokens, slashing total prompt tokens by ninety two point seven percent.",
      },
    ],
  },
  {
    id: "act4",
    lead: 0.45,
    tail: 0.9,
    lines: [
      {
        text: "After solving Ring-77 once, MuleTrace commits its headless Nox emulator and 19-second split cadence into H-MEM.",
        say: "After solving Ring seventy seven once, MuleTrace commits its headless Nox emulator and nineteen second split cadence into H MEM.",
      },
      {
        text: "When the same ring strikes a second retiree, H-MEM skips four intermediate hops and locks $79,900 in just two hops and 48 seconds.",
        say: "When the same ring strikes a second retiree, H MEM skips four intermediate hops and locks seventy nine thousand nine hundred dollars in just two hops and forty eight seconds.",
      },
      {
        text: "And when stolen funds enter a licensed $1.4M title-escrow pool at 64% confidence, MuleTrace abstains from a full freeze and places a surgical $64,000 sub-ledger hold.",
        say: "And when stolen funds enter a licensed one point four million dollar title escrow pool at sixty four percent confidence, MuleTrace abstains from a full freeze and places a surgical sixty four thousand dollar sub-ledger hold.",
      },
    ],
  },
  {
    id: "act5",
    lead: 0.45,
    tail: 1.1,
    lines: [
      {
        text: "Meterless Nightshift powers the entire loop locally, pairing Nemotron 30B for fast hop scouting with Nemotron 120B for pruning and FinCEN freeze orders.",
        say: "Meterless Nightshift powers the entire loop locally, pairing Nemotron thirty B for fast hop scouting with Nemotron one twenty B for pruning and FinCEN freeze orders.",
      },
      {
        text: "Across five laundering benchmarks and ten conformance tests, MuleTrace recovers $617,800 before finality with zero innocent accounts frozen.",
        say: "Across five laundering benchmarks and ten conformance tests, MuleTrace recovers six hundred seventeen thousand eight hundred dollars before finality with zero innocent accounts frozen.",
      },
    ],
  },
];
