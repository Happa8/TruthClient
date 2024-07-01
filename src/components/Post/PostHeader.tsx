import { TPost } from "@/src/hooks/connection";
import { calcTimeDelta } from "@/src/utils";
import { css } from "@/styled-system/css";
import { FC } from "react";
import Avatar from "./Avatar";

type Props = {
  postdata: TPost;
};

const PostHeader: FC<Props> = ({ postdata }) => {
  return (
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
          width: "calc(100% - 38px)",
        })}
      >
        <p
          className={css({
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          })}
        >
          <span
            className={css({
              fontWeight: "bold",
              color: "gray.900",
            })}
          >
            {postdata.group
              ? postdata.group.displayName
              : postdata.account.name}
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
            <a
              href={postdata.account.url}
              target="_blank"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              @{postdata.account.userName}
            </a>
          </span>
          <span
            className={css({
              fontSize: "small",
              color: "gray.700",
            })}
          >
            <a
              href={postdata.url}
              target="_blank"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              ・{calcTimeDelta(postdata.createdAt)}
            </a>
          </span>
        </p>
      </div>
    </div>
  );
};

export default PostHeader;
