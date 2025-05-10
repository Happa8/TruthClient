import { FC, useEffect, useRef, useState } from "react";
import { css, cva } from "../../../styled-system/css";
import { TPostAtom } from "../../hooks/connection";
import Media from "./Media";
import { getContentFromPost } from "../../utils";
import InnerPost from "./InnerPost";
import InnerCard from "./InnerCard";
import FavouriteIconButton from "./FavouriteIconButton";
import { useAtom, useAtomValue } from "jotai";
import RepostIconButton from "./RepostIconButton";
import { ColumnsAtom } from "../../atoms";
import ReplyIconButton from "./ReplyIconButton";
import PostHeader from "./PostHeader";
import RepostNote from "./RepostNote";
import Poll from "./Poll";

type Props = {
  dataAtom: TPostAtom;
  isTree?: boolean;
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

const postStyle = cva({
  base: {
    bgColor: "gray.100",
    borderBottom: "solid",
    borderColor: "gray.200",
    w: "100%",
    display: "flex",
    flexDir: "column",
    gap: 0,
  },
  variants: {
    isTree: {
      true: {
        borderBottomWidth: 0,
      },
      false: {
        borderBottomWidth: 2,
      },
    },
  },
});

const Post: FC<Props> = ({ dataAtom, isTree = false }) => {
  const data = useAtomValue(dataAtom);

  // RTかどうかを判定
  const isRepost = data.reblog !== null;
  // RTならRT元のデータを、そうでなければそのままのデータを取得
  const postdata = data.reblog !== null ? data.reblog : data;

  // 投稿の内容を取得（RTとかのデータを除去）
  const content = getContentFromPost(postdata.content);

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
      className={postStyle({
        isTree: isTree,
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
            display: "grid",
            gridTemplateColumns: "2rem minmax(0,1fr)",
            gap: 2,
            w: "100%",
          })}
        >
          <div
            className={css({
              flexShrink: 0,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            })}
          >
            {isTree && (
              <div
                className={css({
                  w: "2px",
                  bgColor: "gray.300",
                  marginTop: "-8px",
                  marginBottom: "-16px",
                })}
              />
            )}
          </div>
          <div
            className={css({
              display: "flex",
              flexDir: "column",
              gap: 2,
            })}
          >
            {(postdata.inReplyTo !== undefined ||
              postdata.mentions.length > 0) && (
              <div>
                <p
                  className={css({
                    fontSize: "small",
                    color: "gray.700",
                  })}
                >
                  Replying to{" "}
                  {postdata.mentions.length == 0 && <span>post</span>}
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
            {postdata.poll !== undefined && <Poll data={postdata.poll} />}

            <div
              className={css({
                display: "inline-flex",
                gap: 6,
                fontSize: "sm",
              })}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ReplyIconButton dataAtom={dataAtom} />
              <RepostIconButton dataAtom={dataAtom} />
              <FavouriteIconButton dataAtom={dataAtom} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
