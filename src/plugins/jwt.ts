import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { status as httpStatus } from 'http-status';
import jwt from 'jsonwebtoken';

import { TOKENTYPES } from '@/helpers/constant.helper';
import { findOneDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IPermission, IRole } from '@/models/auth';
import { IUser } from '@/models/user';
import ApiError from '@/utils/apiErrorHandler';

import { config } from '../config/config';

interface IJwtPayload {
  sub: string;
  type: string;
}

// Pure validation functions
const isValidTokenType = (tokenType: string): boolean =>
  tokenType === TOKENTYPES.ACCESS;

const isActiveUser = (user: IUser | null): boolean => Boolean(user?.is_active);

const hasRequiredRole = (requiredRights: string[], roleSlug: string): boolean =>
  requiredRights.includes(roleSlug);

const isOptionalAuth = (rights: string[]): boolean =>
  rights.includes('optional');

const removeOptionalFromRights = (rights: string[]): string[] =>
  rights.filter(right => right !== 'optional');

// Database operation functions
// const verifyJwtToken = async (request: FastifyRequest): Promise<IJwtPayload> =>
//   request.jwtVerify<IJwtPayload>();

const findUserById = async (userId: string): Promise<IUser | null> =>
  findOneDoc<IUser>(MONGOOSE_MODELS.USER, { _id: userId });

const findUserRole = async (userRoles: string[]): Promise<IRole | null> =>
  findOneDoc<IRole>(MONGOOSE_MODELS.ROLE, { role: { $in: userRoles } });

const findPermissionBySlug = async (
  slugs: string[]
): Promise<IPermission | null> =>
  findOneDoc<IPermission>(MONGOOSE_MODELS.PERMISSION, { slug: { $in: slugs } });

const checkAccessPermission = async (
  permissionId: string,
  userRoles: string[]
): Promise<boolean> => {
  const access = await findOneDoc<IPermission>(
    MONGOOSE_MODELS.ACCESS_PERMISSION,
    {
      permission: permissionId,
      role: { $in: userRoles },
    }
  );
  return Boolean(access);
};

// Authentication functions
const authenticateUser = async (
  request: FastifyRequest
): Promise<IUser | undefined> => {
  let t = '';
  const cookieToken = request?.cookies['t'];
  const authorizationToken = request.headers.authorization?.split(' ')[1];

  if (authorizationToken == null) {
    return;
  }

  if (cookieToken != null) {
    t = cookieToken;
  }

  if (authorizationToken != null) {
    t = authorizationToken;
  }

  const token = jwt.verify(t, config.jwt.secret) as IJwtPayload;

  if (!isValidTokenType(token.type)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
  }

  const user = await findUserById(token.sub);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
  }

  if (!isActiveUser(user)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not active');
  }

  return user;
};

const handleOptionalAuthentication = async (
  request: FastifyRequest,
  requiredRights: string[]
): Promise<string[]> => {
  const user = await authenticateUser(request);
  request.user = user;
  return removeOptionalFromRights(requiredRights);
};

// Authorization functions
const validateUserRole = async (
  user: IUser,
  requiredRights: string[]
): Promise<void> => {
  if (requiredRights.length === 0) return;

  const roleData = await findUserRole(user.roles);

  if (!roleData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  if (!hasRequiredRole(requiredRights, roleData.slug)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient role permissions');
  }
};

const validateUserPermissions = async (
  user: IUser,
  requiredRights: string[]
): Promise<void> => {
  if (requiredRights.length === 0) return;

  const permission = await findPermissionBySlug(requiredRights);

  if (permission) {
    const hasAccess = await checkAccessPermission(
      String(permission?._id),
      user.roles
    );

    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Permission denied');
    }
  }
};

const authorizeUser = async (
  user: IUser,
  requiredRights: string[]
): Promise<void> => {
  await Promise.all([
    validateUserRole(user, requiredRights),
    validateUserPermissions(user, requiredRights),
  ]);
};

// Error handling
const handleAuthError = (error: unknown): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  const message =
    error instanceof Error ? error.message : 'Authentication failed';
  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
};

// Main authorization middleware
const createAuthorizationMiddleware = (...requiredRights: string[]) => {
  return async (request: FastifyRequest): Promise<void> => {
    try {
      const rights = [...requiredRights];

      if (isOptionalAuth(rights)) {
        const filteredRights = await handleOptionalAuthentication(
          request,
          rights
        );

        if (request.user != null && filteredRights.length > 0) {
          await authorizeUser(request.user as IUser, filteredRights);
        }
      } else {
        const user = await authenticateUser(request);
        request.user = user;

        if (user != null && rights.length > 0) {
          await authorizeUser(user, rights);
        }
      }
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };
};

export default fp((fastify: FastifyInstance) => {
  fastify.decorate('authorizeV1', createAuthorizationMiddleware);
});
