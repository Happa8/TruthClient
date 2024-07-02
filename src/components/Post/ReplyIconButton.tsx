import { ReplyPostAtom } from "@/src/atoms";
import { TPostAtom } from "@/src/hooks/connection";
import { css } from "@/styled-system/css";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import { MdOutlineModeComment } from "react-icons/md";

type Props = {
  dataAtom: TPostAtom;
  displayCount?: boolean;
};

const ReplyIconButton: FC<Props> = ({ dataAtom, displayCount = true }) => {
  // 投稿データをatomから取得
  const data = useAtomValue(dataAtom);
  const postdata = data.reblog !== null ? data.reblog : data;

  // 投稿欄にリプライ投稿情報を表示
  const [_, setReplyPost] = useAtom(ReplyPostAtom);

  return (
    <button
      className={css({
        display: "inline-flex",
        alignItems: "center",
        color: "gray.700",
        cursor: "pointer",
        gap: 1,
      })}
      onClick={(e) => {
        e.stopPropagation();
        setReplyPost(dataAtom);
      }}
    >
      <MdOutlineModeComment /> {displayCount && postdata.repliesCount}
    </button>
  );
};

export default ReplyIconButton;
