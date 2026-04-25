import api from './api';
import { createBookApi } from '@qltv/shared';

export const bookService = createBookApi(api);
