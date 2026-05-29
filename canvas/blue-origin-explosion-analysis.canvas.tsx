import {
  Card,
  CardBody,
  CardHeader,
  Code,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Link,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from "cursor/canvas";

type EventDatum = {
  name: string;
  ktMin: number;
  ktMax: number;
  category: "natural" | "human non-nuclear" | "nuclear";
  basis: string;
  source: string;
  href: string;
  blue?: boolean;
};

const TNT_J_PER_KT = 4.184e12;
const LNG_LHV_MJ_PER_KG = 49.40424;
const LNG_TANK_M3 = 710;
const LIQUID_METHANE_DENSITY_KG_M3 = 422.6;
const LNG_DENSITY_LOW_KG_M3 = 410;
const LNG_DENSITY_HIGH_KG_M3 = 500;
const NEW_GLENN_FULL_STACK_TJ_MIN = 18.6;
const NEW_GLENN_FULL_STACK_TJ_MAX = 21.2;

const firstStagePureMethaneKt =
  (LNG_TANK_M3 * LIQUID_METHANE_DENSITY_KG_M3 * LNG_LHV_MJ_PER_KG * 1e6) /
  TNT_J_PER_KT;
const firstStageLngLowKt =
  (LNG_TANK_M3 * LNG_DENSITY_LOW_KG_M3 * LNG_LHV_MJ_PER_KG * 1e6) /
  TNT_J_PER_KT;
const firstStageLngHighKt =
  (LNG_TANK_M3 * LNG_DENSITY_HIGH_KG_M3 * LNG_LHV_MJ_PER_KG * 1e6) /
  TNT_J_PER_KT;
const blueOriginKtMin = (NEW_GLENN_FULL_STACK_TJ_MIN * 1e12) / TNT_J_PER_KT;
const blueOriginKtMax = (NEW_GLENN_FULL_STACK_TJ_MAX * 1e12) / TNT_J_PER_KT;

const blueOriginEvent: EventDatum = {
  name: "Blue Origin New Glenn pad explosion",
  ktMin: blueOriginKtMin,
  ktMax: blueOriginKtMax,
  category: "human non-nuclear",
  basis: "Public full-stack chemical-energy ceiling; actual blast yield is not public",
  source: "CBS, Blue Origin, New Space Economy, AFDC, NASA",
  href: "https://www.cbsnews.com/news/blue-origin-new-glenn-rocket-explodes-launchpad-florida/",
  blue: true,
};

const nonNuclearEvents: EventDatum[] = [
  {
    name: "Chicxulub impact",
    ktMin: 72_000_000_000,
    ktMax: 72_000_000_000,
    category: "natural",
    basis: "Estimated kinetic energy: 72 teratons TNT",
    source: "Chicxulub crater summary",
    href: "https://en.wikipedia.org/wiki/Chicxulub_Crater",
  },
  {
    name: "Mount Tambora 1815 eruption",
    ktMin: 33_000_000,
    ktMax: 33_000_000,
    category: "natural",
    basis: "Commonly cited total eruption energy: 33 gigatons TNT",
    source: "Tambora eruption summary",
    href: "https://en.wikipedia.org/wiki/1815_eruption_of_Mount_Tambora",
  },
  {
    name: "Krakatoa 1883 eruption",
    ktMin: 200_000,
    ktMax: 200_000,
    category: "natural",
    basis: "Estimated eruption energy: 200 megatons TNT",
    source: "Krakatoa eruption summary",
    href: "https://en.wikipedia.org/wiki/1883_eruption_of_Krakatoa",
  },
  {
    name: "Hunga Tonga-Hunga Ha'apai 2022",
    ktMin: 61_000,
    ktMax: 61_000,
    category: "natural",
    basis: "Pressure-wave estimate: 61 megatons TNT",
    source: "Diaz and Rigby, Shock Waves",
    href: "https://link.springer.com/article/10.1007/s00193-022-01092-4",
  },
  {
    name: "Tunguska 1908 airburst",
    ktMin: 10_000,
    ktMax: 20_000,
    category: "natural",
    basis: "NASA workshop consensus range: 10 to 20 megatons TNT",
    source: "NASA NTRS Tunguska workshop",
    href: "https://ntrs.nasa.gov/api/citations/20190002302/downloads/20190002302.pdf",
  },
  {
    name: "Chelyabinsk 2013 airburst",
    ktMin: 440,
    ktMax: 500,
    category: "natural",
    basis: "NASA impact energy estimate: about 440 kt; models 400 to 500 kt",
    source: "NASA/JPL CNEOS",
    href: "https://cneos.jpl.nasa.gov/news/fireball_130301.html",
  },
  blueOriginEvent,
];

const humanNonNuclearEvents: EventDatum[] = [
  blueOriginEvent,
  {
    name: "Minor Scale test 1985",
    ktMin: 4,
    ktMax: 4.2,
    category: "human non-nuclear",
    basis: "4,744 tons ANFO; about 4 kt TNT, 17 TJ",
    source: "OSTI test report",
    href: "https://www.osti.gov/biblio/5606687",
  },
  {
    name: "Heligoland Operation Big Bang 1947",
    ktMin: 3.2,
    ktMax: 3.2,
    category: "human non-nuclear",
    basis: "Ordnance disposal estimate: about 3.2 kt TNT",
    source: "White Sands Missile Range Museum",
    href: "https://wsmrmuseum.com/2023/05/25/misty-castle-high-explosive-nuclear-effects-simulations-at-white-sands-missile-range/6/",
  },
  {
    name: "Halifax Explosion 1917",
    ktMin: 2.9,
    ktMax: 2.989,
    category: "human non-nuclear",
    basis: "High-explosive cargo detonation: about 2.9 kt TNT",
    source: "NASA safety message",
    href: "https://sma.nasa.gov/docs/default-source/safety-messages/safetymessage-2013-01-07-ssmontblancandhalifaxexplosion.pdf?sfvrsn=d4ae1ef8_6",
  },
  {
    name: "Port Chicago disaster 1944",
    ktMin: 1.6,
    ktMax: 2.2,
    category: "human non-nuclear",
    basis: "Military ammunition estimate: 1.6 to 2.2 kt TNT",
    source: "Largest artificial non-nuclear explosions summary",
    href: "https://en.wikipedia.org/wiki/Largest_artificial_non-nuclear_explosions",
  },
  {
    name: "Oppau explosion 1921",
    ktMin: 1,
    ktMax: 2,
    category: "human non-nuclear",
    basis: "Fertilizer detonation estimate: 1 to 2 kt TNT",
    source: "ARIA accident report",
    href: "https://www.aria.developpement-durable.gouv.fr/wp-content/files_mf/FD_14373_oppau_1921_ang.pdf",
  },
  {
    name: "Beirut port explosion 2020",
    ktMin: 0.13,
    ktMax: 2,
    category: "human non-nuclear",
    basis: "Open waveform and remote sensing range: 0.13 to 2 kt TNT",
    source: "Scientific Reports",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8266808/",
  },
  {
    name: "Texas City disaster 1947",
    ktMin: 1.134,
    ktMax: 3,
    category: "human non-nuclear",
    basis: "Ammonium nitrate estimates vary from about 1.1 to 3 kt TNT",
    source: "Texas City and AN expert summaries",
    href: "https://www.sciencemediacentre.org/expert-reaction-to-beirut-explosion/",
  },
  {
    name: "N1 launch explosion 1969",
    ktMin: 0.0045,
    ktMax: 1,
    category: "human non-nuclear",
    basis: "Actual blast likely far below 6.93 kt stored propellant energy",
    source: "RussianSpaceWeb and N1 summaries",
    href: "https://www.russianspaceweb.com/n1_5l.html",
  },
];

const allNonNuclearEvents: EventDatum[] = [
  ...nonNuclearEvents.filter((item) => !item.blue),
  ...humanNonNuclearEvents,
];

const allRecordedEvents: EventDatum[] = [
  ...allNonNuclearEvents,
  {
    name: "Tsar Bomba 1961",
    ktMin: 50_000,
    ktMax: 58_000,
    category: "nuclear",
    basis: "Official 50 Mt; older Western estimates 57 to 58 Mt",
    source: "Nuclear Weapon Archive",
    href: "https://nuclearweaponarchive.org/Russia/TsarBomba.html",
  },
  {
    name: "Castle Bravo 1954",
    ktMin: 15_000,
    ktMax: 15_000,
    category: "nuclear",
    basis: "US thermonuclear test yield: 15 Mt TNT",
    source: "Atomic Heritage Foundation",
    href: "https://ahf.nuclearmuseum.org/ahf/history/castle-bravo/",
  },
  {
    name: "Trinity 1945",
    ktMin: 21,
    ktMax: 24.8,
    category: "nuclear",
    basis: "Official 21 kt; 2021 reassessment 24.8 +/- 2 kt",
    source: "DOE and Nuclear Technology reassessment",
    href: "https://www.osti.gov/opennet/manhattan-project-history/Events/1945/trinity.htm",
  },
];

function log10(value: number) {
  return Math.log(value) / Math.LN10;
}

function sortedByMax(data: EventDatum[]) {
  return [...data].sort((a, b) => b.ktMax - a.ktMax);
}

function formatYield(kt: number) {
  if (kt >= 1_000_000_000) return `${Number((kt / 1_000_000_000).toPrecision(3))} Tt`;
  if (kt >= 1_000_000) return `${Number((kt / 1_000_000).toPrecision(3))} Gt`;
  if (kt >= 1_000) return `${Number((kt / 1_000).toPrecision(3))} Mt`;
  if (kt >= 1) return `${Number(kt.toPrecision(3))} kt`;
  return `${Number((kt * 1000).toPrecision(3))} t`;
}

function formatRange(min: number, max: number) {
  if (Math.abs(min - max) / Math.max(max, 1e-9) < 0.02) return formatYield((min + max) / 2);
  return `${formatYield(min)} to ${formatYield(max)}`;
}

function rankOfBlue(data: EventDatum[]) {
  const ordered = sortedByMax(data);
  return ordered.findIndex((item) => item.blue) + 1;
}

function LogRankChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: EventDatum[];
}) {
  const theme = useHostTheme();
  const ordered = sortedByMax(data);
  const minLog = Math.floor(log10(Math.min(...ordered.map((item) => item.ktMin))));
  const maxLog = Math.ceil(log10(Math.max(...ordered.map((item) => item.ktMax))));
  const span = maxLog - minLog;
  const tickStep = Math.max(1, Math.ceil(span / 5));
  const ticks: number[] = [];
  for (let power = minLog; power <= maxLog; power += tickStep) ticks.push(10 ** power);

  return (
    <Card size="lg">
      <CardHeader
        trailing={
          <Pill tone="info" active size="sm">
            Blue rank by ceiling: #{rankOfBlue(data)}
          </Pill>
        }
      >
        {title}
      </CardHeader>
      <CardBody>
        <Stack gap={12}>
          <Text tone="secondary">{subtitle}</Text>
          <div style={{ position: "relative", paddingTop: 8 }}>
            <div
              style={{
                position: "relative",
                height: 28,
                marginLeft: 180,
                marginBottom: 4,
                borderBottom: `1px solid ${theme.stroke.tertiary}`,
              }}
            >
              {ticks.map((tick) => {
                const left = ((log10(tick) - minLog) / span) * 100;
                return (
                  <div
                    key={tick}
                    style={{
                      position: "absolute",
                      left: `${left}%`,
                      top: 0,
                      bottom: 0,
                      borderLeft: `1px solid ${theme.stroke.tertiary}`,
                    }}
                  >
                    <Text
                      as="span"
                      size="small"
                      tone="tertiary"
                      style={{ position: "absolute", top: -2, left: 4, whiteSpace: "nowrap" }}
                    >
                      {formatYield(tick)}
                    </Text>
                  </div>
                );
              })}
            </div>

            <Stack gap={9}>
              {ordered.map((item, index) => {
                const left = ((log10(item.ktMin) - minLog) / span) * 100;
                const right = ((log10(item.ktMax) - minLog) / span) * 100;
                const width = Math.max(right - left, 0.7);
                const barColor = item.blue ? theme.accent.primary : theme.fill.primary;
                const textColor = item.blue ? theme.text.primary : theme.text.secondary;
                return (
                  <Grid key={`${title}-${item.name}`} columns="168px minmax(0, 1fr) 112px" gap={12} align="center">
                    <Row gap={6} align="center" style={{ minWidth: 0 }}>
                      <Text as="span" size="small" tone="tertiary" style={{ width: 24 }}>
                        {index + 1}
                      </Text>
                      <Text as="span" size="small" weight={item.blue ? "semibold" : "normal"} truncate style={{ color: textColor }}>
                        {item.name}
                      </Text>
                    </Row>
                    <div
                      title={item.basis}
                      style={{
                        height: 10,
                        position: "relative",
                        borderRadius: 999,
                        background: theme.fill.tertiary,
                        border: `1px solid ${theme.stroke.tertiary}`,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: `${left}%`,
                          width: `${width}%`,
                          top: -1,
                          bottom: -1,
                          borderRadius: 999,
                          background: barColor,
                        }}
                      />
                    </div>
                    <Text as="span" size="small" weight={item.blue ? "semibold" : "normal"} style={{ textAlign: "right", color: textColor }}>
                      {formatRange(item.ktMin, item.ktMax)}
                    </Text>
                  </Grid>
                );
              })}
            </Stack>
          </div>
          <Text size="small" tone="tertiary">
            X axis is logarithmic in TNT equivalent. Blue Origin is plotted as a chemical-energy ceiling range, not a measured blast yield.
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
}

function ProofPanel() {
  return (
    <Card size="lg">
      <CardHeader trailing={<Pill tone="warning" active size="sm">actual blast unknown</Pill>}>
        Verifiable Math
      </CardHeader>
      <CardBody>
        <Stack gap={12}>
          <Text>
            The concrete result is a bounded energy ceiling, not an exact blast yield. Public sources confirm the
            hot-fire explosion and the propellant families, but not event-specific consumed fraction, overpressure,
            or blast coupling.
          </Text>
          <Grid columns={3} gap={12}>
            <Stat value={`${formatRange(blueOriginKtMin, blueOriginKtMax)}`} label="full-stack chemical-energy ceiling" tone="info" />
            <Stat value={`${formatRange(firstStageLngLowKt, firstStageLngHighKt)}`} label="first-stage LNG inventory range" />
            <Stat value={`0 to ${formatYield(blueOriginKtMax)}`} label="provable actual-blast bound" tone="warning" />
          </Grid>
          <Divider />
          <Grid columns="1fr 1fr" gap={16}>
            <Stack gap={8}>
              <H3>Equations</H3>
              <Text>
                <Code>E = m * LHV</Code>, with <Code>m = rho * V</Code> for the LNG tank. Convert energy to TNT with{" "}
                <Code>Y_kt = E / 4.184e12 J</Code>.
              </Text>
              <Text>
                AFDC gives LNG lower heating value as 21,240 Btu/lb, which converts to{" "}
                <Code>{LNG_LHV_MJ_PER_KG.toFixed(5)} MJ/kg</Code>. The TNT convention is{" "}
                <Code>1 kt = 10^12 cal = 4.184e12 J</Code>.
              </Text>
              <Text>
                For pure liquid methane density, <Code>710 m3 * 422.6 kg/m3 * 49.40424 MJ/kg = 14.82 TJ = {firstStagePureMethaneKt.toFixed(2)} kt</Code>.
                Using the broader LNG density range of 410 to 500 kg/m3 gives <Code>{firstStageLngLowKt.toFixed(2)} to {firstStageLngHighKt.toFixed(2)} kt</Code>.
              </Text>
            </Stack>
            <Stack gap={8}>
              <H3>Proof Bound</H3>
              <Text>
                A public full-stack estimate gives <Code>18.6 to 21.2 TJ</Code> for New Glenn stored chemical energy.
                Dividing by <Code>4.184 TJ/kt</Code> gives <Code>{blueOriginKtMin.toFixed(2)} to {blueOriginKtMax.toFixed(2)} kt</Code>.
              </Text>
              <Text>
                Conservation of energy gives the hard inequality{" "}
                <Code>0 &lt;= actual blast yield &lt;= chemical energy available</Code>. A narrower actual blast value would require measured
                pressure, acoustic, seismic, or telemetry data. NASA launch-vehicle blast work warns that TNT equivalence does not represent
                actual cryogenic rocket explosion physics near the pad.
              </Text>
            </Stack>
          </Grid>
        </Stack>
      </CardBody>
    </Card>
  );
}

function SourceTable() {
  const rows = [
    ["Event confirmation", "May 28, 2026 New Glenn pad explosion during hot-fire; no injuries", "CBS News"],
    ["Vehicle propellants", "BE-4 first stage uses LOX/LNG; BE-3U upper stage uses LOX/LH2", "Blue Origin"],
    ["First-stage geometry", "Fuel/oxidizer tankage and 7 m stage dimensions from payload-guide material", "New Glenn Payload User's Guide"],
    ["Fuel properties", "LNG LHV 21,240 Btu/lb; hydrogen 33.3 kWh/kg; methane density 422.6 kg/m3", "AFDC, DOE, NIST-linked references"],
    ["TNT conversion", "1 kt TNT = 10^12 calories = 4.184e12 J", "Glasstone and Dolan"],
    ["Blast caveat", "Launch-vehicle TNT analogies do not represent near-field cryogenic explosion physics", "NASA NTRS blast environment papers"],
  ];

  return (
    <Card>
      <CardHeader>Source Notes</CardHeader>
      <CardBody>
        <Stack gap={10}>
          <Table headers={["Input", "Value used", "Source"]} rows={rows} columnAlign={["left", "left", "left"]} />
          <Text size="small" tone="tertiary">
            Ranking values are published TNT-equivalent estimates. Volcanic and impact values are often total energetic output or
            impact energy, while industrial and nuclear values are closer to blast-yield convention. The canvas keeps those bases visible
            so the comparison is transparent rather than pretending all mechanisms are identical.
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
}

function SourceLinks() {
  return (
    <Stack gap={8}>
      <H2>Ranking Source Links</H2>
      <Grid columns={2} gap={8}>
        {sortedByMax([...allRecordedEvents, ...humanNonNuclearEvents])
          .filter((item, index, list) => list.findIndex((other) => other.name === item.name) === index)
          .map((item) => (
            <Text key={`source-${item.name}`} size="small">
              <Link href={item.href}>{item.name}</Link>: {item.basis}
            </Text>
          ))}
      </Grid>
    </Stack>
  );
}

export default function BlueOriginExplosionAnalysis() {
  return (
    <Stack gap={18} style={{ padding: 20, maxWidth: 1180, margin: "0 auto" }}>
      <Stack gap={8}>
        <Row gap={8} align="center" wrap>
          <Pill tone="info" active>bounded estimate</Pill>
          <Pill tone="warning" active>not a measured blast yield</Pill>
          <Pill tone="neutral">TNT equivalent in kt</Pill>
        </Row>
        <H1>Blue Origin New Glenn Explosion Yield</H1>
        <Text tone="secondary">
          Best defensible public result: the May 28, 2026 New Glenn pad explosion had a full-stack stored
          chemical-energy ceiling of <Code>{blueOriginKtMin.toFixed(2)} to {blueOriginKtMax.toFixed(2)} kt TNT equivalent</Code>.
          The actual blast-wave yield is not publicly determinable from the available record.
        </Text>
      </Stack>

      <ProofPanel />

      <Grid columns="1fr 1fr" gap={14}>
        <LogRankChart
          title="Non-Nuclear Events"
          subtitle="Natural impacts and volcanoes dominate the top of the non-nuclear scale; major human-made non-nuclear events are included for rank context."
          data={allNonNuclearEvents}
        />
        <LogRankChart
          title="Human-Made Non-Nuclear Events"
          subtitle="Blue Origin ranks high only if using the stored chemical-energy ceiling; actual blast rank is unknown."
          data={humanNonNuclearEvents}
        />
      </Grid>

      <LogRankChart
        title="All Documented Comparison Events"
        subtitle="Including nuclear tests, the Blue Origin ceiling is far below weapon-scale nuclear events and far above ordinary industrial blasts."
        data={allRecordedEvents}
      />

      <SourceTable />
      <SourceLinks />
    </Stack>
  );
}
