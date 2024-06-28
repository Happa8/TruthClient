import { FC, memo, useRef } from "react";
import { css } from "../../styled-system/css";
import LineHeader from "./LineHeader";
import LineWrapper from "./LineWrapper";
import Post from "./Post";
import { useTimeline } from "../hooks/connection";
import { VList, VListHandle } from "virtua";

// type Props = {};

const HomeLine: FC = () => {
  const { postList, loadMoreTimeLine, isFetching } = useTimeline();

  const ListRef = useRef<VListHandle>(null);

  return (
    <LineWrapper>
      <LineHeader
        onClick={() => {
          if (ListRef.current) {
            ListRef.current.scrollToIndex(0, {
              smooth: true,
            });
          }
        }}
      >
        Home
      </LineHeader>
      <VList style={{ width: "100%" }} ref={ListRef}>
        {postList.map((post, i) => {
          return <Post key={i} dataAtom={post} />;
        })}
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
              loadMoreTimeLine();
            }
          }}
        >
          <p>{isFetching ? "Loading..." : "Click to load"}</p>
        </div>
      </VList>
    </LineWrapper>
  );
};

const memoizedHomeLine = memo(HomeLine);

export default memoizedHomeLine;
