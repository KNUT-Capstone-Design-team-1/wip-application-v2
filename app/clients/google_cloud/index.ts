import { NearbyPharmacyClient } from "../cloud-flare/nearby_pharmacy_client";
import { DLServerClient } from "./dl_server_client";
import { DrugDetailClient } from "./drug_detail";
import { GeminiImageSearchClient } from "./gemini_image_search_client";
import { InitInfoClient } from "./init_info_client";
import { MarkImageClient } from "./mark_image_client";

type TClientType = "initial-info" | "image-search" | "image-search-v2" | "drug-detail" | "nearby-pharmacy" | "mark-image";

export function getClient(clientType: TClientType) {
  switch (clientType) {
    case "initial-info":
      return new InitInfoClient();

    case "image-search":
      return new DLServerClient();

    case "image-search-v2":
      return new GeminiImageSearchClient();

    case "drug-detail":
      return new DrugDetailClient();

    case "nearby-pharmacy":
      return new NearbyPharmacyClient();

    case "mark-image":
      return new MarkImageClient();

    default:
      throw new Error(`invalid client type ${clientType}`);
  }
}
