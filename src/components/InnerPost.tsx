import { FC } from "react";
import { TPost, TPostAtom, usePost } from "../hooks/connection";
import { css } from "../../styled-system/css";
import InnerCard from "./InnerCard";
import { calcTimeDelta } from "../utils";
import { useAtom, useAtomValue } from "jotai";
import { ColumnsAtom } from "../atoms";

type Props = (
  | { id: string }
  | { postdata: TPost }
  | { postdataAtom: TPostAtom }
) & { showCard?: boolean };

const InnerPostCore: FC<{ postdata: TPost; showCard?: boolean }> = ({
  postdata,
  showCard = true,
}) => {
  const [_, dispatchColumn] = useAtom(ColumnsAtom);

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
        cursor: "pointer",
      })}
      onClick={(e) => {
        e.stopPropagation();
        dispatchColumn({
          type: "push",
          value: {
            type: "PostDetail",
            postId: postdata.id,
          },
        });
      }}
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

const InnerPostWithAtom: FC<{ postdataAtom: TPostAtom }> = ({
  postdataAtom,
}) => {
  const data = useAtomValue(postdataAtom);
  const postdata = data.reblog !== null ? data.reblog : data;

  return <InnerPostCore postdata={postdata} />;
};

const InnerPost: FC<Props> = (props) => {
  if ("id" in props) {
    return <InnerPostWithId id={props.id} />;
  } else if ("postdata" in props) {
    return (
      <InnerPostCore postdata={props.postdata} showCard={props.showCard} />
    );
  } else {
    return <InnerPostWithAtom postdataAtom={props.postdataAtom} />;
  }
};

export default InnerPost;
