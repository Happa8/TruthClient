import { FC, useMemo } from "react";
import { TPost, TPostAtom, usePost } from "../../hooks/connection";
import { css } from "../../../styled-system/css";
import InnerCard from "./InnerCard";
import { calcTimeDelta, getContentFromPost } from "../../utils";
import { atom, useAtom, useAtomValue } from "jotai";
import { ColumnsAtom } from "../../atoms";

type Props = (
  | { id: string }
  | { postdata: TPost }
  | { postdataAtom: TPostAtom }
) & { showCard?: boolean };

const InnerPostCore: FC<{ dataAtom: TPostAtom; showCard?: boolean }> = ({
  dataAtom,
  showCard = true,
}) => {
  const data = useAtomValue(dataAtom);
  const postdata = data.reblog !== null ? data.reblog : data;

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
          {postdata.account.name}&nbsp;
        </span>
        <span>
          @{postdata.account.userName}・{calcTimeDelta(postdata.createdAt)}
        </span>
      </p>
      <div
        className={css({ color: "gray.700" })}
        dangerouslySetInnerHTML={{
          __html: getContentFromPost(postdata.content),
        }}
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
        <InnerPostCore dataAtom={data} />
      ) : (
        <div>now fetching...</div>
      )}
    </>
  );
};

const InnerPostWithData: FC<{ postdata: TPost }> = ({ postdata }) => {
  const dataAtom: TPostAtom = useMemo(() => atom(postdata), [postdata]);

  return <InnerPostCore dataAtom={dataAtom} />;
};

const InnerPost: FC<Props> = (props) => {
  if ("id" in props) {
    return <InnerPostWithId id={props.id} />;
  } else if ("postdata" in props) {
    return <InnerPostWithData postdata={props.postdata} />;
  } else {
    return <InnerPost postdataAtom={props.postdataAtom} />;
  }
};

export default InnerPost;
