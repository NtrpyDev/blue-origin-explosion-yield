# Blue Origin New Glenn Explosion Yield Analysis

Twitter-ready graphics and reproducible source data for estimating the TNT equivalent of the May 28, 2026 Blue Origin New Glenn pad explosion.

## Headline Result

The strongest defensible public result is a **chemical-energy ceiling**, not a measured blast yield:

- **Full-stack stored chemical-energy ceiling:** `4.45 to 5.07 kt TNT equivalent`
- **First-stage LNG inventory range:** `3.44 to 4.19 kt TNT equivalent`
- **Provable actual blast-wave bound:** `0 to 5.07 kt TNT equivalent`

The actual blast-wave yield is not publicly determinable from available sources because it would require measured overpressure, acoustic, seismic, or telemetry data, plus blast-coupling information.

## Graphics

The `graphics/` directory contains 1600x900 PNGs suitable for Twitter/X posts:

- `graphics/00-proof-summary.png`
- `graphics/01-non-nuclear-ranking.png`
- `graphics/02-human-made-non-nuclear-ranking.png`
- `graphics/03-all-recorded-ranking.png`

The Cursor canvas version of the analysis is included at `canvas/blue-origin-explosion-analysis.canvas.tsx`.

## Proofs

### TNT Conversion

Use the conventional nuclear-effects definition:

```text
1 kt TNT = 10^12 calories = 4.184e12 joules
```

So any energy value `E` in joules becomes kilotons TNT equivalent by:

```text
Y_kt = E / 4.184e12
```

### Full-Stack Chemical-Energy Ceiling

The public full-stack New Glenn chemical-energy estimate used here is:

```text
E_min = 18.6 TJ = 18.6e12 J
E_max = 21.2 TJ = 21.2e12 J
```

Convert to TNT equivalent:

```text
Y_min = 18.6e12 / 4.184e12 = 4.445506692 kt
Y_max = 21.2e12 / 4.184e12 = 5.066921606 kt
```

Rounded:

```text
Y_full_stack = 4.45 to 5.07 kt TNT equivalent
```

### First-Stage LNG Inventory Cross-Check

Use:

```text
E = m * LHV
m = rho * V
```

Inputs:

```text
V_LNG = 710 m^3
rho_LNG = 410 to 500 kg/m^3
LHV_LNG = 49.40424 MJ/kg
```

Mass:

```text
m_min = 410 * 710 = 291100 kg
m_max = 500 * 710 = 355000 kg
```

Energy:

```text
E_min = 291100 * 49.40424e6 = 1.4381574264e13 J = 14.381574264 TJ
E_max = 355000 * 49.40424e6 = 1.75385052e13 J = 17.5385052 TJ
```

TNT equivalent:

```text
Y_min = 14.381574264e12 / 4.184e12 = 3.437278744 kt
Y_max = 17.5385052e12 / 4.184e12 = 4.191803346 kt
```

Rounded:

```text
Y_first_stage_LNG = 3.44 to 4.19 kt TNT equivalent
```

Using pure liquid methane density at its boiling point, `422.6 kg/m^3`, gives:

```text
Y_first_stage_CH4 = 3.542912188 kt TNT equivalent
```

This cross-check is consistent with the full-stack `4.45 to 5.07 kt` range because the upper stage adds hydrogen chemical energy.

### Actual Blast-Yield Bound

Let `Y_blast` be the actual blast-wave TNT equivalent, and let `Y_chemical` be available chemical energy.

By conservation of energy:

```text
0 <= Y_blast <= Y_chemical
```

The largest public chemical-energy ceiling used here is:

```text
Y_chemical <= 5.066921606 kt
```

Therefore:

```text
0 <= Y_blast <= 5.07 kt TNT equivalent
```

A tighter value cannot be proven from public reporting alone. Rocket-pad accidents are not ideal TNT detonations: propellants may fail to mix, burn over time, disperse, fragment tanks and pad hardware, and couple only part of their chemical energy into a destructive pressure wave.

## Rankings By Chemical-Energy Ceiling

These are ranking positions in the compact documented comparison sets used for the graphics:

- **Non-nuclear comparison set:** Blue Origin is `#7`
- **Human-made non-nuclear comparison set:** Blue Origin is `#1`
- **All recorded comparison set including nuclear tests:** Blue Origin is `#10`

The human-made `#1` ranking is only by stored chemical-energy ceiling. Actual blast rank is unknown.

## Reproduce The Graphics

```bash
python scripts/generate_graphics.py
```

The script reads `data/events.json` and writes PNGs to `graphics/`.

## Key Sources

- CBS News event report: <https://www.cbsnews.com/news/blue-origin-new-glenn-rocket-explodes-launchpad-florida/>
- Blue Origin New Glenn vehicle page: <https://www.blueorigin.com/new-glenn>
- AFDC fuel properties: <https://afdc.energy.gov/fuels/properties>
- NASA launch-vehicle blast environment work: <https://ntrs.nasa.gov/api/citations/20150002597/downloads/20150002597.pdf>
- TNT convention reference, Glasstone and Dolan: <https://atomicarchive.com/resources/documents/effects/glasstone-dolan/chapter1.html>
- Ranking source data and per-event links are in `data/events.json`.

## Important Caveat

This repository does **not** claim the New Glenn accident released a measured `5.07 kt` blast. It says public data supports a stored chemical-energy ceiling of `4.45 to 5.07 kt TNT equivalent`, and that the actual blast-wave yield cannot exceed that ceiling.
