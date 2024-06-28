import { FC, memo, useEffect, useRef } from "react";
import { css } from "@/styled-system/css";
import LineHeader from "./LineHeader";
import LineWrapper from "./LineWrapper";
import Post from "@/src/components/Post/Post";
import { useTimeline } from "@/src/hooks/connection";
import { VList, VListHandle } from "virtua";
import { useOnScreen } from "@/src/hooks/useOnScreen";

// type Props = {};

const HomeLine: FC = () => {
  const { postList, loadMoreTimeLine, isFetching, posts } = useTimeline();

  const ListRef = useRef<VListHandle>(null);

  const TopMarkerRef = useRef<HTMLDivElement>(null);
  const TopMarkerViewPosition = useOnScreen(TopMarkerRef);

  const prevHeightRef = useRef(0);

  useEffect(() => {
    if (!ListRef.current) return;
    if (prevHeightRef.current === 0) {
      prevHeightRef.current = ListRef.current.scrollSize;
      return;
    }

    if (TopMarkerViewPosition === "VISIBLE") {
      prevHeightRef.current = ListRef.current.scrollSize;
      return;
    }

    const currentHeight = ListRef.current.scrollSize;
    const currentPos = ListRef.current.scrollOffset;
    ListRef.current.scrollTo(
      currentPos + currentHeight - prevHeightRef.current
    );

    prevHeightRef.current = currentHeight;
  }, [postList.length]);

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
        <div ref={TopMarkerRef} />
        {postList.map((post, i) => {
          return <Post key={posts[i].id} dataAtom={post} />;
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
