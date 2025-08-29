import type { ManualReportResponse } from "../types/types";

const uri = `${import.meta.env.VITE_SERVER_URL}/api/cleanup/trigger/`;

export const triggerManualCleanup =
  async (): Promise<ManualReportResponse | null> => {
    try {
      const response = await fetch(uri, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}-${response.statusText}`);
      }
      const json: ManualReportResponse = await response.json();
      return json;
    } catch (error) {
      console.error("Failed to fetch latest report:", error);
      return null;
    }
  };
