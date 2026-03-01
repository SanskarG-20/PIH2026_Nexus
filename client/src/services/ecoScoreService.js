/**
 * Eco Travel Score — CO2 emission estimation per transport mode.
 *
 * Emission factors (grams CO2 per passenger-km) — Indian averages:
 *   Walk    →   0  g/km  (zero emission)
 *   Metro   →  15  g/km  (electric, high occupancy)
 *   Train   →  20  g/km  (suburban rail, shared)
 *   Bus     →  30  g/km  (BEST / city bus, diesel, high occupancy)
 *   Transit →  30  g/km  (generic public transport)
 *   Cab     → 120  g/km  (petrol/diesel, single occupancy baseline)
 *   Auto    →  80  g/km  (CNG auto-rickshaw, 2-3 passengers)
 *
 * Eco Score: 0-100 scale (100 = zero emission, 0 = worst).
 * Savings: percentage of CO2 saved vs cab baseline.
 */

const CO2_GRAMS_PER_KM = {
    walk:    0,
    metro:   15,
    train:   20,
    bus:     30,
    transit: 30,
    cab:     120,
    auto:    80,
};

const CAB_BASELINE = CO2_GRAMS_PER_KM.cab; // 120 g/km

/**
 * Calculate eco metrics for a single mode.
 * @param {string} mode - Transport mode key
 * @param {number} distanceKm - Route distance in km
 * @returns {{ co2Grams, ecoScore, savingsPercent, ecoLabel }}
 */
export function calculateEcoScore(mode, distanceKm) {
    const factor = CO2_GRAMS_PER_KM[mode] ?? CO2_GRAMS_PER_KM.cab;
    const co2Grams = Math.round(factor * distanceKm);
    const cabCo2 = Math.round(CAB_BASELINE * distanceKm);

    // Eco score: inverse ratio vs cab (100 = zero, 0 = same as cab)
    const ecoScore = cabCo2 > 0
        ? Math.round(((cabCo2 - co2Grams) / cabCo2) * 100)
        : 0;

    // Savings vs cab
    const savingsPercent = cabCo2 > 0
        ? Math.round(((cabCo2 - co2Grams) / cabCo2) * 100)
        : 0;

    // Human label
    let ecoLabel;
    if (ecoScore >= 90) ecoLabel = "Excellent";
    else if (ecoScore >= 70) ecoLabel = "Great";
    else if (ecoScore >= 40) ecoLabel = "Good";
    else if (ecoScore > 0)  ecoLabel = "Fair";
    else                     ecoLabel = "Baseline";

    return {
        co2Grams,
        ecoScore: Math.max(0, Math.min(100, ecoScore)),
        savingsPercent: Math.max(0, savingsPercent),
        ecoLabel,
    };
}

/**
 * Attach eco data to all transport modes in-place.
 * @param {Array} modes - Array of mode objects from routeService
 * @param {number} distanceKm - Route distance in km
 */
export function attachEcoScores(modes, distanceKm) {
    modes.forEach(function (m) {
        const eco = calculateEcoScore(m.mode, distanceKm);
        m.co2Grams = eco.co2Grams;
        m.ecoScore = eco.ecoScore;
        m.ecoSavingsPercent = eco.savingsPercent;
        m.ecoLabel = eco.ecoLabel;
    });
}
