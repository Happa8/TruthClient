import { FC } from "react";
import { TPost, usePost } from "../hooks/connection";
import { css } from "../../styled-system/css";
import InnerCard from "./InnerCard";
import { calcTimeDelta } from "../utils";

type Props = ({ id: string } | { postdata: TPost }) & { showCard?: boolean };

const InnerPostCore: FC<{ postdata: TPost; showCard?: boolean }> = ({
  postdata,
  showCard = true,
}) => {
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
        display: "flex",
        flexDir: "column",
        gap: 1,
      })}
    >
      <p className={css({ color: "gray.700" })}>
        <span className={css({ fontWeight: "bold" })}>
          {postdata.account.displayName}&nbsp;
        </span>
        <span>
          @{postdata.account.userName}・{calcTimeDelta(postdata.createdAt)}
        </span>
      </p>
      <div
        className={css({ color: "gray.700" })}
        dangerouslySetInnerHTML={{ __html: postdata.content }}
      />
      {postdata.card !== undefined && showCard ? (
        <InnerCard carddata={postdata.card} />
      ) : (
        <></>
      )}
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
    return (
      <InnerPostCore postdata={props.postdata} showCard={props.showCard} />
    );
  }
};

export default InnerPost;
