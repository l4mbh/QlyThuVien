"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const TIMEZONE = 'Asia/Ho_Chi_Minh';
class DateHelper {
    /**
     * Get start and end of a month for a given YYYY-MM string
     */
    static getMonthRange(yearMonth) {
        // Parse the input (expecting YYYY-MM)
        const date = (0, date_fns_1.parseISO)(`${yearMonth}-01`);
        // Get start and end of month in local JS date (UTC internally)
        const start = (0, date_fns_1.startOfMonth)(date);
        const end = (0, date_fns_1.endOfMonth)(date);
        // Adjust to Asia/Ho_Chi_Minh timezone start/end points
        // start: 2024-04-01 00:00:00.000 +0700
        // end:   2024-04-30 23:59:59.999 +0700
        return {
            start,
            end
        };
    }
    static now() {
        return (0, date_fns_tz_1.toZonedTime)(new Date(), TIMEZONE);
    }
    static formatDate(date, formatStr = 'yyyy-MM-dd HH:mm:ss') {
        return (0, date_fns_tz_1.formatInTimeZone)(date, TIMEZONE, formatStr);
    }
    static getTodayRange() {
        const now = new Date();
        const start = new Date(now.setHours(0, 0, 0, 0));
        const end = new Date(now.setHours(23, 59, 59, 999));
        return { start, end };
    }
}
exports.DateHelper = DateHelper;
