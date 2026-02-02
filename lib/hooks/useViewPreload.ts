import type { FloorConfig, TimeKey, ViewDirection } from "@/lib/panoramaConfig";

/**
 * Resolves the effective image URL for a view (R2 manifest or config).
 *
 * @param floors - Array of all floor configurations
 * @param floorId - The floor ID to find
 * @param time - The time of day key
 * @param direction - The view direction
 * @returns The image URL if found, null otherwise
 */
function resolveImageUrl(
  floors: FloorConfig[],
  floorId: number,
  time: TimeKey,
  direction: ViewDirection
): string | null {
  const floor = floors.find((f) => f.id === floorId);
  if (!floor) return null;

  const timeViews = floor.views[time];
  if (!timeViews) return null;

  const viewConfig = timeViews[direction];
  if (!viewConfig) return null;

  return viewConfig.image ?? null;
}

/**
 * Custom hook for preloading adjacent panorama view images
 * Preloads images on hover for instant switching between views
 *
 * @param floors - Array of all floor configurations
 * @returns Object containing the preloadView function
 *
 * @example
 * const { preloadView } = useViewPreload(floors);
 *
 * // Preload on hover
 * <button onMouseEnter={() => preloadView(6, "noon", "marine-line")}>
 *   Marine Line View
 * </button>
 */
export function useViewPreload(floors: FloorConfig[]) {
  /**
   * Preloads a specific view image by creating a new Image object
   * Errors are handled silently to avoid breaking the UI
   *
   * @param floorId - The floor ID
   * @param time - The time of day
   * @param direction - The view direction
   */
  const preloadView = (
    floorId: number,
    time: TimeKey,
    direction: ViewDirection
  ): void => {
    const imageUrl = resolveImageUrl(floors, floorId, time, direction);

    if (!imageUrl) {
      // Silently return if no image URL is found
      return;
    }

    try {
      const img = new Image();

      // Set crossOrigin for remote images to avoid CORS issues
      if (/^https?:\/\//i.test(imageUrl)) {
        img.crossOrigin = "anonymous";
      }

      // Handle errors silently
      img.onerror = () => {
        // Silent error handling - no console logs or alerts
      };

      // Start preloading
      img.src = imageUrl;
    } catch (error) {
      // Silent error handling
    }
  };

  return { preloadView };
}
