#!/usr/bin/env python3
"""Generate Twitter-ready PNG graphics for the Blue Origin yield analysis."""

from __future__ import annotations

import json
import math
from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "events.json"
OUT_DIR = ROOT / "graphics"
FONT_REGULAR = "/usr/share/fonts/TTF/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf"

W, H = 1600, 900
BG = "#0f141b"
PANEL = "#151c25"
PANEL_2 = "#1b2430"
TEXT = "#f2f5f8"
MUTED = "#9aa7b4"
FAINT = "#667381"
GRID = "#2b3745"
BLUE = "#4da3ff"
BLUE_DARK = "#1d5fa8"
WHITE = "#ffffff"
WARN = "#f4c95d"
NATURAL = "#72d6a3"
NUCLEAR = "#e98a8a"
HUMAN = "#b6a0ff"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def load_data() -> dict:
    return json.loads(DATA_PATH.read_text())


def fmt_yield(kt: float) -> str:
    if kt >= 1_000_000_000:
        return f"{kt / 1_000_000_000:.3g} Tt"
    if kt >= 1_000_000:
        return f"{kt / 1_000_000:.3g} Gt"
    if kt >= 1_000:
        return f"{kt / 1_000:.3g} Mt"
    if kt >= 1:
        return f"{kt:.3g} kt"
    return f"{kt * 1000:.3g} t"


def fmt_range(lo: float, hi: float) -> str:
    if abs(lo - hi) / max(hi, 1e-9) < 0.02:
        return fmt_yield((lo + hi) / 2)
    return f"{fmt_yield(lo)}-{fmt_yield(hi)}"


def draw_wrapped(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fnt, fill: str, width: int, line_gap: int = 6) -> int:
    x, y = xy
    avg = max(1, int(width / max(1, draw.textlength("M", font=fnt))))
    lines: list[str] = []
    for paragraph in text.split("\n"):
        lines.extend(wrap(paragraph, avg) or [""])
    for line in lines:
        draw.text((x, y), line, fill=fill, font=fnt)
        y += fnt.size + line_gap
    return y


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: str, outline: str | None = None, radius: int = 28, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def category_color(item: dict) -> str:
    if item.get("blue"):
        return BLUE
    if item["category"] == "natural":
        return NATURAL
    if item["category"] == "nuclear":
        return NUCLEAR
    return HUMAN


def draw_header(draw: ImageDraw.ImageDraw, title: str, subtitle: str, kicker: str) -> None:
    draw.text((70, 54), kicker.upper(), fill=BLUE, font=font(24, True))
    draw.text((70, 92), title, fill=TEXT, font=font(58, True))
    draw_wrapped(draw, (72, 170), subtitle, font(25), MUTED, 1110, 7)
    rounded(draw, (1238, 58, 1530, 182), PANEL_2, GRID, 24)
    draw.text((1262, 82), "Blue Origin ceiling", fill=MUTED, font=font(22, True))
    draw.text((1262, 116), "4.45-5.07 kt", fill=WHITE, font=font(42, True))


def draw_footer(draw: ImageDraw.ImageDraw, footer: str) -> None:
    draw.line((70, 834, 1530, 834), fill=GRID, width=2)
    draw_wrapped(draw, (72, 852), footer, font(18), FAINT, 1410, 4)


def draw_log_chart(filename: str, title: str, subtitle: str, data: list[dict], footer: str) -> None:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_header(draw, title, subtitle, "TNT equivalent, log scale")

    items = sorted(data, key=lambda item: item["kt_max"], reverse=True)
    blue_rank = next(i + 1 for i, item in enumerate(items) if item.get("blue"))

    rounded(draw, (70, 250, 1530, 812), PANEL, GRID, 26)
    draw.text((104, 278), f"Blue rank by chemical-energy ceiling: #{blue_rank}", fill=WARN, font=font(24, True))
    draw.text((104, 310), "Actual blast-wave yield is not public; the chart uses the provable chemical-energy ceiling.", fill=MUTED, font=font(18))

    chart_left, chart_right = 525, 1420
    top, row_h = 360, 29
    min_log = math.floor(math.log10(min(item["kt_min"] for item in items)))
    max_log = math.ceil(math.log10(max(item["kt_max"] for item in items)))
    span = max_log - min_log
    tick_step = max(1, math.ceil(span / 5))

    for power in range(min_log, max_log + 1, tick_step):
        x = chart_left + int((power - min_log) / span * (chart_right - chart_left))
        draw.line((x, top - 35, x, top + row_h * len(items) + 8), fill=GRID, width=1)
        draw.text((x + 4, top - 32), fmt_yield(10**power), fill=FAINT, font=font(16))

    for idx, item in enumerate(items):
        y = top + idx * row_h
        color = category_color(item)
        name_color = WHITE if item.get("blue") else TEXT
        short_name = item["name"] if len(item["name"]) <= 33 else item["name"][:30] + "..."
        draw.text((104, y - 1), f"{idx + 1}", fill=FAINT, font=font(16, True))
        draw.text((150, y - 1), short_name, fill=name_color, font=font(16, True if item.get("blue") else False))

        lo = math.log10(item["kt_min"])
        hi = math.log10(item["kt_max"])
        x1 = chart_left + int((lo - min_log) / span * (chart_right - chart_left))
        x2 = chart_left + int((hi - min_log) / span * (chart_right - chart_left))
        rounded(draw, (chart_left, y + 7, chart_right, y + 16), "#10161e", GRID, 6)
        rounded(draw, (x1, y + 5, max(x1 + 6, x2), y + 18), color, None, 7)
        draw.text((1440, y - 1), fmt_range(item["kt_min"], item["kt_max"]), fill=name_color, font=font(16, True if item.get("blue") else False), anchor="ra")

    draw_footer(draw, footer)
    img.save(OUT_DIR / filename, quality=95)


