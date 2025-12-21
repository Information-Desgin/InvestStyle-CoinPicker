import Papa from "papaparse";
import type { RelayerFlowRow } from "../types/csvData";

export function loadRelayerFlow() {
  return new Promise<RelayerFlowRow[]>((resolve, reject) => {
    Papa.parse("/data/relayer-flow-daily-usd.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => resolve(result.data as RelayerFlowRow[]),
      error: reject,
    });
  });
}
