/**
 * shadowDrawers.js
 * Each function receives (ctx, x, y, size) and draws a shadow silhouette.
 * x, y = center position on canvas. size = scale factor.
 */

const SHADOW_COLOR = 'rgba(15, 15, 20, 0.92)'
const SHADOW_BLUR = 18

function applyShadowStyle(ctx, color = SHADOW_COLOR) {
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.shadowBlur = SHADOW_BLUR
  ctx.shadowColor = 'rgba(0,0,0,0.6)'
}

/** RABBIT – two long ears, round head */
export function drawRabbit(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  ctx.beginPath()
  // Left ear
  ctx.ellipse(x - s * 0.25, y - s * 0.9, s * 0.13, s * 0.55, -0.15, 0, Math.PI * 2)
  ctx.fill()
  // Right ear
  ctx.beginPath()
  ctx.ellipse(x + s * 0.25, y - s * 0.9, s * 0.13, s * 0.55, 0.15, 0, Math.PI * 2)
  ctx.fill()
  // Head
  ctx.beginPath()
  ctx.arc(x, y - s * 0.1, s * 0.45, 0, Math.PI * 2)
  ctx.fill()
  // Body
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.55, s * 0.38, s * 0.5, 0, 0, Math.PI * 2)
  ctx.fill()
  // Tail
  ctx.beginPath()
  ctx.arc(x + s * 0.38, y + s * 0.7, s * 0.14, 0, Math.PI * 2)
  ctx.fill()
}

/** DOG – floppy ears, snout */
export function drawDog(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  // Head
  ctx.beginPath()
  ctx.arc(x, y, s * 0.45, 0, Math.PI * 2)
  ctx.fill()
  // Left ear (floppy)
  ctx.beginPath()
  ctx.ellipse(x - s * 0.42, y + s * 0.15, s * 0.22, s * 0.4, -0.4, 0, Math.PI * 2)
  ctx.fill()
  // Right ear (floppy)
  ctx.beginPath()
  ctx.ellipse(x + s * 0.42, y + s * 0.15, s * 0.22, s * 0.4, 0.4, 0, Math.PI * 2)
  ctx.fill()
  // Snout
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.3, s * 0.28, s * 0.18, 0, 0, Math.PI * 2)
  ctx.fill()
  // Nose
  ctx.beginPath()
  ctx.arc(x, y + s * 0.25, s * 0.08, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(5,5,10,0.99)'
  ctx.fill()
  // Body
  ctx.fillStyle = SHADOW_COLOR
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.95, s * 0.38, s * 0.48, 0, 0, Math.PI * 2)
  ctx.fill()
}

/** BIRD – wings spread, small beak */
export function drawBird(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  // Left wing
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.bezierCurveTo(x - s * 0.5, y - s * 0.6, x - s * 1.1, y - s * 0.2, x - s * 1.2, y + s * 0.3)
  ctx.bezierCurveTo(x - s * 0.8, y + s * 0.1, x - s * 0.3, y + s * 0.3, x, y)
  ctx.fill()
  // Right wing
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.bezierCurveTo(x + s * 0.5, y - s * 0.6, x + s * 1.1, y - s * 0.2, x + s * 1.2, y + s * 0.3)
  ctx.bezierCurveTo(x + s * 0.8, y + s * 0.1, x + s * 0.3, y + s * 0.3, x, y)
  ctx.fill()
  // Body
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.1, s * 0.22, s * 0.32, 0, 0, Math.PI * 2)
  ctx.fill()
  // Head
  ctx.beginPath()
  ctx.arc(x, y - s * 0.32, s * 0.18, 0, Math.PI * 2)
  ctx.fill()
  // Beak
  ctx.beginPath()
  ctx.moveTo(x + s * 0.18, y - s * 0.32)
  ctx.lineTo(x + s * 0.38, y - s * 0.26)
  ctx.lineTo(x + s * 0.18, y - s * 0.22)
  ctx.closePath()
  ctx.fill()
}

