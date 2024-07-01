import { cva } from "@/styled-system/css";
import { FC } from "react";
import { TPostAtom } from "@/src//hooks/connection";
import { useAtom } from "jotai";
import Menu, { MenuItem } from "@/src/components/Common/Menu";
import { MdRepeat } from "react-icons/md";
import { useRepost } from "@/src/hooks/post";
import { QuotePostAtom } from "@/src/atoms";

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

  const [_, setQuotePostAtom] = useAtom(QuotePostAtom);

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
          if (data.reblog === null) {
            setData({
              ...data,
              reblogged: !postdata.reblogged,
              reblogsCount: postdata.reblogged
                ? postdata.reblogsCount > 0
                  ? postdata.reblogsCount - 1
                  : postdata.reblogsCount
                : postdata.reblogsCount + 1,
            });
          } else {
            setData({
              ...data,
              reblog: {
                ...data.reblog,
                reblogged: !postdata.reblogged,
                reblogsCount: postdata.reblogged
                  ? postdata.reblogsCount > 0
                    ? postdata.reblogsCount - 1
                    : postdata.reblogsCount
                  : postdata.reblogsCount + 1,
              },
            });
          }

          if (postdata.reblogged) {
            repost({ id: postdata.id, action: "unrepost" });
          } else {
            repost({ id: postdata.id, action: "repost" });
          }
        }}
      >
        {postdata.reblogged ? "Undo ReTruth" : "ReTruth"}
      </MenuItem>
      <MenuItem
        value="quote"
        onClick={() => {
          setQuotePostAtom(dataAtom);
        }}
      >
        Quote Truth
      </MenuItem>
    </Menu>
  );
};

export default RepostIconButton;
