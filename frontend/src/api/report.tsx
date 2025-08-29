import type { Report } from "../types/types";

const uri = `${import.meta.env.VITE_SERVER_URL}/api/reports/`;

export const getLatestReport = async (): Promise<Report | null> => {
  console.log("tried");
  try {
    const response = await fetch(`${uri}latest/`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}-${response.statusText}`);
    }
    const json: Report = await response.json();

    return json;
  } catch (error) {
    console.error("Failed to fetch latest report:", error);
    return null;
  }
};

export const getAllReports = async (): Promise<Report[] | null> => {
  console.log("tried");
  try {
    const response = await fetch(`${uri}all/`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}-${response.statusText}`);
    }
    const json = await response.json();
    const reportlist: Report[] = json.data;
    return reportlist;
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return null;
  }
};
