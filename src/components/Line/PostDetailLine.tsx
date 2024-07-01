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

const PostDetailLine: FC<Props> = ({ postId, columnIndex }) => {
  const { status, data } = usePost({ id: postId });
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
      <LineContent>
        {status === "success" ? (
          <DetailPost dataAtom={data} />
        ) : (
          "Now Loading..."
        )}
      </LineContent>
    </LineWrapper>
  );
};

const memorizedPostDetailLine = memo(PostDetailLine);

export default memorizedPostDetailLine;
