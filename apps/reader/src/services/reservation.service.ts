import api from './api';
import { createReservationApi } from '@qltv/shared';

export const reservationService = createReservationApi(api);
