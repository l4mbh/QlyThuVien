import api from './api';
import { createBorrowApi } from '@qltv/shared';

export const borrowService = createBorrowApi(api);
