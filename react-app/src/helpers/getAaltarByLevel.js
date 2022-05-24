export default function getAaltarByLevel(equippedInstallations) {
  const AALTARS = {
    1: { level: 1, label: "LE Golden Aaltar L1", hours: 24 },
    2: { level: 2, label: "LE Golden Aaltar L2", hours: 18 },
    3: { level: 3, label: "LE Golden Aaltar L3", hours: 12 },
    4: { level: 4, label: "LE Golden Aaltar L4", hours: 8 },
    5: { level: 5, label: "LE Golden Aaltar L5", hours: 6 },
    6: { level: 6, label: "LE Golden Aaltar L6", hours: 4 },
    7: { level: 7, label: "LE Golden Aaltar L7", hours: 3 },
    8: { level: 8, label: "LE Golden Aaltar L8", hours: 2 },
    9: { level: 9, label: "LE Golden Aaltar L9", hours: 1 },
    10: { level: 1, label: "Aaltar L1", hours: 24 },
    11: { level: 2, label: "Aaltar L2", hours: 18 },
    12: { level: 3, label: "Aaltar L3", hours: 12 },
    13: { level: 4, label: "Aaltar L4", hours: 8 },
    14: { level: 5, label: "Aaltar L5", hours: 6 },
    15: { level: 6, label: "Aaltar L6", hours: 4 },
    16: { level: 7, label: "Aaltar L7", hours: 3 },
    17: { level: 8, label: "Aaltar L8", hours: 2 },
    18: { level: 9, label: "Aaltar L9", hours: 1 },
  };

  const aaltarId = equippedInstallations.find(id => AALTARS[id]);

  return AALTARS[aaltarId];
}
