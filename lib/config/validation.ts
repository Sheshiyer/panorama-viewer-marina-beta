import { z } from "zod";

// Hotspot position schema
export const HotspotPositionSchema = z.object({
  yaw: z.number().min(-180).max(180),
  pitch: z.number().min(-90).max(90),
});

// Hotspot configuration schema
export const HotspotConfigSchema = z.object({
  id: z.string(),
  position: HotspotPositionSchema,
  icon: z.string(),
  title: z.string(),
  content: z.string(), // HTML/Markdown content
  interactionType: z.enum(["click", "hover", "auto"]).default("click"),
  animation: z.enum(["pulse", "bounce", "fade"]).optional(),
});

// View configuration schema
export const ViewConfigSchema = z.object({
  image: z.string().url(),
  alternates: z.array(z.string().url()).optional(),
  fallbackLocal: z.string().optional(),
  defaultYaw: z.number().optional(),
  defaultPitch: z.number().optional(),
  hfov: z.number().min(30).max(150).optional(),
  hotspots: z.array(HotspotConfigSchema).optional(),
});

// Floor configuration schema
export const FloorConfigSchema = z.object({
  id: z.number(),
  label: z.string(),
  views: z.record(
    z.enum(["sunrise", "noon", "sunset", "night"]),
    ViewConfigSchema
  ),
});

// Property metadata schema
export const PropertyMetadataSchema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

// Viewer defaults schema
export const ViewerDefaultsSchema = z.object({
  autoLoad: z.boolean().default(true),
  minHfov: z.number().default(50),
  maxHfov: z.number().default(120),
  defaultHfov: z.number().default(90),
  autoRotate: z.number().default(0),
  inactivityTimeoutMs: z.number().default(8000),
  autoRotateSpeed: z.number().default(-2),
  autoRotateYaw: z.number().default(0),
  autoRotatePitch: z.number().default(0),
  autoRotateHfov: z.number().default(95),
  compass: z.boolean().default(false),
});

// Export types inferred from schemas
export type HotspotPosition = z.infer<typeof HotspotPositionSchema>;
export type HotspotConfig = z.infer<typeof HotspotConfigSchema>;
export type ViewConfig = z.infer<typeof ViewConfigSchema>;
export type FloorConfig = z.infer<typeof FloorConfigSchema>;
export type PropertyMetadata = z.infer<typeof PropertyMetadataSchema>;
export type ViewerDefaults = z.infer<typeof ViewerDefaultsSchema>;

// Validation helper function
export function validatePanoramaConfig(config: {
  floors: unknown[];
  propertyMetadata?: unknown;
  viewerDefaults?: unknown;
}): boolean {
  try {
    z.array(FloorConfigSchema).parse(config.floors);
    if (config.propertyMetadata) {
      PropertyMetadataSchema.parse(config.propertyMetadata);
    }
    if (config.viewerDefaults) {
      ViewerDefaultsSchema.parse(config.viewerDefaults);
    }
    return true;
  } catch (error) {
    console.error("[Config Validation] Errors found:", error);
    return false;
  }
}
