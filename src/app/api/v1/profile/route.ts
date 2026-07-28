import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';

import { userService } from '@/services/user/user.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { UpdateProfileSchema } from '@/lib/user/user.schema';

export const GET = withErrorHandler(
  authenticate(async (req: NextRequest) => {
    const ctx = getRequestContext();
    const tenantId = ctx?.identity?.tenantId;
    const userId = ctx?.identity?.id;

    if (!tenantId || !userId) {
      throw new Error('Unauthorized');
    }

    const profile = await userService.getProfile(tenantId, userId);

    // Remove password

    const { password, ...safeProfile } = profile;

    return NextResponse.json({ data: safeProfile });
  }),
);

export const PATCH = withErrorHandler(
  authenticate(async (req: NextRequest) => {
    const ctx = getRequestContext();
    const tenantId = ctx?.identity?.tenantId;
    const userId = ctx?.identity?.id;

    if (!tenantId || !userId) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const parsedBody = UpdateProfileSchema.parse(body);

    const updatedProfile = await userService.updateProfile(tenantId, userId, parsedBody);

    // Remove password

    const { password, ...safeProfile } = updatedProfile;

    return NextResponse.json({ message: 'Profile updated successfully', data: safeProfile });
  }),
);
