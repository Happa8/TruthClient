import { css } from "@/styled-system/css";
import { FC, Suspense } from "react";
import { TPostAtom } from "@/src/hooks/connection";
import { getContentFromPost } from "@/src//utils";
import Media from "./Media";
import InnerPost from "./InnerPost";
import InnerCard from "./InnerCard";
import PostHeader from "./PostHeader";
import FavouriteIconButton from "./FavouriteIconButton";
import { useAtomValue } from "jotai";
import RepostIconButton from "./RepostIconButton";
import ReplyIconButton from "./ReplyIconButton";
import Poll from "./Poll";
import FavoriteListDialog from "./FavoriteListDialog";
import { useDialog } from "@ark-ui/react";

type Props = {
  dataAtom: TPostAtom;
};

const DetailPostCore: FC<Props> = ({ dataAtom }) => {
  const data = useAtomValue(dataAtom);
  const postdata = data.reblog !== null ? data.reblog : data;
  const content = getContentFromPost(postdata.content);
  const favDialog = useDialog();

  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        gap: 2,
        p: 4,
        borderBottom: "solid",
        borderBottomWidth: 2,
        borderColor: "gray.200",
      })}
    >
      <PostHeader postdata={postdata} />
      <FavoriteListDialog postId={postdata.id} dialogValue={favDialog} />
      <div
        className={css({
          fontSize: "md",
          "& p:nth-child(n+2)": {
            marginTop: "1rem",
          },
          "& p a.hashtag": {
            color: "green.700",
          },
          "& p a": {
            color: "blue.700",
          },
        })}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {postdata.mediaAttachments.length !== 0 && (
        <Media medias={postdata.mediaAttachments} />
      )}

      {postdata.quote !== undefined && <InnerPost postdata={postdata.quote} />}

      {postdata.card !== undefined && <InnerCard carddata={postdata.card} />}

      {postdata.poll !== undefined && <Poll data={postdata.poll} />}

      <div
        className={css({
          fontSize: "xs",
          color: "gray.500",
        })}
      >
        <p>
          <a
            href={postdata.url}
            target="_blank"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {postdata.createdAt.toLocaleString()}
          </a>
        </p>
      </div>

      <p
        className={css({
          fontSize: "sm",
          color: "gray.500",
          display: "inline-flex",
          gap: 2,
        })}
      >
        <span>
          <span
            className={css({
              fontWeight: "bold",
            })}
          >
            {postdata.repliesCount}
          </span>
          &nbsp;
          <span>Replies</span>
        </span>
        <span>
          <span
            className={css({
              fontWeight: "bold",
            })}
          >
            {postdata.reblogsCount}
          </span>
          &nbsp;
          <span>ReTruths</span>
        </span>
        <span
          onClick={() => {
            favDialog.setOpen(true);
          }}
          className={css({
            cursor: "pointer",
          })}
        >
          <span
            className={css({
              fontWeight: "bold",
            })}
          >
            {postdata.favouritesCount}
          </span>
          &nbsp;
          <span>Likes</span>
        </span>
      </p>

      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          fontSize: "xl",
          alignItems: "center",
          marginTop: 2,
          px: 4,
          color: "gray.500",
        })}
      >
        <ReplyIconButton dataAtom={dataAtom} displayCount={false} />
        <RepostIconButton dataAtom={dataAtom} displayCount={false} />
        <FavouriteIconButton dataAtom={dataAtom} displayCount={false} />
      </div>
    </div>
  );
};

const DetailPost: FC<Props> = (props) => {
  return (
    <Suspense fallback={<div>now fetching...</div>}>
      <DetailPostCore {...props} />
    </Suspense>
  );
};

export default DetailPost;