/** BUTTERFLY – symmetric wings */
export function drawButterfly(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  // Upper left wing
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.bezierCurveTo(x - s * 0.2, y - s * 0.7, x - s * 0.9, y - s * 0.8, x - s * 1.0, y - s * 0.1)
  ctx.bezierCurveTo(x - s * 0.9, y + s * 0.2, x - s * 0.2, y + s * 0.1, x, y)
  ctx.fill()
  // Lower left wing
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.bezierCurveTo(x - s * 0.15, y + s * 0.3, x - s * 0.7, y + s * 0.7, x - s * 0.6, y + s * 0.9)
  ctx.bezierCurveTo(x - s * 0.2, y + s * 0.9, x - s * 0.1, y + s * 0.4, x, y)
  ctx.fill()
  // Upper right wing
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.bezierCurveTo(x + s * 0.2, y - s * 0.7, x + s * 0.9, y - s * 0.8, x + s * 1.0, y - s * 0.1)
  ctx.bezierCurveTo(x + s * 0.9, y + s * 0.2, x + s * 0.2, y + s * 0.1, x, y)
  ctx.fill()
  // Lower right wing
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.bezierCurveTo(x + s * 0.15, y + s * 0.3, x + s * 0.7, y + s * 0.7, x + s * 0.6, y + s * 0.9)
  ctx.bezierCurveTo(x + s * 0.2, y + s * 0.9, x + s * 0.1, y + s * 0.4, x, y)
  ctx.fill()
  // Body
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.15, s * 0.07, s * 0.45, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(5,5,10,0.99)'
  ctx.fill()
  // Antennae
  ctx.fillStyle = SHADOW_COLOR
  ctx.strokeStyle = SHADOW_COLOR
  ctx.lineWidth = s * 0.05
  ctx.beginPath()
  ctx.moveTo(x, y - s * 0.28)
  ctx.quadraticCurveTo(x - s * 0.2, y - s * 0.6, x - s * 0.3, y - s * 0.75)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, y - s * 0.28)
  ctx.quadraticCurveTo(x + s * 0.2, y - s * 0.6, x + s * 0.3, y - s * 0.75)
  ctx.stroke()
}

/** SNAKE – S-curve body, triangular head */
export function drawSnake(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  ctx.lineWidth = s * 0.22
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  // S-curve body
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.9)
  ctx.bezierCurveTo(
    x + s * 0.6, y + s * 0.5,
    x - s * 0.6, y + s * 0.0,
    x + s * 0.3, y - s * 0.4
  )
  ctx.stroke()
  // Head triangle
  ctx.beginPath()
  ctx.moveTo(x + s * 0.3, y - s * 0.4)
  ctx.lineTo(x + s * 0.55, y - s * 0.65)
  ctx.lineTo(x + s * 0.05, y - s * 0.65)
  ctx.closePath()
  ctx.fill()
  // Forked tongue
  ctx.strokeStyle = 'rgba(200,50,50,0.9)'
  ctx.lineWidth = s * 0.04
  ctx.beginPath()
  ctx.moveTo(x + s * 0.3, y - s * 0.65)
  ctx.lineTo(x + s * 0.18, y - s * 0.82)
  ctx.moveTo(x + s * 0.3, y - s * 0.65)
  ctx.lineTo(x + s * 0.42, y - s * 0.82)
  ctx.stroke()
  // Eye
  ctx.beginPath()
  ctx.arc(x + s * 0.45, y - s * 0.55, s * 0.05, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,100,0.9)'
  ctx.fill()
}

