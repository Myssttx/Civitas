/**
 * Zod validation schemas for API routes
 */

import { z } from 'zod';

export const checkinSchema = z.object({
  buildingId: z.string().cuid(),
  status: z.enum(['SAFE', 'NEED_HELP', 'CAN_HELP']),
  note: z.string().max(500).optional(),
});

export const helpRequestSchema = z.object({
  buildingId: z.string().cuid(),
  category: z.enum(['Medical', 'Supplies', 'Evacuation', 'Information', 'Other']),
  urgency: z.enum(['Low', 'Normal', 'High', 'Critical']),
  details: z.string().min(10).max(1000),
  sharePreciseLocation: z.boolean(),
  preciseLocation: z
    .object({
      type: z.literal('Point'),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
});

export const taskSchema = z.object({
  buildingId: z.string().cuid(),
  title: z.string().min(5).max(100),
  details: z.string().max(1000).optional(),
  type: z.enum(['Supply', 'Escort', 'Info', 'FirstAid', 'Other']),
});

export const bulletinSchema = z.object({
  buildingId: z.string().cuid(),
  priority: z.enum(['Info', 'Important', 'Critical']),
  body: z.string().min(10).max(2000),
});

export const buildingSchema = z.object({
  name: z.string().min(1).max(100),
  polygon: z.object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
  }),
  floors: z.number().int().min(1).max(50),
  metadata: z.record(z.unknown()).optional(),
});

export const safetyResourceSchema = z.object({
  buildingId: z.string().cuid(),
  type: z.enum(['Shelter', 'AED', 'Stairwell', 'Exit', 'Assembly', 'Clinic']),
  name: z.string().min(1).max(100),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  floor: z.number().int().optional(),
  metadata: z.record(z.unknown()).optional(),
});

