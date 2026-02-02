import { useMemo } from "react";
import type { FloorConfig, TimeKey, ViewDirection } from "@/lib/panoramaConfig";

/**
 * Custom hook to get available view directions for a specific floor and time combination
 *
 * @param floorConfig - The floor configuration object
 * @param timeKey - The time of day key (sunrise, noon, sunset, night)
 * @returns Array of available ViewDirection values for the given floor and time
 *
 * @example
 * const availableDirections = useAvailableDirections(currentFloor, "noon");
 * // Returns: ["central-sea", "marine-line", "stadium"] or subset based on availability
 */
export function useAvailableDirections(
  floorConfig: FloorConfig,
  timeKey: TimeKey
): ViewDirection[] {
  return useMemo(() => {
    const directions: ViewDirection[] = ["central-sea", "marine-line", "stadium"];
    const availableDirections: ViewDirection[] = [];

    // Get the views for this time key
    const timeViews = floorConfig.views[timeKey];

    if (!timeViews) {
      return [];
    }

    // Check each direction to see if it's available
    for (const direction of directions) {
      if (timeViews[direction]) {
        availableDirections.push(direction);
      }
    }

    return availableDirections;
  }, [floorConfig, timeKey]);
}
