import { Schema, SchemaType } from 'mongoose';
import z from 'zod';

export type ZodFieldsRecord = Record<string, z.ZodTypeAny>;

export function getZodType(schemaType: SchemaType): z.ZodTypeAny {
  const instance = schemaType.instance || schemaType.constructor.name;

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
      return z.date();
    case 'ObjectID':
      return z.string().regex(/^[\dA-Fa-f]{24}$/);
    default:
      return z.string();
  }
}

export function mongooseToZod(schema: Schema): z.ZodObject<ZodFieldsRecord> {
  const zodFields: ZodFieldsRecord = {};

  schema.eachPath((path: string, schemaType: SchemaType) => {
    // Handle _id
    if (path === '_id') zodFields['_id'] = z.string();
    // Handle __v
    if (path === '__v') return;
    // TODO: Handle createdAt and updatedAt (Handle properly)
    if (path === 'createdAt') return;
    if (path === 'updatedAt') return;

    let zodType: z.ZodTypeAny;

    // Handle array types
    if (schemaType instanceof Schema.Types.Array) {
      const itemType = schemaType.schema?.paths ?? schemaType.caster;
      zodType = z.array(getZodType(itemType as unknown as SchemaType));
    } else {
      zodType = getZodType(schemaType);
    }

    // Handle required/optional
    if (schemaType.isRequired != null && !schemaType.isRequired) {
      zodType = zodType.optional();
    }

    zodFields[path] = zodType;
  });

  return z.object(zodFields);
}
