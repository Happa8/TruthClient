import { ColumnsAtom } from "@/src/atoms";
import { useAccount } from "@/src/hooks/connection";
import { useAtom } from "jotai";
import { FC } from "react";
import LineWrapper from "./LineWrapper";
import LineHeader from "./LineHeader";
import LineContent from "./LineContent";
import DetailAccount from "../Account/DetailAccount";

type Props = {
  userId: string;
  columnIndex: number;
};

export const UserLine: FC<Props> = ({ userId, columnIndex }) => {
  const { status, data } = useAccount({ id: userId });

  const [_, dispatch] = useAtom(ColumnsAtom);

  return (
    <LineWrapper>
      <LineHeader
        onClickClose={() => {
          dispatch({ type: "delete", index: columnIndex });
        }}
      >
        Account Detail
      </LineHeader>
      <LineContent>
        {status === "success" ? (
          <DetailAccount dataAtom={data} />
        ) : (
          "Now Loading..."
        )}
      </LineContent>
    </LineWrapper>
  );
};
