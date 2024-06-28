import { useAtom, useAtomValue } from "jotai";
import { tokenAtom } from "../atoms";
import { TAccount, convertAccount } from "./connection";
import { useQuery } from "@tanstack/react-query";

const getMuteAccounts = async (accessToken: string): Promise<TAccount[]> => {
  const res = await fetch("https://truthsocial.com/api/v1/mutes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(async (r) => {
    const resJson: unknown[] = await r.json();
    return resJson.map((account) => convertAccount(account));
  });

  return res;
};

export const useGetMuteAccounts = () => {
  const accessToken = useAtomValue(tokenAtom);

  return useQuery({
    queryKey: ["muteAccounts"],
    queryFn: () => getMuteAccounts(accessToken),
    staleTime: 1000 * 60 * 5,
  });
};

export const AccountListToIdList = (accounts: TAccount[]): string[] => {
  return accounts.map((account) => account.id);
};
