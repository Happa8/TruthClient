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
import { calcTimeDelta } from "../utils";
import InnerPost from "./InnerPost";

type Props = {
  data: TPost;
};

const checkQuote = (input: string): { id: string } | undefined => {
  const matchPattern = new RegExp(
    `<span class=\\"quote-inline\\"><br/>RT: (.*?)</span>`
  );
  const matchArray = input.match(matchPattern);
  if (matchArray === null) {
    return undefined;
  }
  const params = matchArray[1].slice(8).split("/");
  return {
    id: params[4],
  };
};

const Post: FC<Props> = ({ data }) => {
  const isRepost = data.reblog !== null;
  const postdata = data.reblog !== null ? data.reblog : data;
  const quote = checkQuote(postdata.content);
  const isQuote = !!quote;
  const isMention = postdata.mentions.length !== 0;

  const quotePattern = new RegExp(
    `<span class=\\"quote-inline\\"><br/>RT: (.*?)</span>`
  );
  const content = postdata.content.replace(quotePattern, "");

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
      {isMention && !isQuote ? (
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
      <div dangerouslySetInnerHTML={{ __html: content }} />
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
      {isQuote ? <InnerPost id={quote.id} /> : <></>}
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
