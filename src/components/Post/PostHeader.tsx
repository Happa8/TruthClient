import { TPost } from "@/src/hooks/connection";
import { calcTimeDelta } from "@/src/utils";
import { css } from "@/styled-system/css";
import { FC } from "react";
import Avatar from "./Avatar";
import { useAtom } from "jotai";
import { ColumnsAtom } from "@/src/atoms";

type Props = {
  postdata: TPost;
};

const PostHeader: FC<Props> = ({ postdata }) => {
  // カラムの状態を管理するアトム
  const [_, dispatchColumn] = useAtom(ColumnsAtom);

  return (
    <div className={css({ display: "flex", gap: 2, alignItems: "center" })}>
      <Avatar
        mainImg={
          postdata.group ? postdata.group.avatar : postdata.account.avatar
        }
        subImg={postdata.group && postdata.account.avatar}
        onClick={(e) => {
          e.stopPropagation();
          if (!postdata.group) {
            dispatchColumn({
              type: "push",
              value: {
                type: "UserDetail",
                userId: postdata.account.id,
              },
            });
          }
        }}
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
              _hover: {
                textDecoration: "underline",
                cursor: "pointer",
              },
              fontWeight: "bold",
              color: "gray.900",
            })}
            onClick={(e) => {
              e.stopPropagation();
              if (!postdata.group) {
                dispatchColumn({
                  type: "push",
                  value: {
                    type: "UserDetail",
                    userId: postdata.account.id,
                  },
                });
              }
            }}
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
            <span
              onClick={(e) => {
                e.stopPropagation();
                dispatchColumn({
                  type: "push",
                  value: {
                    type: "UserDetail",
                    userId: postdata.account.id,
                  },
                });
              }}
              className={css({
                _hover: {
                  textDecoration: "underline",
                },
              })}
            >
              @{postdata.account.userName}
            </span>
          </span>
          <span
            className={css({
              fontSize: "small",
              color: "gray.700",
            })}
          >
            ・
            <a
              href={postdata.url}
              target="_blank"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={css({
                _hover: {
                  textDecoration: "underline",
                },
              })}
            >
              {calcTimeDelta(postdata.createdAt)}
            </a>
          </span>
        </p>
      </div>
    </div>
  );
};

export default PostHeader;
