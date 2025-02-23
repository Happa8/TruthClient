import { FC, memo } from "react";
import { usePost } from "../../hooks/connection";
import LineWrapper from "@/src/components/Line/LineWrapper";
import LineHeader from "./LineHeader";
import { ColumnsAtom } from "../../atoms";
import { useAtom } from "jotai";
import DetailPost from "../Post/DetailPost";
import LineContent from "./LineContent";

type Props = {
  postId: string;
  columnIndex: number;
};

export const PostDetailLine: FC<Props> = ({ postId, columnIndex }) => {
  const { status, data } = usePost({ id: postId });
  // const { data: replyData, status: replyStatus } = useReplies({ id: postId });
  const [_, dispatch] = useAtom(ColumnsAtom);

  // useEffect(() => {
  //   if (replyStatus === "success") {
  //     console.log(replyData);
  //   }
  // }, [replyStatus, replyData]);

  return (
    <LineWrapper>
      <LineHeader
        onClickClose={() => {
          dispatch({ type: "delete", index: columnIndex });
        }}
      >
        Post Detail
      </LineHeader>
      <LineContent>
        {/* {replyStatus === "success" ? (
          <PostTree tree={replyData.parent} type="parent" />
        ) : null} */}
        {status === "success" ? (
          <DetailPost dataAtom={data} />
        ) : (
          "Now Loading..."
        )}
        {/* {replyStatus === "success" ? (
          <PostTree tree={replyData.children} type="children" />
        ) : null} */}
      </LineContent>
    </LineWrapper>
  );
};

const memorizedPostDetailLine = memo(PostDetailLine);

export default memorizedPostDetailLine;
