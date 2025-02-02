export const playSound = (type) => {
  const audio = new Audio()
  
  switch(type) {
    case "click":
      audio.src = "/sounds/click.mp3"
      break
    case "success":
      audio.src = "/sounds/success.mp3"
      break
    case "error":
      audio.src = "/sounds/error.mp3"
      break
    default:
      return
  }

  audio.play().catch(err => console.log("Audio playback failed:", err))
} 