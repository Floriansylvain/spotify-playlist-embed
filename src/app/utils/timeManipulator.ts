export function getTimeLength(milliseconds: number): string {
    let seconds = Math.floor(milliseconds / 1000)
    let minutes = Math.floor(seconds / 60)
    let remainingSeconds = seconds % 60
    let secondsDisplay = `${remainingSeconds}`
    if (remainingSeconds < 10) {
        secondsDisplay = `0${secondsDisplay}`
    }
    return `${minutes}:${secondsDisplay}`
}
