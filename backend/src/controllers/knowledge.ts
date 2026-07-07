import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/auth';

// --- Categories ---

export const getCategories = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const categories = await prisma.resourceCategory.findMany({
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    const existing = await prisma.resourceCategory.findUnique({ where: { name } });
    if (existing) {
      res.status(400).json({ status: 'fail', message: 'Category with this name already exists' });
      return;
    }

    const category = await prisma.resourceCategory.create({
      data: { name, description },
    });

    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description } = req.body;

    const existing = await prisma.resourceCategory.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Category not found' });
      return;
    }

    const category = await prisma.resourceCategory.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
      },
    });

    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.resourceCategory.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Category not found' });
      return;
    }

    await prisma.resourceCategory.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Articles ---

export const getArticles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { category, type, tag, search } = req.query;

    const where: any = { status: 'published' };

    if (category) where.categoryId = category;
    if (type) where.type = type;
    if (tag) where.tags = { has: tag as string };
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const articles = await prisma.knowledgeArticle.findMany({
      where,
      include: {
        category: true,
        _count: { select: { bookmarks: true } },
      },
      orderBy: [{ viewCount: 'desc' }, { createdAt: 'desc' }],
    });

    res.status(200).json({ status: 'success', data: articles });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const article = await prisma.knowledgeArticle.findUnique({
      where: { id },
      include: {
        category: true,
        _count: { select: { bookmarks: true } },
      },
    });

    if (!article) {
      res.status(404).json({ status: 'fail', message: 'Article not found' });
      return;
    }

    // Increment view count
    await prisma.knowledgeArticle.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    res.status(200).json({ status: 'success', data: { ...article, viewCount: article.viewCount + 1 } });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, content, type, categoryId, author, duration, tags, url } = req.body;

    const category = await prisma.resourceCategory.findUnique({ where: { id: categoryId } });
    if (!category) {
      res.status(400).json({ status: 'fail', message: 'Category not found' });
      return;
    }

    const article = await prisma.knowledgeArticle.create({
      data: {
        title,
        description,
        content,
        type,
        categoryId,
        author,
        duration,
        tags,
        url,
      },
      include: { category: true },
    });

    res.status(201).json({ status: 'success', data: article });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, content, type, categoryId, author, duration, tags, url, status } = req.body;

    const existing = await prisma.knowledgeArticle.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Article not found' });
      return;
    }

    const article = await prisma.knowledgeArticle.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(type !== undefined && { type }),
        ...(categoryId !== undefined && { categoryId }),
        ...(author !== undefined && { author }),
        ...(duration !== undefined && { duration }),
        ...(tags !== undefined && { tags }),
        ...(url !== undefined && { url }),
        ...(status !== undefined && { status }),
      },
      include: { category: true },
    });

    res.status(200).json({ status: 'success', data: article });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.knowledgeArticle.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Article not found' });
      return;
    }

    await prisma.knowledgeArticle.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Bookmarks ---

export const getBookmarks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const bookmarks = await prisma.userBookmark.findMany({
      where: { userId },
      include: {
        article: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: bookmarks });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const addBookmark = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const articleId = req.params.articleId as string;

    const article = await prisma.knowledgeArticle.findUnique({ where: { id: articleId } });
    if (!article) {
      res.status(404).json({ status: 'fail', message: 'Article not found' });
      return;
    }

    const existing = await prisma.userBookmark.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });

    if (existing) {
      res.status(400).json({ status: 'fail', message: 'Already bookmarked' });
      return;
    }

    const bookmark = await prisma.userBookmark.create({
      data: { userId, articleId },
      include: { article: true },
    });

    res.status(201).json({ status: 'success', data: bookmark });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const removeBookmark = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const articleId = req.params.articleId as string;

    const bookmark = await prisma.userBookmark.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });

    if (!bookmark) {
      res.status(404).json({ status: 'fail', message: 'Bookmark not found' });
      return;
    }

    await prisma.userBookmark.delete({
      where: { id: bookmark.id },
    });

    res.status(200).json({ status: 'success', message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Search ---

export const searchArticles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({ status: 'fail', message: 'Search query is required' });
      return;
    }

    const articles = await prisma.knowledgeArticle.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } },
          { content: { contains: q as string, mode: 'insensitive' } },
          { tags: { has: q as string } },
        ],
      },
      include: { category: true },
      orderBy: { viewCount: 'desc' },
    });

    res.status(200).json({ status: 'success', data: articles });
  } catch (error) {
    console.error('Search articles error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
