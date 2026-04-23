import { startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

const TIMEZONE = 'Asia/Ho_Chi_Minh';

export class DateHelper {
  /**
   * Get start and end of a month for a given YYYY-MM string
   */
  static getMonthRange(yearMonth: string) {
    // Parse the input (expecting YYYY-MM)
    const date = parseISO(`${yearMonth}-01`);
    
    // Get start and end of month in local JS date (UTC internally)
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    // Adjust to Asia/Ho_Chi_Minh timezone start/end points
    // start: 2024-04-01 00:00:00.000 +0700
    // end:   2024-04-30 23:59:59.999 +0700
    
    return {
      start,
      end
    };
  }

  static now() {
    return toZonedTime(new Date(), TIMEZONE);
  }

  static formatDate(date: Date, formatStr: string = 'yyyy-MM-dd HH:mm:ss') {
    return formatInTimeZone(date, TIMEZONE, formatStr);
  }

  static getTodayRange() {
    const now = new Date();
    const start = new Date(now.setHours(0, 0, 0, 0));
    const end = new Date(now.setHours(23, 59, 59, 999));
    return { start, end };
  }
}
