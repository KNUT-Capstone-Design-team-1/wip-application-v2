import { atom, RecoilEnv } from "recoil";

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export const admobState = atom({
  key: "admobCountState",
  default: 0
})
