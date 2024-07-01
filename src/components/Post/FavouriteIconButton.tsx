import { TPostAtom } from "@/src/hooks/connection";
import { useFavouritePost } from "@/src/hooks/post";
import { cva } from "@/styled-system/css";
import { useAtom } from "jotai";
import { ComponentProps, FC } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

type Props = {
  dataAtom: TPostAtom;
  displayCount?: boolean;
} & ComponentProps<"button">;

const style = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    cursor: "pointer",
    color: "gray.700",
  },
  variants: {
    isFavourite: {
      true: {
        color: "red.500",
      },
      false: {},
    },
  },
});

const FavouriteIconButton: FC<Props> = ({
  dataAtom,
  displayCount = true,
  ...props
}) => {
  const [data, setData] = useAtom(dataAtom);
  const postdata = data.reblog !== null ? data.reblog : data;
  const isRepost = data.reblog !== null;
  const isFavourite = postdata.favourited;

  const { mutateAsync: favouritePost } = useFavouritePost();

  return (
    <button
      className={style({ isFavourite })}
      onClick={() => {
        if (!isRepost) {
          setData({
            ...data,
            favourited: !postdata.favourited,
            favouritesCount: postdata.favourited
              ? postdata.favouritesCount > 0
                ? postdata.favouritesCount - 1
                : postdata.favouritesCount
              : postdata.favouritesCount + 1,
          });
        } else {
          if (data.reblog?.id !== undefined) {
            setData({
              ...data,
              reblog: {
                ...data.reblog,
                favourited: !postdata.favourited,
                favouritesCount: postdata.favourited
                  ? postdata.favouritesCount > 0
                    ? postdata.favouritesCount - 1
                    : postdata.favouritesCount
                  : postdata.favouritesCount + 1,
              },
            });
          }
        }

        if (!postdata.favourited) {
          favouritePost({ id: postdata.id, action: "favourite" });
        } else {
          favouritePost({ id: postdata.id, action: "unfavourite" });
        }
      }}
      {...props}
    >
      {isFavourite ? <MdFavorite /> : <MdFavoriteBorder />}{" "}
      {displayCount && postdata.favouritesCount}
    </button>
  );
};

export default FavouriteIconButton;