def draw_summary(data: dict) -> None:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_header(
        draw,
        "What Can Be Proven?",
        "Public data bounds stored propellant energy. Actual blast yield needs measured blast, seismic, acoustic, or telemetry data.",
        "Blue Origin New Glenn, May 28 2026",
    )

    rounded(draw, (70, 270, 1530, 790), PANEL, GRID, 30)
    bo = data["blue_origin"]
    cards = [
        ("Full-stack chemical-energy ceiling", f"{bo['tnt_equivalent_kt_min']:.2f}-{bo['tnt_equivalent_kt_max']:.2f} kt", "Uses public 18.6-21.2 TJ full-stack estimate."),
        ("First-stage LNG inventory range", f"{bo['first_stage_lng_inventory_kt_min']:.2f}-{bo['first_stage_lng_inventory_kt_max']:.2f} kt", "710 m3 LNG tank with 410-500 kg/m3 density range."),
        ("Actual blast yield bound", f"0-{bo['actual_blast_yield_provable_bound_kt_max']:.2f} kt", "Conservation of energy. Public data does not narrow it."),
    ]
    x = 105
    for label, value, note in cards:
        rounded(draw, (x, 310, x + 440, 490), PANEL_2, GRID, 22)
        draw.text((x + 26, 336), label, fill=MUTED, font=font(21, True))
        draw.text((x + 26, 374), value, fill=BLUE if "Full-stack" in label else TEXT, font=font(45, True))
        draw_wrapped(draw, (x + 26, 434), note, font(16), FAINT, 380, 3)
        x += 475

    proof = (
        "Proof sketch: E = m * LHV and Y_kt = E / 4.184e12 J. "
        "For first-stage LNG: m = rho * V. For the full-stack public estimate: "
        "18.6-21.2 TJ / 4.184 TJ per kt = 4.45-5.07 kt. "
        "Since blast-wave energy cannot exceed available chemical energy, actual blast yield <= 5.07 kt. "
        "No public measurement proves a tighter actual-blast value."
    )
    draw_wrapped(draw, (112, 555), proof, font(30), TEXT, 1345, 8)
    draw_footer(draw, "Sources: CBS News; Blue Origin New Glenn page; AFDC fuel properties; Glasstone and Dolan TNT convention; NASA launch-vehicle blast environment papers.")
    img.save(OUT_DIR / "00-proof-summary.png", quality=95)


def main() -> None:
    OUT_DIR.mkdir(exist_ok=True)
    data = load_data()
    draw_summary(data)
    draw_log_chart(
        "01-non-nuclear-ranking.png",
        "Non-Nuclear Explosion Ranking",
        "Blue Origin is #7 by chemical-energy ceiling, behind major impacts, volcanoes, and Chelyabinsk.",
        data["rankings"]["non_nuclear"],
        "Blue Origin plotted as public chemical-energy ceiling, not measured blast yield. Natural-event values often represent total impact or eruption energy.",
    )
    draw_log_chart(
        "02-human-made-non-nuclear-ranking.png",
        "Human-Made Non-Nuclear Ranking",
        "By chemical-energy ceiling, New Glenn is #1 in this comparison. Actual blast rank remains unmeasured.",
        data["rankings"]["human_non_nuclear"],
        "Use this chart with the caveat: rocket propellant accidents are not TNT detonations; stored energy and blast coupling are different quantities.",
    )
    draw_log_chart(
        "03-all-recorded-ranking.png",
        "All Recorded Comparison Events",
        "Including nuclear tests, Blue Origin's ceiling is #10: below Trinity and megaton events.",
        data["rankings"]["all_recorded"],
        "Rank is by listed upper bound. Events differ in mechanism; the graphic is an energy-equivalent comparison, not equal-damage prediction.",
    )


if __name__ == "__main__":
    main()
