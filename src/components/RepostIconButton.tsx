import { css, cva, cx } from "@/styled-system/css";
import { FC, ReactNode } from "react";
import { TPostAtom } from "../hooks/connection";
import { useAtom } from "jotai";
import Menu, { MenuItem } from "./Menu";
import { MdRepeat } from "react-icons/md";
import { useRepost } from "../hooks/post";

type Props = {
  dataAtom: TPostAtom;
};

const style = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    cursor: "pointer",
  },
  variants: {
    isRepost: {
      true: {
        color: "green.500",
      },
      false: {},
    },
  },
});

const RepostIconButton: FC<Props> = ({ dataAtom }) => {
  const [data, setData] = useAtom(dataAtom);
  const postdata = data.reblog !== null ? data.reblog : data;

  const { mutateAsync: repost } = useRepost();

  return (
    <Menu
      trigger={
        <span className={style({ isRepost: postdata.reblogged })}>
          <MdRepeat /> {postdata.reblogsCount}
        </span>
      }
    >
      <MenuItem
        value="retruth"
        onClick={() => {
          setData({
            ...data,
            reblogged: !postdata.reblogged,
            reblogsCount: postdata.reblogged
              ? postdata.reblogsCount > 0
                ? postdata.reblogsCount - 1
                : postdata.reblogsCount
              : postdata.reblogsCount + 1,
          });
          if (postdata.reblogged) {
            repost({ id: postdata.id, action: "unrepost" });
          } else {
            repost({ id: postdata.id, action: "repost" });
          }
        }}
      >
        {postdata.reblogged ? "Undo ReTruth" : "ReTruth"}
      </MenuItem>
      <MenuItem value="quote">Quote Truth</MenuItem>
    </Menu>
  );
};

export default RepostIconButton;
