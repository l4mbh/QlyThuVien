import api from './api';
import { createCategoryApi } from '@qltv/shared';

export const categoryService = createCategoryApi(api);
