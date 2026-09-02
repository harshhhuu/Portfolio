"use client";

import { GemSmoke, type GemSmokeProps } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

export interface LiquidTextProps extends Omit<GemSmokeProps, "width" | "height"> {
  text?: string;
  lines?: string[];
  fontSize?: number;
  lineHeight?: number;
  padding?: number;
  width?: number;
  height?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  colorBack?: string;
  colorInner?: string;
  colors?: string[];
  className?: string;
}

type Box = {
  w: number;
  h: number;
  ascent: number;
  lines: string[];
  lineH: number;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function LiquidText({
  text,
  lines: customLines,
  fontSize = 58,
  lineHeight = 1.18,
  padding = 10,
  width,
  height,
  fontFamily = "var(--font-cormorant), 'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  fontWeight = "400",
  fontStyle = "italic",
  colorBack = "#F5EFEB",
  colorInner = "#D4A574",
  colors = ["#FFFFFF", "#F3E5D8", "#D4A574"],
  className,
  ...shaderProps
}: LiquidTextProps) {
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas 2D font syntax MUST NOT contain var() or invalid CSS tokens
    const cleanFontFamily = fontFamily.replace(/var\([^)]+\),?\s*/g, "").trim() || "'Cormorant Garamond', Georgia, serif";
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${cleanFontFamily}`;

    const lines: string[] = customLines && customLines.length > 0
      ? customLines
      : text
      ? text.split("\n")
      : [];

    if (lines.length === 0) return;

    const metrics = ctx.measureText("Mg");
    const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.85;
    const lineH = Math.round(fontSize * lineHeight);
    const measuredAscent = Math.round(ascent + padding);

    const lineMetrics = lines.map((l) => {
      const m = ctx.measureText(l);
      const right = m.actualBoundingBoxRight ? Math.max(m.width, m.actualBoundingBoxRight) : m.width;
      return right;
    });
    const maxLineWidth = Math.max(...lineMetrics);
    // Generous width padding so italic slants and swashes are never clipped
    const measuredW = Math.ceil(maxLineWidth) + padding * 2 + 64;
    const measuredH = Math.ceil(lines.length * lineH) + padding * 2;

    const finalW = width ?? measuredW;
    const finalH = height ?? measuredH;

    setBox({
      w: finalW,
      h: finalH,
      ascent: measuredAscent,
      lines,
      lineH,
    });
  }, [
    text,
    customLines,
    fontSize,
    lineHeight,
    padding,
    width,
    height,
    fontFamily,
    fontWeight,
    fontStyle,
  ]);

  const escapedLinesSvg = box
    ? box.lines
        .map(
          (line, idx) => `
        <text
          x="${padding}"
          y="${box.ascent + idx * box.lineH}"
          text-anchor="start"
          dominant-baseline="alphabetic"
          font-size="${fontSize}"
          font-weight="${fontWeight}"
          font-style="${fontStyle}"
          font-family="${fontFamily}"
          fill="white"
        >${escapeXml(line)}</text>
      `,
        )
        .join("")
    : "";

  const svgMask = box
    ? `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box.w} ${box.h}" width="${box.w}" height="${box.h}">
      ${escapedLinesSvg}
    </svg>
  `
    : "";

  const maskUrl = box
    ? `url("data:image/svg+xml;utf8,${encodeURIComponent(svgMask)}")`
    : "none";

  return (
    <div
      className={className}
      style={{
        width: box ? box.w : "100%",
        height: box ? box.h : "auto",
        maxWidth: "100%",
        WebkitMaskImage: maskUrl,
        maskImage: maskUrl,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    >
      {box && (
        <GemSmoke
          width={box.w}
          height={box.h}
          image="https://shaders.paper.design/images/logos/diamond.svg"
          colors={colors}
          colorBack={colorBack}
          colorInner={colorInner}
          shape="metaballs"
          innerDistortion={0.4}
          outerDistortion={0}
          outerGlow={0.4}
          innerGlow={0.8}
          offset={0}
          angle={152}
          size={0.35}
          speed={0.8}
          scale={3.5}
          {...shaderProps}
        />
      )}
    </div>
  );
}

export default LiquidText;
