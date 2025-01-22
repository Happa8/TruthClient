import { FC, memo, useEffect, useRef, useState } from "react";
import { css } from "@/styled-system/css";
import LineHeader from "./LineHeader";
import LineWrapper from "./LineWrapper";
import Post from "@/src/components/Post/Post";
import { useGetTagTimeline, useTimeline } from "@/src/hooks/connection";
import { VList, VListHandle } from "virtua";
import { useOnScreen } from "@/src/hooks/useOnScreen";

type Props = {
  tag: string;
};

const TagTimeLine: FC<Props> = ({ tag }) => {
  const [searchTag, setSearchTag] = useState<string>(tag);
  const { postList, loadMoreTag, isFetching, posts } = useGetTagTimeline({
    tag: searchTag,
  });

  const ListRef = useRef<VListHandle>(null);

  const TopMarkerRef = useRef<HTMLDivElement>(null);
  const TopMarkerViewPosition = useOnScreen(TopMarkerRef);

  // 以前のTruth表示部の高さを保持
  const prevHeightRef = useRef(0);

  // スクロール固定
  useEffect(() => {
    // Refが存在しない場合は何もしない
    if (!ListRef.current) return;

    // 以前の高さが0の場合は初期化
    if (prevHeightRef.current === 0) {
      prevHeightRef.current = ListRef.current.scrollSize;
      return;
    }

    // 一番上が表示されている場合は何もしない
    if (TopMarkerViewPosition === "VISIBLE") {
      prevHeightRef.current = ListRef.current.scrollSize;
      return;
    }

    // 以前の高さと現在の高さを比較して、増えた文だけ現在のスクロール位置を巻き戻す
    const currentHeight = ListRef.current.scrollSize;
    // const currentPos = ListRef.current.scrollOffset;
    // TODO:なんかうまくいかない
    // ListRef.current.scrollBy(-(currentHeight - prevHeightRef.current));

    prevHeightRef.current = currentHeight;
  }, [postList.length]);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

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
        Tag: {searchTag}
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
              loadMoreTag();
            }
          }}
        >
          <p>{isFetching ? "Loading..." : "Click to load"}</p>
        </div>
      </VList>
    </LineWrapper>
  );
};

const memoizedTagTimeLine = memo(TagTimeLine);

export default memoizedTagTimeLine;
