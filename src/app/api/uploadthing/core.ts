import fs from 'fs';
import path from 'path';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { z } from 'zod';

import { authService } from '@/services/auth/auth.service';
import { prisma } from '@/lib/prisma';
import { AuditService } from '@/services/audit/audit.service';

const f = createUploadthing();

function logError(msg: string, err?: any) {
  try {
    fs.appendFileSync(
      path.join(process.cwd(), 'uploadthing-error.log'),
      `[${new Date().toISOString()}] ${msg} - ${err ? String(err) : ''}\n`
    );
  } catch (e) {}
}

export const uploadRouter = {
  ticketAttachment: f({
    image: { maxFileSize: '16MB', maxFileCount: 4 },
    pdf: { maxFileSize: '16MB', maxFileCount: 4 },
    text: { maxFileSize: '16MB', maxFileCount: 4 },
    blob: { maxFileSize: '16MB', maxFileCount: 4 },
  })
    .input(z.object({ ticketId: z.string(), accessToken: z.string() }))
    .middleware(async ({ req, input }) => {
      logError('Upload middleware started', `ticketId: ${input.ticketId}`);
      if (!input.accessToken) {
        logError('Missing access token');
        throw new UploadThingError('Unauthorized: Missing access token');
      }

      let payload;
      try {
        payload = await authService.authenticate(input.accessToken);
      } catch (err: any) {
        logError('Auth service failed', err.stack || err.message);
        throw new UploadThingError('Unauthorized: Invalid access token');
      }

      const { ticketId } = input;

      try {
        const ticket = await prisma.ticket.findFirst({
          where: { id: ticketId, tenantId: payload.tenantId },
        });

        if (!ticket) {
          logError(`Ticket not found for tenant`, `ticketId: ${ticketId}, tenantId: ${payload.tenantId}`);
          throw new UploadThingError('Not Found: Ticket not found or access denied');
        }

        return { uploaderId: payload.sub, tenantId: payload.tenantId, ticketId };
      } catch (dbErr: any) {
        logError('DB error in middleware', dbErr.stack || dbErr.message);
        throw new UploadThingError('Internal server error');
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        logError('onUploadComplete started', `ticketId: ${metadata.ticketId}`);
        const { ticketId, uploaderId, tenantId } = metadata;

        const attachment = await prisma.ticketAttachment.create({
          data: {
            ticketId,
            filename: file.name,
            size: file.size,
            mimeType: (file as any).type || 'application/octet-stream',
            url: file.url,
            uploaderId,
          },
        });

        logError('Attachment created in DB', attachment.id);

        // Log the upload action
        await AuditService.log({
          entity: 'TicketAttachment',
          entityId: attachment.id,
          action: 'ATTACHMENT_UPLOADED',
          actorId: uploaderId,
          after: {
            ticketId,
            filename: file.name,
            url: file.url,
          },
        });

        return { uploadedBy: uploaderId, url: file.url };
      } catch (err: any) {
        logError('onUploadComplete error', err.stack || err.message);
        throw err;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
