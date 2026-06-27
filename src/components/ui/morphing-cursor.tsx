"use client"

import type React from "react"
import { useRef, useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useScrollStore } from "@/store/useScrollStore"

interface LineItem {
  text: string
  hoverText: string
}

interface UnifiedMagneticTextProps {
  lines: LineItem[]
  className?: string
  textClassName?: string
  revealSize?: number
}

export function UnifiedMagneticText({ 
  lines, 
  className,
  textClassName = "text-3xl md:text-5xl font-bold tracking-tighter text-foreground tracking-wide",
  revealSize = 300
}: UnifiedMagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const innerTextRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const containerSizeRef = useRef({ width: 0, height: 0 })
  const isLoaded = useScrollStore((s) => s.isLoaded)

  const mousePos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const size = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        }
        setContainerSize(size)
        containerSizeRef.current = size
      }
    }
    updateSize()
    const timer = setTimeout(updateSize, 100)
    window.addEventListener("resize", updateSize)
    return () => {
      window.removeEventListener("resize", updateSize)
      clearTimeout(timer)
    }
  }, [lines, isLoaded])

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.15)
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.15)

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`
      }

      if (innerTextRef.current) {
        const W = containerSizeRef.current.width
        const H = containerSizeRef.current.height
        innerTextRef.current.style.transform = `translate(${-currentPos.current.x + W / 2}px, ${-currentPos.current.y + H / 2}px) translate(-50%, -50%)`
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mousePos.current = { x, y }
    currentPos.current = { x, y }
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full cursor-none select-none", 
        className
      )}
    >
      {/* Base text layer */}
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8 w-full z-0 py-8">
        {lines.map((line, idx) => (
          <div key={idx} className="relative inline-grid grid-cols-1 grid-rows-1 items-center justify-items-center">
            {/* Base Text */}
            <span className={cn(textClassName, "col-start-1 row-start-1 text-foreground select-none text-center justify-self-center z-0 whitespace-nowrap")}>
              {line.text}
            </span>
            {/* Invisible Hover Placeholder to set max grid width */}
            <span className={cn(textClassName, "col-start-1 row-start-1 opacity-0 pointer-events-none select-none whitespace-nowrap text-center justify-self-center z-0")}>
              {line.hoverText}
            </span>
          </div>
        ))}
      </div>

      {/* Unified Hover Reveal Overlay Mask */}
      <div
        ref={circleRef}
        className="absolute top-0 left-0 pointer-events-none rounded-full bg-accent overflow-hidden z-10"
        style={{
          width: isHovered ? revealSize : 0,
          height: isHovered ? revealSize : 0,
          transition: "width 0.5s cubic-bezier(0.33, 1, 0.68, 1), height 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
          willChange: "transform, width, height",
        }}
      >
        <div
          ref={innerTextRef}
          className="absolute flex flex-col items-center justify-center gap-6 md:gap-8 py-8"
          style={{
            width: containerSize.width,
            height: containerSize.height,
            top: "50%",
            left: "50%",
            willChange: "transform",
          }}
        >
          {lines.map((line, idx) => (
            <div key={idx} className="relative inline-grid grid-cols-1 grid-rows-1 items-center justify-items-center">
              {/* Invisible Base Placeholder */}
              <span className={cn(textClassName, "col-start-1 row-start-1 opacity-0 pointer-events-none select-none whitespace-nowrap text-center justify-self-center z-0")}>
                {line.text}
              </span>
              {/* Hover Text */}
              <span className={cn(textClassName, "col-start-1 row-start-1 text-background select-none text-center justify-self-center z-0 whitespace-nowrap")}>
                {line.hoverText}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
