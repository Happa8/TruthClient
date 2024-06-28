import { css, cx } from "@/styled-system/css";
import { FC, ReactNode, memo } from "react";
import { TPost, TPostAtom, usePost } from "../hooks/connection";
import LineWrapper from "./LineWrapper";
import { getContentFromPost } from "../utils";
import Avatar from "./Avatar";
import LineHeader from "./LineHeader";
import { ColumnsAtom } from "../atoms";
import { useAtom } from "jotai";
import Media from "./Media";
import InnerPost from "./InnerPost";
import InnerCard from "./InnerCard";
import DetailPost from "./DetailPost";

type Props = {
  postId: string;
  columnIndex: number;
};

const PostDetailLineCore: FC<{ data: TPost }> = ({ data }) => {
  const postdata = data.reblog !== null ? data.reblog : data;

  return (
    <div className={css({})}>
      <DetailPost data={postdata} />
    </div>
  );
};

const PostDetailLine: FC<Props> = ({ postId, columnIndex }) => {
  const { data, status } = usePost({ id: postId });
  const [_, dispatch] = useAtom(ColumnsAtom);

  return (
    <LineWrapper>
      <LineHeader
        onClickClose={() => {
          dispatch({ type: "delete", index: columnIndex });
        }}
      >
        Post Detail
      </LineHeader>
      {status === "success" ? (
        <PostDetailLineCore data={data} />
      ) : (
        "Now Loading..."
      )}
    </LineWrapper>
  );
};

const memorizedPostDetailLine = memo(PostDetailLine);

export default memorizedPostDetailLine;