/** GOAT – long curved horns, snout, beard */
export function drawGoat(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  
  // Head
  ctx.beginPath()
  ctx.arc(x, y - s * 0.1, s * 0.38, 0, Math.PI * 2)
  ctx.fill()
  
  // Snout extending downwards
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.25, s * 0.22, s * 0.38, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Left Horn
  ctx.beginPath()
  ctx.ellipse(x - s * 0.22, y - s * 0.65, s * 0.08, s * 0.45, -0.3, 0, Math.PI * 2)
  ctx.fill()
  
  // Right Horn
  ctx.beginPath()
  ctx.ellipse(x + s * 0.22, y - s * 0.65, s * 0.08, s * 0.45, 0.3, 0, Math.PI * 2)
  ctx.fill()
  
  // Beard
  ctx.beginPath()
  ctx.moveTo(x - s * 0.1, y + s * 0.6)
  ctx.lineTo(x, y + s * 0.82)
  ctx.lineTo(x + s * 0.1, y + s * 0.6)
  ctx.closePath()
  ctx.fill()
  
  // Eye
  ctx.beginPath()
  ctx.arc(x + s * 0.15, y, s * 0.045, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,100,0.95)'
  ctx.fill()
}

/** FOX – pointed ears, snout, diamond face */
export function drawFox(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  
  // Head (wide diamond/face shape)
  ctx.beginPath()
  ctx.moveTo(x - s * 0.48, y - s * 0.1)
  ctx.lineTo(x + s * 0.48, y - s * 0.1)
  ctx.lineTo(x, y + s * 0.45) // Chin
  ctx.closePath()
  ctx.fill()
  
  // Left Ear (pointed)
  ctx.beginPath()
  ctx.moveTo(x - s * 0.38, y - s * 0.1)
  ctx.lineTo(x - s * 0.45, y - s * 0.72)
  ctx.lineTo(x - s * 0.12, y - s * 0.15)
  ctx.closePath()
  ctx.fill()
  
  // Right Ear (pointed)
  ctx.beginPath()
  ctx.moveTo(x + s * 0.38, y - s * 0.1)
  ctx.lineTo(x + s * 0.45, y - s * 0.72)
  ctx.lineTo(x + s * 0.12, y - s * 0.15)
  ctx.closePath()
  ctx.fill()
  
  // Long snout (nose tip at bottom chin)
  ctx.beginPath()
  ctx.arc(x, y + s * 0.42, s * 0.065, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(5,5,10,0.99)'
  ctx.fill()
  
  // Eyes
  ctx.fillStyle = 'rgba(255,255,100,0.95)'
  ctx.beginPath()
  ctx.arc(x - s * 0.15, y + s * 0.08, s * 0.04, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + s * 0.15, y + s * 0.08, s * 0.04, 0, Math.PI * 2)
  ctx.fill()
}

/** HORSE – pointed ears, snout, flowing mane */
export function drawHorse(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  ctx.beginPath()
  // Ears
  ctx.ellipse(x - s * 0.15, y - s * 0.75, s * 0.08, s * 0.35, -0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(x + s * 0.05, y - s * 0.8, s * 0.08, s * 0.35, 0.1, 0, Math.PI * 2)
  ctx.fill()
  
  // Head / Muzzle
  ctx.beginPath()
  ctx.moveTo(x - s * 0.1, y - s * 0.5)
  ctx.lineTo(x - s * 0.65, y - s * 0.25)
  ctx.quadraticCurveTo(x - s * 0.8, y - s * 0.1, x - s * 0.6, y + s * 0.05)
  ctx.lineTo(x - s * 0.2, y + s * 0.05)
  ctx.lineTo(x - s * 0.3, y + s * 0.8)
  ctx.lineTo(x + s * 0.5, y + s * 0.8)
  ctx.lineTo(x + s * 0.3, y - s * 0.1)
  ctx.closePath()
  ctx.fill()

  // Mane
  ctx.beginPath()
  ctx.moveTo(x + s * 0.2, y - s * 0.2)
  ctx.lineTo(x + s * 0.45, y - s * 0.05)
  ctx.lineTo(x + s * 0.28, y + s * 0.15)
  ctx.lineTo(x + s * 0.52, y + s * 0.3)
  ctx.lineTo(x + s * 0.35, y + s * 0.5)
  ctx.lineTo(x + s * 0.58, y + s * 0.65)
  ctx.lineTo(x + s * 0.4, y + s * 0.8)
  ctx.lineTo(x + s * 0.15, y + s * 0.8)
  ctx.closePath()
  ctx.fill()
}

/** SPIDER – round abdomen, fangs, 8 bending legs */
export function drawSpider(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  
  // Abdomen
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.15, s * 0.35, s * 0.45, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Cephalothorax
  ctx.beginPath()
  ctx.arc(x, y - s * 0.25, s * 0.18, 0, Math.PI * 2)
  ctx.fill()

  // Fangs
  ctx.beginPath()
  ctx.moveTo(x - s * 0.08, y - s * 0.4)
  ctx.quadraticCurveTo(x - s * 0.18, y - s * 0.52, x - s * 0.06, y - s * 0.58)
  ctx.quadraticCurveTo(x - s * 0.12, y - s * 0.48, x - s * 0.04, y - s * 0.4)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(x + s * 0.08, y - s * 0.4)
  ctx.quadraticCurveTo(x + s * 0.18, y - s * 0.52, x + s * 0.06, y - s * 0.58)
  ctx.quadraticCurveTo(x + s * 0.12, y - s * 0.48, x + s * 0.04, y - s * 0.4)
  ctx.closePath()
  ctx.fill()
  
  // 8 legs
  ctx.strokeStyle = SHADOW_COLOR
  ctx.lineWidth = s * 0.05
  ctx.lineCap = 'round'
  
  const leftLegs = [
    { ctrlX: x - s * 1.1, ctrlY: y - s * 0.6, endX: x - s * 0.9, endY: y - s * 0.2 },
    { ctrlX: x - s * 1.3, ctrlY: y - s * 0.2, endX: x - s * 1.1, endY: y + s * 0.2 },
    { ctrlX: x - s * 1.2, ctrlY: y + s * 0.2, endX: x - s * 1.0, endY: y + s * 0.6 },
    { ctrlX: x - s * 1.0, ctrlY: y + s * 0.6, endX: x - s * 0.7, endY: y + s * 0.9 },
  ]
  
  leftLegs.forEach(leg => {
    ctx.beginPath()
    ctx.moveTo(x - s * 0.1, y - s * 0.1)
    ctx.quadraticCurveTo(leg.ctrlX, leg.ctrlY, leg.endX, leg.endY)
    ctx.stroke()
  })

  const rightLegs = [
    { ctrlX: x + s * 1.1, ctrlY: y - s * 0.6, endX: x + s * 0.9, endY: y - s * 0.2 },
    { ctrlX: x + s * 1.3, ctrlY: y - s * 0.2, endX: x + s * 1.1, endY: y + s * 0.2 },
    { ctrlX: x + s * 1.2, ctrlY: y + s * 0.2, endX: x + s * 1.0, endY: y + s * 0.6 },
    { ctrlX: x + s * 1.0, ctrlY: y + s * 0.6, endX: x + s * 0.7, endY: y + s * 0.9 },
  ]
  
  rightLegs.forEach(leg => {
    ctx.beginPath()
    ctx.moveTo(x + s * 0.1, y - s * 0.1)
    ctx.quadraticCurveTo(leg.ctrlX, leg.ctrlY, leg.endX, leg.endY)
    ctx.stroke()
  })
}

/** DONKEY – long floppy upright ears, facial profile */
export function drawDonkey(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  
  // Ears
  ctx.beginPath()
  ctx.ellipse(x - s * 0.2, y - s * 0.9, s * 0.12, s * 0.55, -0.05, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.beginPath()
  ctx.ellipse(x + s * 0.15, y - s * 0.85, s * 0.11, s * 0.52, 0.1, 0, Math.PI * 2)
  ctx.fill()
  
  // Head
  ctx.beginPath()
  ctx.moveTo(x - s * 0.05, y - s * 0.45)
  ctx.lineTo(x - s * 0.68, y - s * 0.22)
  ctx.quadraticCurveTo(x - s * 0.82, y - s * 0.08, x - s * 0.65, y + s * 0.08)
  ctx.lineTo(x - s * 0.15, y + s * 0.08)
  ctx.lineTo(x - s * 0.25, y + s * 0.75)
  ctx.lineTo(x + s * 0.45, y + s * 0.75)
  ctx.lineTo(x + s * 0.28, y - s * 0.1)
  ctx.closePath()
  ctx.fill()
  
  // Hair tuft
  ctx.beginPath()
  ctx.moveTo(x - s * 0.1, y - s * 0.5)
  ctx.quadraticCurveTo(x - s * 0.2, y - s * 0.65, x - s * 0.15, y - s * 0.58)
  ctx.quadraticCurveTo(x, y - s * 0.65, x + s * 0.05, y - s * 0.5)
  ctx.closePath()
  ctx.fill()
}

/** PIG – stout round body, ears, nose snout, curly tail */
export function drawPig(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  
  // Body
  ctx.beginPath()
  ctx.ellipse(x + s * 0.1, y + s * 0.15, s * 0.58, s * 0.48, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Head
  ctx.beginPath()
  ctx.arc(x - s * 0.32, y - s * 0.05, s * 0.28, 0, Math.PI * 2)
  ctx.fill()
  
  // Snout
  ctx.beginPath()
  ctx.moveTo(x - s * 0.52, y - s * 0.15)
  ctx.lineTo(x - s * 0.72, y - s * 0.15)
  ctx.lineTo(x - s * 0.72, y + s * 0.05)
  ctx.lineTo(x - s * 0.52, y + s * 0.05)
  ctx.closePath()
  ctx.fill()
  
  // Ears
  ctx.beginPath()
  ctx.moveTo(x - s * 0.25, y - s * 0.28)
  ctx.lineTo(x - s * 0.35, y - s * 0.58)
  ctx.lineTo(x - s * 0.12, y - s * 0.35)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(x - s * 0.12, y - s * 0.25)
  ctx.lineTo(x - s * 0.2, y - s * 0.52)
  ctx.lineTo(x - s * 0.02, y - s * 0.3)
  ctx.closePath()
  ctx.fill()
  
  // Tail
  ctx.strokeStyle = SHADOW_COLOR
  ctx.lineWidth = s * 0.04
  ctx.beginPath()
  ctx.moveTo(x + s * 0.65, y + s * 0.1)
  ctx.quadraticCurveTo(x + s * 0.9, y, x + s * 0.8, y - s * 0.15)
  ctx.quadraticCurveTo(x + s * 0.68, y - s * 0.1, x + s * 0.78, y + s * 0.08)
  ctx.stroke()
}

/** LIZARD – body, crawling limbs, curved tail */
export function drawLizard(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  
  // Body and tail
  ctx.lineWidth = s * 0.15
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = SHADOW_COLOR
  
  ctx.beginPath()
  ctx.moveTo(x - s * 0.3, y - s * 0.3)
  ctx.quadraticCurveTo(x, y - s * 0.1, x + s * 0.2, y + s * 0.2)
  ctx.quadraticCurveTo(x + s * 0.6, y + s * 0.7, x + s * 0.1, y + s * 0.85)
  ctx.quadraticCurveTo(x - s * 0.4, y + s * 0.8, x - s * 0.5, y + s * 0.4)
  ctx.stroke()

  // Head
  ctx.beginPath()
  ctx.moveTo(x - s * 0.3, y - s * 0.3)
  ctx.lineTo(x - s * 0.52, y - s * 0.52)
  ctx.lineTo(x - s * 0.22, y - s * 0.48)
  ctx.closePath()
  ctx.fill()

  // Limbs
  ctx.lineWidth = s * 0.045
  
  // Front-left
  ctx.beginPath()
  ctx.moveTo(x - s * 0.15, y - s * 0.22)
  ctx.lineTo(x - s * 0.38, y - s * 0.12)
  ctx.lineTo(x - s * 0.48, y - s * 0.25)
  ctx.stroke()

  // Front-right
  ctx.beginPath()
  ctx.moveTo(x - s * 0.1, y - s * 0.25)
  ctx.lineTo(x + s * 0.1, y - s * 0.42)
  ctx.lineTo(x + s * 0.22, y - s * 0.38)
  ctx.stroke()

  // Rear-right
  ctx.beginPath()
  ctx.moveTo(x + s * 0.15, y + s * 0.15)
  ctx.lineTo(x + s * 0.35, y + s * 0.05)
  ctx.lineTo(x + s * 0.48, y + s * 0.18)
  ctx.stroke()

  // Rear-left
  ctx.beginPath()
  ctx.moveTo(x + s * 0.15, y + s * 0.15)
  ctx.lineTo(x - s * 0.02, y + s * 0.38)
  ctx.lineTo(x - s * 0.15, y + s * 0.35)
  ctx.stroke()
}

/** SCISSORS – intersecting blades and circular handles */
export function drawScissors(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  
  ctx.strokeStyle = SHADOW_COLOR
  ctx.lineWidth = s * 0.07
  ctx.lineCap = 'round'
  
  // Left handle
  ctx.beginPath()
  ctx.arc(x - s * 0.2, y + s * 0.35, s * 0.16, 0, Math.PI * 2)
  ctx.stroke()
  
  // Right handle
  ctx.beginPath()
  ctx.arc(x + s * 0.2, y + s * 0.35, s * 0.16, 0, Math.PI * 2)
  ctx.stroke()
  
  // Left blade
  ctx.beginPath()
  ctx.moveTo(x - s * 0.18, y + s * 0.18)
  ctx.lineTo(x + s * 0.25, y - s * 0.55)
  ctx.lineTo(x + s * 0.08, y - s * 0.55)
  ctx.closePath()
  ctx.fill()
  
  // Right blade
  ctx.beginPath()
  ctx.moveTo(x + s * 0.18, y + s * 0.18)
  ctx.lineTo(x - s * 0.25, y - s * 0.55)
  ctx.lineTo(x - s * 0.08, y - s * 0.55)
  ctx.closePath()
  ctx.fill()

  // Center pivot pin
  ctx.beginPath()
  ctx.arc(x, y + s * 0.05, s * 0.04, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
}

/** GLASSES – circular frames, bridge, and temples */
export function drawGlasses(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  ctx.lineWidth = s * 0.08
  ctx.strokeStyle = SHADOW_COLOR
  ctx.lineCap = 'round'
  
  // Left circular frame
  ctx.beginPath()
  ctx.arc(x - s * 0.35, y, s * 0.24, 0, Math.PI * 2)
  ctx.stroke()
  
  // Right circular frame
  ctx.beginPath()
  ctx.arc(x + s * 0.35, y, s * 0.24, 0, Math.PI * 2)
  ctx.stroke()
  
  // Bridge
  ctx.beginPath()
  ctx.arc(x, y - s * 0.04, s * 0.12, Math.PI, 0)
  ctx.stroke()
  
  // Temples/Arms
  ctx.beginPath()
  ctx.moveTo(x - s * 0.58, y)
  ctx.lineTo(x - s * 0.88, y - s * 0.2)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(x + s * 0.58, y)
  ctx.lineTo(x + s * 0.88, y - s * 0.2)
  ctx.stroke()
}

/** CUP – cup body, handle, and saucer plate */
export function drawCup(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  
  // Cup Body
  ctx.beginPath()
  ctx.moveTo(x - s * 0.35, y - s * 0.25)
  ctx.lineTo(x + s * 0.35, y - s * 0.25)
  ctx.lineTo(x + s * 0.25, y + s * 0.28)
  ctx.lineTo(x - s * 0.25, y + s * 0.28)
  ctx.closePath()
  ctx.fill()
  
  // Handle
  ctx.beginPath()
  ctx.ellipse(x + s * 0.36, y, s * 0.12, s * 0.18, 0, -Math.PI / 2, Math.PI / 2)
  ctx.lineWidth = s * 0.075
  ctx.strokeStyle = SHADOW_COLOR
  ctx.stroke()
  
  // Saucer
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.35, s * 0.45, s * 0.07, 0, 0, Math.PI * 2)
  ctx.fillStyle = SHADOW_COLOR
  ctx.fill()
}

/** CROWN – spiked crown with gems */
export function drawCrown(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  
  ctx.beginPath()
  ctx.moveTo(x - s * 0.5, y + s * 0.35)
  ctx.lineTo(x + s * 0.5, y + s * 0.35)
  ctx.lineTo(x + s * 0.45, y - s * 0.15)
  ctx.lineTo(x + s * 0.22, y + s * 0.08)
  ctx.lineTo(x, y - s * 0.38)
  ctx.lineTo(x - s * 0.22, y + s * 0.08)
  ctx.lineTo(x - s * 0.45, y - s * 0.15)
  ctx.closePath()
  ctx.fill()
  
  // Gems
  ctx.beginPath()
  ctx.arc(x - s * 0.45, y - s * 0.2, s * 0.05, 0, Math.PI * 2)
  ctx.arc(x, y - s * 0.44, s * 0.05, 0, Math.PI * 2)
  ctx.arc(x + s * 0.45, y - s * 0.2, s * 0.05, 0, Math.PI * 2)
  ctx.fillStyle = SHADOW_COLOR
  ctx.fill()
}

/** AIRPLANE – fuselage, swept wings, stabilizers */
export function drawAirplane(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  
  // Fuselage
  ctx.beginPath()
  ctx.ellipse(x, y, s * 0.14, s * 0.75, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Wings (swept back)
  ctx.beginPath()
  ctx.moveTo(x, y - s * 0.15)
  ctx.lineTo(x - s * 0.85, y + s * 0.15)
  ctx.lineTo(x - s * 0.85, y + s * 0.32)
  ctx.lineTo(x, y + s * 0.1)
  ctx.closePath()
  ctx.fill()
  
  ctx.beginPath()
  ctx.moveTo(x, y - s * 0.15)
  ctx.lineTo(x + s * 0.85, y + s * 0.15)
  ctx.lineTo(x + s * 0.85, y + s * 0.32)
  ctx.lineTo(x, y + s * 0.1)
  ctx.closePath()
  ctx.fill()
  
  // Tail Stabilizers
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.45)
  ctx.lineTo(x - s * 0.32, y + s * 0.65)
  ctx.lineTo(x - s * 0.32, y + s * 0.74)
  ctx.lineTo(x, y + s * 0.7)
  ctx.closePath()
  ctx.fill()
  
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.45)
  ctx.lineTo(x + s * 0.32, y + s * 0.65)
  ctx.lineTo(x + s * 0.32, y + s * 0.74)
  ctx.lineTo(x, y + s * 0.7)
  ctx.closePath()
  ctx.fill()
}

/** EAGLE – crossed wings, body, head, beak */
export function drawEagle(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  // Left Wing
  ctx.beginPath()
  ctx.ellipse(x - s * 0.4, y - s * 0.2, s * 0.6, s * 0.25, -0.3, 0, Math.PI * 2)
  ctx.fill()
  // Right Wing
  ctx.beginPath()
  ctx.ellipse(x + s * 0.4, y - s * 0.2, s * 0.6, s * 0.25, 0.3, 0, Math.PI * 2)
  ctx.fill()
  // Body
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.1, s * 0.18, s * 0.38, 0, 0, Math.PI * 2)
  ctx.fill()
  // Head
  ctx.beginPath()
  ctx.arc(x, y - s * 0.35, s * 0.12, 0, Math.PI * 2)
  ctx.fill()
  // Beak
  ctx.beginPath()
  ctx.moveTo(x, y - s * 0.4)
  ctx.lineTo(x - s * 0.15, y - s * 0.32)
  ctx.lineTo(x, y - s * 0.3)
  ctx.closePath()
  ctx.fill()
}

/** HEART – classic heart shape */
export function drawHeart(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  ctx.beginPath()
  ctx.moveTo(x, y - s * 0.25)
  ctx.bezierCurveTo(x - s * 0.45, y - s * 0.65, x - s * 0.8, y - s * 0.2, x, y + s * 0.5)
  ctx.bezierCurveTo(x + s * 0.8, y - s * 0.2, x + s * 0.45, y - s * 0.65, x, y - s * 0.25)
  ctx.closePath()
  ctx.fill()
}

/** DEER – head with snout, antlers and ears */
export function drawDeer(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  // Head / Snout
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.15, s * 0.22, s * 0.35, 0.2, 0, Math.PI * 2)
  ctx.fill()
  // Left Antler
  ctx.beginPath()
  ctx.ellipse(x - s * 0.2, y - s * 0.4, s * 0.08, s * 0.38, -0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(x - s * 0.38, y - s * 0.55, s * 0.05, s * 0.2, -0.7, 0, Math.PI * 2)
  ctx.fill()
  // Right Antler
  ctx.beginPath()
  ctx.ellipse(x + s * 0.2, y - s * 0.4, s * 0.08, s * 0.38, 0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(x + s * 0.38, y - s * 0.55, s * 0.05, s * 0.2, 0.7, 0, Math.PI * 2)
  ctx.fill()
  // Ears
  ctx.beginPath()
  ctx.ellipse(x - s * 0.3, y - s * 0.1, s * 0.22, s * 0.08, 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(x + s * 0.3, y - s * 0.1, s * 0.22, s * 0.08, -0.2, 0, Math.PI * 2)
  ctx.fill()
}

/** SWORD – tip, blade, guard, hilt, pommel */
export function drawSword(ctx, x, y, size = 1) {
  const s = size * 80
  applyShadowStyle(ctx)
  // Blade
  ctx.beginPath()
  ctx.moveTo(x - s * 0.08, y + s * 0.2)
  ctx.lineTo(x - s * 0.08, y - s * 0.8)
  ctx.lineTo(x, y - s * 0.95) // Tip
  ctx.lineTo(x + s * 0.08, y - s * 0.8)
  ctx.lineTo(x + s * 0.08, y + s * 0.2)
  ctx.closePath()
  ctx.fill()
  // Guard
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.22, s * 0.25, s * 0.05, 0, 0, Math.PI * 2)
  ctx.fill()
  // Hilt/Grip
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.45, s * 0.04, s * 0.18, 0, 0, Math.PI * 2)
  ctx.fill()
  // Pommel
  ctx.beginPath()
  ctx.arc(x, y + s * 0.65, s * 0.07, 0, Math.PI * 2)
  ctx.fill()
}

export const SHADOW_DRAWERS = {
  rabbit: drawRabbit,
  dog: drawDog,
  bird: drawBird,
  butterfly: drawButterfly,
  snake: drawSnake,
  goat: drawGoat,
  fox: drawFox,
  horse: drawHorse,
  spider: drawSpider,
  donkey: drawDonkey,
  pig: drawPig,
  lizard: drawLizard,
  eagle: drawEagle,
  deer: drawDeer,
  scissors: drawScissors,
  glasses: drawGlasses,
  cup: drawCup,
  crown: drawCrown,
  airplane: drawAirplane,
  heart: drawHeart,
  sword: drawSword,
}
