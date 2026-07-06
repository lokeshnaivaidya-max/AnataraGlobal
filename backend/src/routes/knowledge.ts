import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate, restrictTo } from '../middlewares/auth';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getBookmarks,
  addBookmark,
  removeBookmark,
  searchArticles,
} from '../controllers/knowledge';

const router = Router();

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    description: z.string().optional(),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
});

const createArticleSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    content: z.string().optional(),
    type: z.string().optional(),
    categoryId: z.string().min(1, 'Category is required'),
    author: z.string().optional(),
    duration: z.string().optional(),
    tags: z.array(z.string()).optional(),
    url: z.string().url().optional().or(z.literal('')),
  }),
});

const updateArticleSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    content: z.string().optional(),
    type: z.string().optional(),
    categoryId: z.string().optional(),
    author: z.string().optional(),
    duration: z.string().optional(),
    tags: z.array(z.string()).optional(),
    url: z.string().url().optional().or(z.literal('')),
    status: z.string().optional(),
  }),
});

// Public routes (no auth needed)
router.get('/categories', getCategories);
router.get('/articles', getArticles);
router.get('/articles/:id', getArticle);
router.get('/search', searchArticles);

// Protected routes (auth required)
router.post('/bookmarks/:articleId', authenticate, addBookmark);
router.get('/bookmarks', authenticate, getBookmarks);
router.delete('/bookmarks/:articleId', authenticate, removeBookmark);

// Admin only
router.post('/categories', authenticate, restrictTo('Admin', 'Super Admin'), validateRequest(createCategorySchema), createCategory);
router.put('/categories/:id', authenticate, restrictTo('Admin', 'Super Admin'), validateRequest(updateCategorySchema), updateCategory);
router.delete('/categories/:id', authenticate, restrictTo('Admin', 'Super Admin'), deleteCategory);

router.post('/articles', authenticate, restrictTo('Admin', 'Super Admin'), validateRequest(createArticleSchema), createArticle);
router.put('/articles/:id', authenticate, restrictTo('Admin', 'Super Admin'), validateRequest(updateArticleSchema), updateArticle);
router.delete('/articles/:id', authenticate, restrictTo('Admin', 'Super Admin'), deleteArticle);

export default router;
