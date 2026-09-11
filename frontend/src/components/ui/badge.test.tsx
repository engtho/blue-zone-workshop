import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import postcss, { type Root } from "postcss"
import { renderToStaticMarkup } from "react-dom/server"
import tailwindcss from "tailwindcss"
import loadConfig from "tailwindcss/loadConfig"
import { beforeAll, describe, expect, it } from "vitest"
import { Badge } from "./badge"

const variants = [
  "default", "secondary", "destructive", "outline",
  "success", "warning", "info", "muted",
] as const
const badges = variants.map(variant => ({
  variant,
  markup: renderToStaticMarkup(<Badge variant={variant}>Badge</Badge>),
}))
let css: Root

beforeAll(async () => {
  const configPath = fileURLToPath(new URL("../../../tailwind.config.js", import.meta.url))
  const cssPath = fileURLToPath(new URL("../../index.css", import.meta.url))
  const result = await postcss([tailwindcss({
    ...loadConfig(configPath),
    content: [{
      raw: `<div class="dark">${badges.map(badge => badge.markup).join("\n")}</div>`,
      extension: "html",
    }],
  })]).process(readFileSync(cssPath, "utf8"), { from: cssPath })
  css = result.root
  expect(declarations([".dark"])["--card"]).toBeDefined()
})

function declarations(selectors: string[]) {
  const values: Record<string, string> = {}
  css.walkRules(rule => {
    if (selectors.includes(rule.selector)) {
      rule.walkDecls(decl => { values[decl.prop] = decl.value })
    }
  })
  return values
}

// Only the HSL CSS-variable syntax emitted by this project's Tailwind theme.
function color(value: string, variables: Record<string, string>) {
  const resolved = value.replace(/var\((--[\w-]+)\)/g, (_, name: string) => {
    expect(variables[name], `Missing CSS token ${name}`).toBeDefined()
    return variables[name]
  })
  const match = /^hsl\(([\d.]+) ([\d.]+)% ([\d.]+)%(?: \/ ([\d.]+))?\)$/.exec(resolved)
  if (!match) throw new Error(`Unsupported badge color: ${resolved}`)
  const [, hue, saturation, lightness, alpha = "1"] = match
  const h = Number(hue)
  const s = Number(saturation) / 100
  const l = Number(lightness) / 100
  const a = s * Math.min(l, 1 - l)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return { rgb: [channel(0), channel(8), channel(4)], alpha: Number(alpha) }
}

function composite(foreground: ReturnType<typeof color>, background: number[]) {
  return foreground.rgb.map((channel, i) =>
    channel * foreground.alpha + background[i] * (1 - foreground.alpha))
}

function luminance(rgb: number[]) {
  const linear = rgb.map(channel =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

describe.each(["light", "dark"])("%s badge contrast on cards", theme => {
  describe.each(["normal", "hover"])("%s", state => {
    it.each(badges)("$variant meets WCAG AA for small text", ({ markup }) => {
      const tokens = declarations(theme === "dark" ? [":root", ".dark"] : [":root"])
      const classes = markup.match(/class="([^"]+)"/)![1].split(" ")
      const selectors = classes
        .filter(name => !name.startsWith("hover:") || state === "hover")
        .map(name => `.${name.replace(/[:/]/g, "\\$&")}${name.startsWith("hover:") ? ":hover" : ""}`)
      const styles = declarations(selectors)
      const variables = { ...tokens, ...styles }
      const card = color("hsl(var(--card))", tokens).rgb
      const background = styles["background-color"]
        ? composite(color(styles["background-color"], variables), card)
        : card
      const foreground = composite(color(styles.color, variables), background)
      const light = Math.max(luminance(foreground), luminance(background))
      const dark = Math.min(luminance(foreground), luminance(background))
      const ratio = (light + 0.05) / (dark + 0.05)

      expect(ratio, `Contrast is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)
    })
  })
})
