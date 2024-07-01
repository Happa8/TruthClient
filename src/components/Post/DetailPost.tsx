import { css } from "@/styled-system/css";
import { FC, Suspense } from "react";
import { TPost } from "@/src/hooks/connection";
import { getContentFromPost } from "@/src//utils";
import Media from "./Media";
import InnerPost from "./InnerPost";
import InnerCard from "./InnerCard";
import PostHeader from "./PostHeader";

type Props = {
  data: TPost;
};

const DetailPostCore: FC<Props> = ({ data }) => {
  const postdata = data.reblog !== null ? data.reblog : data;
  const content = getContentFromPost(postdata.content);

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
      <div
        className={css({
          fontSize: "md",
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
        <span>
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
