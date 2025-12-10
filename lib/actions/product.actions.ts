import { PrismaClient } from '@prisma/client';
import { convertToPlainObject } from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { prisma } from '@/db/prisma';

/**
 * Возвращает список последних продуктов через Prisma
 */
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
}

/**
 * Возвращает продукт по slug
 */
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug },
  });
  return product ? convertToPlainObject(product) : null;
}

/**
 * Next.js getServerSideProps для страницы /
 * Используем SSR, чтобы не падал build при prerender
 */
export async function getServerSideProps() {
  try {
    const products = await getLatestProducts();

    return {
      props: { products },
    };
  } catch (error) {
    console.error('Error fetching latest products:', error);

    return {
      props: { products: [] }, // fallback при ошибке
    };
  }
}