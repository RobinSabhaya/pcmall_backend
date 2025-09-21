import { Schema, SchemaType } from 'mongoose';
import z, { ZodObject, ZodString } from 'zod';

export type ZodFieldsRecord = Record<string, z.ZodTypeAny>;

export interface IRefOptions {
  allowPopulated?: boolean;
  populatedSchemas?: Record<string, Schema>;
}

// eslint-disable-next-line complexity
export function getZodType(
  schemaType: SchemaType,
  options: IRefOptions = {}
): z.ZodTypeAny {
  const instance = schemaType.instance || schemaType.constructor.name;

  const nestedType = getNestedSchemaZodType(schemaType, options);
  if (nestedType) {
    return nestedType;
  }

  switch (instance) {
    case 'String': {
      if (schemaType.options?.enum != null) {
        const enumValues = schemaType.options.enum as readonly [
          string,
          ...string[],
        ];
        return z.enum(enumValues);
      }
      return z.string();
    }
    case 'Number':
      return z.number();
    case 'Boolean':
      return z.boolean();
    case 'Date':
      return z.string();
    case 'ObjectID':
      return createObjectIdSchema();
    default:
      return z.string();
  }
}

export function mongooseToZod(
  schema: Schema,
  options: IRefOptions = {}
): z.ZodObject<ZodFieldsRecord> {
  const zodFields: ZodFieldsRecord = {};

  schema.eachPath((path: string, schemaType: SchemaType) => {
    // Handle __v
    if (path === '__v') return z.number();
    if (path === 'createdAt') return z.string();
    if (path === 'updatedAt') return z.string();
    if (path === 'deletedAt') return z.union([z.string(), z.null()]);

    let zodType: z.ZodTypeAny;

    // Handle array types
    if (schemaType instanceof Schema.Types.Array) {
      const itemType = schemaType.schema?.paths ?? schemaType.caster;
      zodType = z.array(getZodType(itemType as unknown as SchemaType, options));
    } else {
      zodType = getZodType(schemaType, options);
    }

    // Handle required/optional
    if (schemaType.isRequired == null || !schemaType.isRequired) {
      zodType = zodType.optional();
    }

    zodFields[path] = zodType;
  });

  return z.object(zodFields);
}

export function createSchemaWithRefs(
  schema: Schema,
  referencedSchemas: Record<string, Schema>
): ZodObject<ZodFieldsRecord> {
  return mongooseToZod(schema, {
    allowPopulated: true,
    populatedSchemas: referencedSchemas,
  });
}

export function createObjectIdSchema(): ZodString {
  return z.string().regex(/^[\dA-Fa-f]{24}$/, 'Invalid ObjectId format');
}

export function getNestedSchemaZodType(
  schemaType: SchemaType,
  options: IRefOptions
): z.ZodUnion | z.ZodString | null {
  if (schemaType.options?.ref != null) {
    const refModel = schemaType.options.ref as string;
    if (options.allowPopulated != null) {
      if (options.populatedSchemas?.[refModel]) {
        const populatedSchema = mongooseToZod(
          options.populatedSchemas[refModel],
          { ...options, allowPopulated: false }
        );
        return z.union([populatedSchema, createObjectIdSchema()]);
      } else {
        const genericPopulatedSchema = z
          .object({
            _id: createObjectIdSchema(),
          })
          .loose();

        return z.union([createObjectIdSchema(), genericPopulatedSchema]);
      }
    }

    return createObjectIdSchema();
  }

  return null;
}

// TODO: move to unit test
// export const testPayload ={
//     results: [
//       {
//         _id: '68c19f8be004f3abac4b0439',
//         tags: ['watches', "women's watches"],
//         title: "Women's Wrist Watch",
//         brand: {
//           _id: '68c19f8be004f3abac4b0436',
//           name: 'Fashion Co.',
//           slug: 'Fashion Co.',
//           certifications: [],
//           createdAt: '2025-09-10T15:55:55.907Z',
//           isVerified: false,
//           ratingCount: 0,
//           status: 'ACTIVE',
//           totalRating: 0,
//           updatedAt: '2025-09-17T15:57:28.841Z',
//           viewCount: 0,
//         },
//         category: {
//           _id: '68c19f8be004f3abac4b042c',
//           tags: ['watches', "women's watches"],
//           categoryName: 'womens-watches',
//           __v: 0,
//           createdAt: '2025-09-10T15:55:55.894Z',
//           deletedAt: null,
//           subCategory: [],
//           updatedAt: '2025-09-17T15:57:28.842Z',
//         },
//         description:
//           "The Women's Wrist Watch is a versatile and fashionable timepiece for everyday wear. With a comfortable strap and a simple yet elegant design, it complements various styles.",
//         slug: "Women's Wrist Watch",
//         approvalStatus: 'PENDING',
//         createdAt: '2025-09-10T15:55:55.911Z',
//         isPublished: false,
//         updatedAt: '2025-09-17T15:57:28.843Z',
//         createdBy: '68c19f8be004f3abac4b0436',
//         updatedBy: '68c19f8be004f3abac4b0436',
//         modelNumber: '123',
//       },
//     ],
//     totalResults: 194,
//     page: 1,
//     limit: 10,
//     totalPages: 20,
// };

// const schema = createSchemaWithRefs(productSchema, {
//   brand : brandSchema,
//   category: categorySchema
// })

// const subSchema = createSchemaWithRefs(productSchema,
//       {
//         brand : brandSchema,
//         category: categorySchema
// })

// const schema = z.object({
//     results : z.array(subSchema),
//     totalResults: z.number(),
//     page: z.number(),
//     limit: z.number(),
//     totalPages: z.number(),
//   })

// console.log(
//   schema.parse(testPayload)
// )
