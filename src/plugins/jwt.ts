import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';
import { config } from '@/config/config';
import { IRole, IPermission } from '@/models/auth';
import { IUser } from '@/models/user';
import ApiError from '@/utils/ApiError';
import { findOneDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { TOKEN_TYPES } from '@/helpers/constant.helper';

interface JwtPayload {
  sub: string;
  type: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    authorizeV1: (
      ...requiredRights: string[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  // Register JWT plugin
  fastify.register(import('@fastify/jwt'), {
    secret: config.jwt.secret!,
  });

  /**
   * Combined Auth, Role & Permission Middleware
   */
  fastify.decorate('authorizeV1', (...requiredRights: string[]) => {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        let requireRights = [...requiredRights];
        const token = await request.jwtVerify<JwtPayload>();
        const user = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, { _id: token.sub });

        // ✅ Handle optional authentication
        if (requireRights.includes('optional')) {
          try {
            if (user) {
              request.user = user;
              requireRights = requireRights.filter((r) => r !== 'optional');
            } else {
              return; // No user -> allow public access
            }
          } catch {
            return; // No token -> allow public access
          }
        } else {
          // ✅ Force authentication for non-optional routes
          if (token.type !== TOKEN_TYPES.ACCESS) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
          }
          if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
          }
          request.user = user;
        }

        if (!user) return; // For optional routes without token

        // ✅ Role check
        const roleData = await findOneDoc<IRole>(MONGOOSE_MODELS.ROLE, {
          role: { $in: user.roles },
        });
        if (!roleData) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
        }

        if (!requireRights.includes(roleData.slug)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'FORBIDDEN');
        }

        if (!user.is_active) {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not active');
        }

        // ✅ Permission check (if permission slug exists in DB)
        const permissionExists = await findOneDoc<IPermission>(MONGOOSE_MODELS.PERMISSION, {
          slug: requireRights,
        });
        if (permissionExists) {
          const accessPermission = await findOneDoc(MONGOOSE_MODELS.ACCESS_PERMISSION, {
            permission: permissionExists._id,
            role: user.roles,
          });

          if (!accessPermission) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Permission denied');
          }
        }
      } catch (error) {
        return reply.code(httpStatus.FORBIDDEN).send({
          message: (error as ApiError).message || 'FORBIDDEN',
        });
      }
    };
  });
});
