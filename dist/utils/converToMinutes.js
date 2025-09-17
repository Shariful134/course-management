"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertToMinutes = (time) => {
    const [hourMinute, meridian] = time.split(' ');
    let [hours, minutes] = hourMinute.split(':').map(Number);
    if (meridian.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
    }
    if (meridian.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }
    return hours * 60 + minutes;
};
exports.default = convertToMinutes;
