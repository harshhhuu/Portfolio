import { UnifiedMagneticText } from "@/components/ui/morphing-cursor"

export default function PunchlineSection() {
  const textClass = "text-3xl sm:text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[7rem] 2xl:text-[8rem] font-display font-black uppercase tracking-tight leading-[0.9] text-center"

  const lines = [
    { text: "IF MY AI AGENTS", hoverText: "PLEASE TELL THEM" },
    { text: "BECOME", hoverText: "I WAS THE" },
    { text: "SELF-AWARE", hoverText: "NICE ONE." }
  ]

  return (
    <section className="w-full min-h-screen relative z-10 flex flex-col items-center justify-center bg-transparent overflow-hidden py-12 md:py-24">
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <UnifiedMagneticText 
          lines={lines}
          textClassName={textClass}
          revealSize={350} // A perfect medium-sized hovering circle (350px)
        />
      </div>
    </section>
  )
}
