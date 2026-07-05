/** Static sample verdicts for the landing page. No API calls needed. */

export type SampleVerdict = {
  title: string;
  claim_object: "car" | "laptop" | "package";
  transcript: string;
  verdict: "supported" | "contradicted" | "not_enough_information";
  severity: "none" | "low" | "medium" | "high" | "unknown";
  issue_type?: string;
  object_part?: string;
  risk_flags: string; // semicolon-separated
  justification: string;
  evidence_reason?: string;
  image: string; // path under /public/samples/
  duration: string; // e.g. "14.2s"
};

export const SAMPLES: SampleVerdict[] = [
  {
    title: "Fraud attempt caught",
    claim_object: "package",
    transcript:
      "My parcel arrived completely crushed. The whole box is caved in on the top and one side...",
    verdict: "not_enough_information",
    severity: "unknown",
    risk_flags: "non_original_image;possible_manipulation;wrong_object",
    justification:
      "The image shows a sculpted artwork of a crumpled box displayed on a gallery plinth, not a photograph of an actual damaged package.",
    evidence_reason:
      "Sculpted artwork of a crumpled box on a plinth, not a real damaged parcel.",
    image: "/samples/sculpture.jpg",
    duration: "14.2s",
  },
  {
    title: "Contradiction detected",
    claim_object: "laptop",
    transcript:
      "The keyboard got water spilled on it. Several keys have come off. The screen is fine.",
    verdict: "contradicted",
    severity: "none",
    risk_flags: "claim_mismatch;damage_not_visible",
    justification:
      "The image shows a shattered screen while the keyboard visible in the image is intact, directly contradicting the claimed damage.",
    image: "/samples/laptop.jpg",
    duration: "14.2s",
  },
  {
    title: "Multi-image claim handled",
    claim_object: "package",
    transcript:
      "My parcel arrived ripped open at one end. I've also attached a photo of another parcel that arrived fine, for comparison.",
    verdict: "supported",
    severity: "high",
    issue_type: "torn_packaging",
    object_part: "box",
    risk_flags: "damage_not_visible",
    justification:
      "img_2 shows one end of the box torn open with contents exposed, supporting the claim; the comparison photo's flag is preserved for reviewers without affecting the verdict.",
    image: "/samples/parcel.jpg",
    duration: "14.2s",
  },
];
