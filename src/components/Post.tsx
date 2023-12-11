import { FC } from "react";
import { css } from "../../styled-system/css";
import { TPost } from "../hooks/connection";
import Media from "./Media";

import {
  MdOutlineModeComment,
  MdFavoriteBorder,
  MdFavorite,
  MdRepeat,
} from "react-icons/md";

type Props = {
  data: TPost;
};

const oneSecond = 1000;
const oneMinute = 60 * oneSecond;
const oneHour = 60 * oneMinute;
const oneDay = 24 * oneHour;
const oneWeek = 7 * oneDay;

const calcTimeDelta = (time: Date): string => {
  const now = new Date();
  const timeDelta = now.getTime() - time.getTime();

  if (timeDelta > 4 * oneWeek) {
    return time.toLocaleString("en", { month: "short", day: "2-digit" });
  } else if (timeDelta > oneWeek) {
    return `${Math.floor(timeDelta / oneWeek)}w`;
  } else if (timeDelta > oneDay) {
    return `${Math.floor(timeDelta / oneDay)}d`;
  } else if (timeDelta > oneHour) {
    return `${Math.floor(timeDelta / oneHour)}h`;
  } else if (timeDelta > oneMinute) {
    return `${Math.floor(timeDelta / oneMinute)}m`;
  } else if (timeDelta > oneSecond) {
    return `${Math.floor(timeDelta / oneSecond)}s`;
  } else {
    return "now";
  }
};

const checkQuote = (input: string): TPost | undefined => {
  const matchPattern = new RegExp(
    `<span class=\\"quote-inline\\"><br/>RT: (.*?)</span>`
  );
  const matchArray = input.match(matchPattern);
  if (matchArray === null) {
    return undefined;
  }
  const params = matchArray[0].slice(8).split("/");
};

const Post: FC<Props> = ({ data }) => {
  const isRepost = data.reblog !== null;
  const postdata = data.reblog !== null ? data.reblog : data;
  // const quote =

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
      {postdata.mentions.length !== 0 ? (
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
              >
                @{m.username}
              </span>
            ))}
          </p>
        </div>
      ) : (
        <></>
      )}
      <div dangerouslySetInnerHTML={{ __html: postdata.content }} />
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
        <span
          className={css({
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
          })}
        >
          <MdRepeat /> {postdata.reblogsCount}
        </span>
        <span
          className={css({
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
          })}
        >
          <MdFavoriteBorder /> {postdata.favouritesCount}
        </span>
      </p>
    </div>
  );
};

export default Post;
