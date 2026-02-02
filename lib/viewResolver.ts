import type { ViewDirection, TimeKey, ViewConfig } from "./panoramaConfig";

type NestedViews = Partial<Record<TimeKey, Partial<Record<ViewDirection, ViewConfig>>>>;

interface ResolveViewResult {
  view: ViewConfig | null;
  fallbackReason?: string;
}

// Direction priority for fallback
const DIRECTION_PRIORITY: ViewDirection[] = ["central-sea", "marine-line", "stadium"];

// Time priority for fallback
const TIME_PRIORITY: TimeKey[] = ["noon", "sunset", "sunrise", "night"];

/**
 * Type-safe helper to get a view from nested views structure
 */
export function getView(
  views: NestedViews,
  time: TimeKey,
  direction: ViewDirection
): ViewConfig | undefined {
  return views[time]?.[direction];
}

/**
 * Type-safe helper to check if a view exists
 */
export function hasView(
  views: NestedViews,
  time: TimeKey,
  direction: ViewDirection
): boolean {
  return getView(views, time, direction) !== undefined;
}

/**
 * Resolves a view with smart fallback logic
 *
 * Fallback priority:
 * 1. Exact match (requested time + direction)
 * 2. Same time, different direction (priority: central-sea > marine-line > stadium)
 * 3. Same direction, different time (priority: noon > sunset > sunrise > night)
 * 4. Any available view for floor
 * 5. Return null if nothing available
 */
export function resolveView(
  floor: number,
  time: TimeKey,
  direction: ViewDirection,
  floorViews: NestedViews
): ResolveViewResult {
  // 1. Try exact match first
  const exactMatch = getView(floorViews, time, direction);
  if (exactMatch) {
    return { view: exactMatch };
  }

  // 2. Same time, different direction
  for (const dir of DIRECTION_PRIORITY) {
    if (dir === direction) continue; // Skip the already-tried direction

    const view = getView(floorViews, time, dir);
    if (view) {
      return {
        view,
        fallbackReason: `${direction} view not available at ${time}, showing ${dir} instead`
      };
    }
  }

  // 3. Same direction, different time
  for (const t of TIME_PRIORITY) {
    if (t === time) continue; // Skip the already-tried time

    const view = getView(floorViews, t, direction);
    if (view) {
      return {
        view,
        fallbackReason: `${time} view not available for ${direction}, showing ${t} instead`
      };
    }
  }

  // 4. Any available view for floor
  for (const t of TIME_PRIORITY) {
    for (const dir of DIRECTION_PRIORITY) {
      const view = getView(floorViews, t, dir);
      if (view) {
        return {
          view,
          fallbackReason: `Requested view (${time}, ${direction}) not available, showing ${t} ${dir} instead`
        };
      }
    }
  }

  // 5. Return null if nothing available
  return {
    view: null,
    fallbackReason: `No views available for floor ${floor}`
  };
}
