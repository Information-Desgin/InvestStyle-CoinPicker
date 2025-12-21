import * as Papa from "papaparse";
import type { BaseInfoRow } from "../types/csvData";

export function loadBaseInfo(): Promise<BaseInfoRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<BaseInfoRow>("/data/base-info-all-chain.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        resolve(result.data as BaseInfoRow[]);
      },
      error: reject,
    });
  });
}
