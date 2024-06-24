import { FC } from "react";
import { css } from "../../styled-system/css";
import { TPost, TPostAtom, usePost } from "../hooks/connection";
import Media from "./Media";
import { MdOutlineModeComment, MdRepeat } from "react-icons/md";
import { calcTimeDelta } from "../utils";
import InnerPost from "./InnerPost";
import InnerCard from "./InnerCard";
import { useFavouritePost, useRepost, useUnfavouritePost } from "../hooks/post";
import FavouriteIconButton from "./FavouriteIconButton";
import { useAtom } from "jotai";
import Menu, { MenuItem } from "./Menu";
import RepostIconButton from "./RepostIconButton";

type Props = {
  dataAtom: TPostAtom;
};

const Post: FC<Props> = ({ dataAtom }) => {
  const [data, setData] = useAtom(dataAtom);

  const { refetch } = usePost({ id: data.id });

  const isRepost = data.reblog !== null;
  const postdata = data.reblog !== null ? data.reblog : data;

  const quotePattern = new RegExp(
    `<span class=\\"quote-inline\\"><br/>RT: (.*?)</span>`
  );
  const content = postdata.content.replace(quotePattern, "");

  const { mutateAsync: favouritePost } = useFavouritePost();
  const { mutateAsync: unfavouritePost } = useUnfavouritePost();

  return (
    <div
      className={css({
        bgColor: "gray.100",
        p: 2,
        px: 4,
        borderY: "solid",
        borderYWidth: 1,
        borderColor: "gray.200",
        w: "100%",
        display: "flex",
        flexDir: "column",
        gap: 2,
        _hover: {
          bgColor: "gray.200",
        },
      })}
      key={postdata.id}
    >
      {isRepost ? (
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
            {data.account.displayName}
          </span>{" "}
          ReTruthed
        </p>
      ) : (
        <></>
      )}
      <div className={css({ display: "flex", gap: 2, alignItems: "center" })}>
        <img
          className={css({
            w: 8,
            h: 8,
            aspectRatio: "1/1",
            borderRadius: "full",
          })}
          src={postdata.account.avatar}
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
              {postdata.account.displayName}
            </span>
          </p>
          <p>
            <span
              className={css({
                fontSize: "small",
                color: "gray.700",
              })}
            >
              @{postdata.account.userName}
            </span>
            <span
              className={css({
                fontSize: "small",
                color: "gray.700",
              })}
            >
              ・{calcTimeDelta(postdata.createdAt)}
            </span>
          </p>
        </div>
      </div>
      {postdata.inReplyTo !== undefined ? (
        <div>
          <p
            className={css({
              fontSize: "small",
              color: "gray.700",
            })}
          >
            Replying to{" "}
            {postdata.mentions.map((m) => (
              <span
                className={css({
                  color: "green.700",
                })}
                key={m.id}
              >
                @{m.username}
              </span>
            ))}
          </p>
        </div>
      ) : (
        <></>
      )}
      <div
        className={css({
          "& p a.hashtag": {
            color: "green.700",
          },
        })}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {postdata.mediaAttachments.length !== 0 ? (
        <div
          className={css({
            px: 10,
            py: 3,
          })}
        >
          <Media medias={postdata.mediaAttachments} />
        </div>
      ) : (
        <></>
      )}
      {postdata.quote !== undefined ? (
        <InnerPost postdata={postdata.quote} />
      ) : (
        <></>
      )}
      {postdata.card !== undefined ? (
        <InnerCard carddata={postdata.card} />
      ) : (
        <></>
      )}
      <p
        className={css({
          display: "inline-flex",
          gap: 6,
          fontSize: "sm",
          color: "gray.700",
        })}
      >
        <span
          className={css({
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
          })}
        >
          <MdOutlineModeComment /> {postdata.repliesCount}
        </span>

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
  );
};

export default Post;
