import { TAccountAtom, useAccountPosts } from "@/src/hooks/connection";
import { css } from "@/styled-system/css";
import { useAtomValue } from "jotai";
import { FC, Suspense } from "react";
import Post from "../Post/Post";

type Props = {
  dataAtom: TAccountAtom;
};

const DetailAccountCore: React.FC<Props> = ({ dataAtom }) => {
  const data = useAtomValue(dataAtom);
  const { postList: pinnedPosts } = useAccountPosts({
    accountId: data.id,
    pinned: true,
    withMuted: true,
  });

  const {
    postList: posts,
    loadMoreAccountPosts,
    isFetching,
  } = useAccountPosts({
    accountId: data.id,
    excludeReplies: true,
    onlyReplies: false,
    withMuted: true,
  });

  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        fontFamily: "notosans",
      })}
    >
      <div
        className={css({
          position: "relative",
          marginBottom: "18px",
        })}
      >
        {data.header ? (
          <img
            src={data.header}
            alt="header"
            className={css({
              width: "100%",
              height: "100px",
              objectFit: "cover",
              backgroundColor: "gray.200",
            })}
          />
        ) : (
          <div
            className={css({
              width: "100%",
              height: "100px",
              objectFit: "cover",
              backgroundColor: "gray.200",
            })}
          />
        )}

        <img
          src={data.avatar}
          alt="avatar"
          className={css({
            width: "64px",
            height: "64px",
            objectFit: "cover",
            borderRadius: "full",
            position: "absolute",
            top: "64px",
            left: "16px",
            border: "solid",
            borderWidth: "2px",
            borderColor: "gray.100",
          })}
        />
      </div>
      <div
        className={css({
          display: "flex",
          flexDir: "column",
          gap: 2,
          paddingY: 4,
          paddingX: 4,
          borderBottom: "solid",
          borderBottomWidth: 2,
          borderColor: "gray.200",
        })}
      >
        <div>
          <p
            className={css({
              fontSize: "md",
              fontWeight: "bold",
              color: "gray.700",
            })}
          >
            {data.displayName}
          </p>
          <a
            href={`https://truthsocial.com/@${data.userName}`}
            target="_blank"
            rel="noopener noreferrer"
            className={css({
              fontSize: "sm",
              color: "gray.500",
              lineHeight: "none",
            })}
          >
            @{data.userName}
          </a>
        </div>
        <p
          className={css({
            color: "gray.500",
          })}
        >
          <span>
            <span
              className={css({
                fontWeight: "bold",
                color: "gray.700",
              })}
            >
              {data.followersCount}
            </span>
            <span> Followers</span>
          </span>
          <span
            className={css({
              marginLeft: "1rem",
            })}
          >
            <span
              className={css({
                fontWeight: "bold",
                color: "gray.700",
              })}
            >
              {data.followingCount}
            </span>
            <span> Followings</span>
          </span>
        </p>
        <p
          className={css({
            fontSize: "sm",
            color: "gray.900",
          })}
          dangerouslySetInnerHTML={{ __html: data.note }}
        />
        <p
          className={css({
            fontSize: "xs",
            color: "gray.500",
          })}
        >
          Joined {data.createdAt.toLocaleDateString()}
        </p>
      </div>
      <div>
        {pinnedPosts.length > 0 &&
          pinnedPosts.map((post) => (
            <Post dataAtom={post} key={post.toString()} isPinned={true} />
          ))}
        {posts.length > 0 &&
          posts.map((post) => <Post dataAtom={post} key={post.toString()} />)}
      </div>
      <div
        className={css({
          w: "100%",
          h: 100,
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          _hover: { bgColor: "gray.200" },
        })}
        onClick={() => {
          if (!isFetching) {
            loadMoreAccountPosts();
          }
        }}
      >
        <p>{isFetching ? "Loading..." : "Click to load"}</p>
      </div>
    </div>
  );
};

const DetailAccount: FC<Props> = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailAccountCore {...props} />
    </Suspense>
  );
};

export default DetailAccount;
