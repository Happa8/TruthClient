import { css, cx } from "@/styled-system/css";
import { FC, ReactNode, Suspense } from "react";
import { TPost, useGetPostSuspense } from "../hooks/connection";
import { getContentFromPost } from "../utils";
import Avatar from "./Avatar";
import Media from "./Media";
import InnerPost from "./InnerPost";
import InnerCard from "./InnerCard";

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
      <div className={css({ display: "flex", gap: 2, alignItems: "center" })}>
        <Avatar
          mainImg={
            postdata.group ? postdata.group.avatar : postdata.account.avatar
          }
          subImg={postdata.group && postdata.account.avatar}
        />

        <div
          className={css({
            display: "flex",
            flexDir: "column",
            lineHeight: "none",
            gap: 1,
          })}
        >
          <p>
            <span
              className={css({
                fontWeight: "bold",
                color: "gray.900",
              })}
            >
              {postdata.group
                ? postdata.group.displayName
                : postdata.account.displayName}
            </span>
          </p>
          <p>
            <span
              className={css({
                fontSize: "small",
                color: "gray.700",
              })}
            >
              {postdata.group && "posted by "}
              <a href={postdata.account.url} target="_blank">
                @{postdata.account.userName}
              </a>
            </span>
          </p>
        </div>
      </div>
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
        <p>{postdata.createdAt.toLocaleString()}</p>
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
