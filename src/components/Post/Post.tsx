import { FC, useEffect, useState } from "react";
import { css } from "../../../styled-system/css";
import { TPostAtom, usePost } from "../../hooks/connection";
import Media from "./Media";
import { MdOutlineModeComment, MdRepeat } from "react-icons/md";
import { calcTimeDelta, getContentFromPost } from "../../utils";
import InnerPost from "./InnerPost";
import InnerCard from "./InnerCard";
import { useFavouritePost, useUnfavouritePost } from "../../hooks/post";
import FavouriteIconButton from "./FavouriteIconButton";
import { useAtom } from "jotai";
import RepostIconButton from "./RepostIconButton";
import Avatar from "./Avatar";
import { ColumnsAtom } from "../../atoms";
import ReplyInputField from "./ReplyInputField";
import ReplyIconButton from "./ReplyIconButton";

type Props = {
  dataAtom: TPostAtom;
};

const Post: FC<Props> = ({ dataAtom }) => {
  const [data, setData] = useAtom(dataAtom);

  const { refetch } = usePost({ id: data.id });

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
        {isRepost && (
          <p
            className={css({
              color: "gray.700",
              fontSize: "small",
              display: "inline-flex",
              alignItems: "center",
              flexFlow: "wrap",
            })}
          >
            <span
              className={css({
                fontSize: "sm",
                marginRight: 2,
              })}
            >
              <MdRepeat />
            </span>
            <span
              className={css({
                fontWeight: "bold",
              })}
            >
              {data.account.name}
            </span>
            &nbsp; ReTruthed
          </p>
        )}
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
        <div
          className={css({
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
          <div
            className={css({
              px: 10,
              py: 3,
            })}
          >
            <Media medias={postdata.mediaAttachments} />
          </div>
        )}
        {postdata.quote !== undefined && (
          <InnerPost postdata={postdata.quote} />
        )}
        {postdata.card !== undefined && <InnerCard carddata={postdata.card} />}
        <p
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
              setData({
                ...data,
                favourited: !postdata.favourited,
                favouritesCount: postdata.favourited
                  ? postdata.favouritesCount > 0
                    ? postdata.favouritesCount - 1
                    : postdata.favouritesCount
                  : postdata.favouritesCount + 1,
              });
              if (!postdata.favourited) {
                favouritePost({ id: postdata.id }).then(() => {
                  refetch().then((data) => {
                    if (data.data !== undefined) setData(data.data);
                  });
                });
              } else {
                unfavouritePost({ id: postdata.id }).then(() => {
                  refetch().then((data) => {
                    if (data.data !== undefined) setData(data.data);
                  });
                });
              }
            }}
          />
        </p>
      </div>
    </div>
  );
};

export default Post;
