/**
 * 格式化时间戳为 M:D H:M
 */
export function formatTime(time, space = false) {
    const thisTime = new Date(time)
    const startTime = new Date(new Date().toLocaleDateString()).getTime() // 当天 0 点
    const endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 // 当天 24 点

    if (startTime < time && time < endTime) {
        return space ? `今天${addZeroForDay(thisTime.getHours())}:${addZeroForDay(thisTime.getMinutes())}` : `今天 ${addZeroForDay(thisTime.getHours())}:${addZeroForDay(thisTime.getMinutes())}`
    } else {
        return space ? `${thisTime.getMonth() + 1}月${thisTime.getDate()}日${addZeroForDay(thisTime.getHours())}:${addZeroForDay(thisTime.getMinutes())}` : `${thisTime.getMonth() + 1}月${thisTime.getDate()}日 ${addZeroForDay(thisTime.getHours())}:${addZeroForDay(thisTime.getMinutes())}`
    }
}

/**
 * 日期补 0 操作
 */
export function addZeroForDay(num) {
    return num < 10 ? '0' + num : num
}

let timeHandler = false

export function debounceForFunction(time = 1000) {
    if (timeHandler) {
        return true
    }
    timeHandler = true
    setTimeout(() => {
        timeHandler = false
    }, time)
    return false
}