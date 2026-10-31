"use server";

import { actionClient } from "@/lib/safeAction";
import { getMotivationList } from "./services";

export const getMotivationOptionsAction =
  actionClient.action(getMotivationList);
