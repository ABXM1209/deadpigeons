export function getCurrentWeek(date = new Date()): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
export function isAfterDrawTime(
    date = new Date(),
    drawDay = 6,      // Saturday
    drawHour = 17     // 17:00
): boolean {
    const local = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Copenhagen" }));
    return local.getDay() === drawDay && local.getHours() >= drawHour;
}

