import { FC, useEffect, useRef, useState } from "react";
import { css, cva } from "../../../styled-system/css";
import { TPostAtom } from "../../hooks/connection";
import Media from "./Media";
import { getContentFromPost } from "../../utils";
import InnerPost from "./InnerPost";
import InnerCard from "./InnerCard";
import { useFavouritePost, useUnfavouritePost } from "../../hooks/post";
import FavouriteIconButton from "./FavouriteIconButton";
import { useAtom } from "jotai";
import RepostIconButton from "./RepostIconButton";
import { ColumnsAtom } from "../../atoms";
import ReplyIconButton from "./ReplyIconButton";
import PostHeader from "./PostHeader";
import RepostNote from "./RepostNote";

type Props = {
  dataAtom: TPostAtom;
};

const contentStyle = cva({
  base: {},
  variants: {
    isShrinked: {
      true: {
        maxHeight: 200,
        overflowY: "hidden",
        maskImage: "linear-gradient(180deg, black 80%, transparent 100%)",
      },
      false: {},
    },
  },
});

const Post: FC<Props> = ({ dataAtom }) => {
  const [data, setData] = useAtom(dataAtom);

  // RTかどうかを判定
  const isRepost = data.reblog !== null;
  // RTならRT元のデータを、そうでなければそのままのデータを取得
  const postdata = data.reblog !== null ? data.reblog : data;

  // 投稿の内容を取得（RTとかのデータを除去）
  const content = getContentFromPost(postdata.content);

  // いいね機能のフック
  const { mutateAsync: favouritePost } = useFavouritePost();
  const { mutateAsync: unfavouritePost } = useUnfavouritePost();

  // カラムの状態を管理するアトム
  const [_, dispatchColumn] = useAtom(ColumnsAtom);

  // テキストが選択されている／されていた直後はクリックイベントを発火させない
  const [isSelecting, setIsSelecting] = useState(false);
  useEffect(() => {
    const handleSelectionChange = () => {
      // テキストが選択されているかどうかを確認
      const selection = window.getSelection();
      setIsSelecting(
        selection !== null ? selection.toString().length > 0 : false
      );
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // 投稿の展開状態を管理
  const [isExpanded, setIsExpanded] = useState(false);
  const contentDivRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleResize = () => {
      if (contentDivRef.current) {
        const height = contentDivRef.current.offsetHeight;
        const threshold = 240;
        setIsExpanded(height < threshold);
      }
    };

    handleResize();
  }, []);

  return (
    <div
      className={css({
        bgColor: "gray.100",
        borderY: "solid",
        borderYWidth: 1,
        borderColor: "gray.200",
        w: "100%",
        display: "flex",
        flexDir: "column",
        gap: 0,
      })}
    >
      <div
        className={css({
          p: 2,
          px: 4,
          w: "100%",
          display: "flex",
          flexDir: "column",
          gap: 2,
          cursor: "pointer",
          _hover: {
            bgColor: "gray.200",
          },
        })}
        onClick={() => {
          if (!isSelecting) {
            dispatchColumn({
              type: "push",
              value: {
                type: "PostDetail",
                postId: postdata.id,
              },
            });
          }
        }}
      >
        {isRepost && <RepostNote>{data.account.displayName}</RepostNote>}
        <PostHeader postdata={postdata} />
        <div
          className={css({
            display: "flex",
            flexDir: "column",
            gap: 2,
            marginLeft: 10,
          })}
        >
          {postdata.inReplyTo !== undefined && (
            <div>
              <p
                className={css({
                  fontSize: "small",
                  color: "gray.700",
                })}
              >
                Replying to {postdata.mentions.length == 0 && <span>post</span>}
                {postdata.mentions.map((m) => (
                  <span
                    className={css({
                      color: "green.700",
                    })}
                    key={m.id}
                  >
                    @{m.username}&nbsp;
                  </span>
                ))}
              </p>
            </div>
          )}

          {/* 本文 */}
          <div>
            <div
              className={contentStyle({
                isShrinked: !isExpanded,
              })}
            >
              <div
                className={css({
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
                ref={contentDivRef}
              />
            </div>
            <button
              className={css({
                display: isExpanded ? "none" : "inline-flex",
                border: "none",
                bg: "transparent",
                color: "blue.700",
                cursor: "pointer",
                _hover: {
                  textDecoration: "underline",
                },
              })}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
            >
              Expand Truth
            </button>
          </div>

          {postdata.mediaAttachments.length !== 0 && (
            <Media medias={postdata.mediaAttachments} />
          )}
          {postdata.quote !== undefined && (
            <InnerPost postdata={postdata.quote} />
          )}
          {postdata.card !== undefined && (
            <InnerCard carddata={postdata.card} />
          )}

          <div
            className={css({
              display: "inline-flex",
              gap: 6,
              fontSize: "sm",
              color: "gray.700",
            })}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ReplyIconButton dataAtom={dataAtom} />
            <RepostIconButton dataAtom={dataAtom} />
            <FavouriteIconButton
              count={postdata.favouritesCount}
              isFavourite={postdata.favourited}
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
                  favouritePost({ id: postdata.id });
                } else {
                  unfavouritePost({ id: postdata.id });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
