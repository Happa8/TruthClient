import { ReplyPostAtom } from "@/src/atoms";
import { TPostAtom } from "@/src/hooks/connection";
import { css } from "@/styled-system/css";
import { useAtom } from "jotai";
import { FC } from "react";
import { MdOutlineModeComment } from "react-icons/md";

type Props = {
  dataAtom: TPostAtom;
};

const ReplyIconButton: FC<Props> = ({ dataAtom }) => {
  // 投稿データをatomから取得
  const [data, setData] = useAtom(dataAtom);
  const postdata = data.reblog !== null ? data.reblog : data;

  // 投稿欄にリプライ投稿情報を表示
  const [_, setReplyPost] = useAtom(ReplyPostAtom);

  return (
    <span
      className={css({
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
      })}
      onClick={(e) => {
        e.stopPropagation();
        setReplyPost(dataAtom);
      }}
    >
      <MdOutlineModeComment /> {postdata.repliesCount}
    </span>
  );
};

export default ReplyIconButton;