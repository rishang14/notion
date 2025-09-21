import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateManyInputSchema } from '../inputTypeSchemas/CustomerCreateManyInputSchema'

export const CustomerCreateManyArgsSchema: z.ZodType<Prisma.CustomerCreateManyArgs> = z.object({
  data: z.union([ CustomerCreateManyInputSchema,CustomerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export default CustomerCreateManyArgsSchema;
