import { FC, memo, useMemo } from "react";
import { TPost, TPostAtom, usePost } from "../../hooks/connection";
import { css } from "../../../styled-system/css";
import InnerCard from "./InnerCard";
import { calcTimeDelta, getContentFromPost } from "../../utils";
import { atom, useAtom, useAtomValue } from "jotai";
import { ColumnsAtom } from "../../atoms";
import Media from "./Media";

type Props =
  | (({ id: string } | { postdata: TPost }) & Omit<CoreProps, "dataAtom">)
  | CoreProps;

type CoreProps = {
  dataAtom: TPostAtom;
  showCard?: boolean;
  showMedia?: boolean;
};

const InnerPostCore: FC<CoreProps> = ({
  dataAtom,
  showCard = true,
  showMedia = true,
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
        px: 3,
        py: 2,
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
      {postdata.mediaAttachments.length !== 0 && showMedia ? (
        <Media medias={postdata.mediaAttachments} />
      ) : (
        <></>
      )}
      {postdata.card !== undefined && showCard ? (
        <InnerCard carddata={postdata.card} />
      ) : (
        <></>
      )}
    </div>
  );
};

const InnerPostWithId: FC<{ id: string } & Omit<CoreProps, "dataAtom">> = ({
  id,
  ...props
}) => {
  const { data, isSuccess } = usePost({ id: id });

  return (
    <>
      {isSuccess ? (
        <InnerPostCore {...props} dataAtom={data} />
      ) : (
        <div>now fetching...</div>
      )}
    </>
  );
};

const InnerPostWithData: FC<
  { postdata: TPost } & Omit<CoreProps, "dataAtom">
> = ({ postdata, ...props }) => {
  const dataAtom: TPostAtom = useMemo(() => atom(postdata), [postdata]);

  return <InnerPostCore {...props} dataAtom={dataAtom} />;
};

const InnerPost: FC<Props> = (props) => {
  if ("id" in props) {
    const { id, ...otherProps } = props;
    return <InnerPostWithId id={id} {...otherProps} />;
  } else if ("postdata" in props) {
    const { postdata, ...otherProps } = props;
    return <InnerPostWithData postdata={postdata} {...otherProps} />;
  } else {
    return <InnerPostCore {...props} />;
  }
};

export default memo(InnerPost);
