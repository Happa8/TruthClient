import { FC } from "react";
import { TPost, usePost } from "../hooks/connection";
import { css } from "../../styled-system/css";

type Props = { id: string } | { postdata: TPost };

const InnerPostCore: FC<{ postdata: TPost }> = ({ postdata }) => {
  return (
    <div
      className={css({
        w: "100%",
        border: "solid",
        borderColor: "gray.300",
        borderWidth: 1,
        borderRadius: "md",
        fontSize: "small",
        p: 3,
      })}
    >
      <p className={css({ color: "gray.700" })}>
        <span className={css({ fontWeight: "bold" })}>
          {postdata.account.displayName}&nbsp;
        </span>
        <span>@{postdata.account.userName}</span>
      </p>
      <div
        className={css({ color: "gray.700" })}
        dangerouslySetInnerHTML={{ __html: postdata.content }}
      />
    </div>
  );
};

const InnerPostWithId: FC<{ id: string }> = ({ id }) => {
  const { data, isSuccess } = usePost({ id: id });

  return (
    <>
      {isSuccess ? (
        <InnerPostCore postdata={data} />
      ) : (
        <div>now fetching...</div>
      )}
    </>
  );
};

const InnerPost: FC<Props> = (props) => {
  if ("id" in props) {
    return <InnerPostWithId id={props.id} />;
  } else {
    return <InnerPostCore postdata={props.postdata} />;
  }
};

export default InnerPost;
