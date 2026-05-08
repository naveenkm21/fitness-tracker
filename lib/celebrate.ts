"use client"

import confetti from "canvas-confetti"

export function celebratePR() {
  const end = Date.now() + 1200
  const colors = ["#10b981", "#a855f7", "#f59e0b", "#06b6d4"]
  ;(function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.7 },
      colors,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.7 },
      colors,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export function celebrateAchievement() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#fbbf24", "#f59e0b", "#a855f7", "#10b981"],
  })
}
