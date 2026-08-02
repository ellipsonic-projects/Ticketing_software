import { z } from 'zod';

export const SLATierSchema = z
  .object({
    responseTimeMinutes: z.number().int().positive('Response time must be greater than 0'),
    resolutionTimeMinutes: z.number().int().positive(),
  })
  .superRefine((data, ctx) => {
    if (data.resolutionTimeMinutes <= data.responseTimeMinutes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Resolution time must be greater than response time',
        path: ['resolutionTimeMinutes'],
      });
    }
    // Max resolution time: 365 days (in minutes)
    const MAX_MINUTES = 365 * 24 * 60;
    if (data.resolutionTimeMinutes > MAX_MINUTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Resolution time cannot exceed 365 days (${MAX_MINUTES} minutes)`,
        path: ['resolutionTimeMinutes'],
      });
    }
  });

export type SLATierInput = z.infer<typeof SLATierSchema>;

export const SLASettingsSchema = z.object({
  businessHoursEnabled: z.boolean(),
});

export type SLASettingsInput = z.infer<typeof SLASettingsSchema>;

export const BusinessHourSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    isOpen: z.boolean(),
    startTime: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    timezone: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isOpen) {
      if (!data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start time is required when business is open',
          path: ['startTime'],
        });
      }
      if (!data.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time is required when business is open',
          path: ['endTime'],
        });
      }

      // Additional validation for start < end if both are present
      if (data.startTime && data.endTime) {
        const start = new Date(`1970-01-01T${data.startTime}:00Z`);
        const end = new Date(`1970-01-01T${data.endTime}:00Z`);
        if (start >= end) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Start time must be before end time',
            path: ['startTime'],
          });
        }
      }
    } else {
      // If closed, ensure times are null
      if (data.startTime) {
        data.startTime = null;
      }
      if (data.endTime) {
        data.endTime = null;
      }
    }
  });

export const BusinessHoursSchema = z
  .array(BusinessHourSchema)
  .length(7, 'Must provide exactly 7 days of business hours');

export type BusinessHoursInput = z.infer<typeof BusinessHoursSchema>;

export const HolidayCreateSchema = z.object({
  name: z.string().min(1, 'Holiday name is required'),
  holidayDate: z.string().datetime().or(z.date()),
});

export type HolidayCreateInput = z.infer<typeof HolidayCreateSchema>;

export const HolidayUpdateSchema = HolidayCreateSchema.partial();

export type HolidayUpdateInput = z.infer<typeof HolidayUpdateSchema>;
