import cron from 'node-cron';

import { errorColor, successColor } from '../../helpers/color.helper';

function everyFiveMinutes(): void {
  console.log(successColor, 'Heartbeat sending successfully');
}

export function cronJobs(): void {
  try {
    cron.schedule('*/5 * * * *', everyFiveMinutes);
  } catch (error: unknown) {
    console.error(errorColor, 'Cron Jobs failed due to:', error);
  }
}
