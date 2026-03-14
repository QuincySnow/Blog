import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
				description: z.string(),
				pubDatetime: z.coerce.date(),
				modDatetime: z.coerce.date().optional(),
				draft: z.boolean().optional(),
				tags: z.array(z.string()).optional(),
				heroImage: z.optional(image()),
			})
			.transform((data) => ({
				...data,
				pubDate: data.pubDatetime,
				updatedDate: data.modDatetime,
			})),
});

export const collections = { blog };
