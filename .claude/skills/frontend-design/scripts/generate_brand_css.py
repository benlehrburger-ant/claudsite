#!/usr/bin/env python3
"""
Generate CSS custom properties from the Anthropic brand color palette.

Usage:
    python generate_brand_css.py                  # Print to stdout
    python generate_brand_css.py -o brand.css     # Write to file
    python generate_brand_css.py --scss           # Output as SCSS variables
    python generate_brand_css.py --tailwind       # Output as Tailwind config
"""

import argparse
import json

BRAND_COLORS = {
    "magenta": {
        "100": "#FCF0F4",
        "200": "#F5C6D6",
        "300": "#F0A1BB",
        "500": "#E05A87",
        "600": "#B54369",
        "800": "#5E1C32",
        "900": "#2E0B17",
    },
    "blue": {
        "100": "#EDF5FC",
        "400": "#599EE3",
        "600": "#1B67B2",
    },
    "green": {
        "100": "#F1F7E9",
        "300": "#AFD47D",
        "600": "#568C1C",
        "900": "#0E2402",
    },
    "aqua": {
        "400": "#4DC49C",
        "500": "#24B283",
        "700": "#0E6B54",
    },
    "violet": {
        "500": "#6258D1",
        "600": "#4D44AB",
    },
    "orange": {
        "100": "#FAEFEB",
        "500": "#E86235",
        "600": "#BA4C27",
    },
    "red": {
        "100": "#FCEDED",
        "600": "#B53333",
    },
    "yellow": {
        "100": "#FAF3E8",
        "900": "#301901",
    },
    "gray": {
        "200": "#E8E6DC",
        "500": "#87867F",
        "700": "#3D3D3A",
    },
    "accent": {
        "coral": "#EBCECE",
        "fig": "#C46686",
    },
}


def generate_css():
    lines = ["/* Anthropic Brand Colors */", "/* Source: https://brand.anthropic.com/color */", ":root {"]
    for family, shades in BRAND_COLORS.items():
        lines.append(f"  /* {family.title()} */")
        for shade, hex_val in shades.items():
            lines.append(f"  --brand-{family}-{shade}: {hex_val};")
        lines.append("")
    lines.append("}")
    return "\n".join(lines)


def generate_scss():
    lines = ["// Anthropic Brand Colors", "// Source: https://brand.anthropic.com/color", ""]
    for family, shades in BRAND_COLORS.items():
        lines.append(f"// {family.title()}")
        for shade, hex_val in shades.items():
            lines.append(f"$brand-{family}-{shade}: {hex_val};")
        lines.append("")
    return "\n".join(lines)


def generate_tailwind():
    config = {}
    for family, shades in BRAND_COLORS.items():
        config[family] = {}
        for shade, hex_val in shades.items():
            config[family][shade] = hex_val
    output = {
        "theme": {
            "extend": {
                "colors": config
            }
        }
    }
    return f"// Anthropic Brand Colors for tailwind.config.js\n// Source: https://brand.anthropic.com/color\n\nmodule.exports = {json.dumps(output, indent=2)}"


def main():
    parser = argparse.ArgumentParser(description="Generate Anthropic brand color tokens")
    parser.add_argument("-o", "--output", help="Output file path")
    parser.add_argument("--scss", action="store_true", help="Output as SCSS variables")
    parser.add_argument("--tailwind", action="store_true", help="Output as Tailwind config")
    args = parser.parse_args()

    if args.tailwind:
        result = generate_tailwind()
    elif args.scss:
        result = generate_scss()
    else:
        result = generate_css()

    if args.output:
        with open(args.output, "w") as f:
            f.write(result + "\n")
        print(f"Written to {args.output}")
    else:
        print(result)


if __name__ == "__main__":
    main()
