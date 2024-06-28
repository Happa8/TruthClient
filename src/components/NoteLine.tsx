import { FC, useRef } from "react";
import { css } from "../../styled-system/css";
import LineHeader from "./LineHeader";
import LineWrapper from "./LineWrapper";
import { VList, VListHandle } from "virtua";
import { useTimeline } from "../hooks/connection";
import Notification from "./Notification";

const NoteLine: FC = () => {
  const { notificationList, loadMoreNotifications, isFetchingNote } =
    useTimeline();
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
        Notification
      </LineHeader>
      <VList style={{ width: "100%" }} ref={ListRef}>
        {notificationList.map((note) => {
          return <Notification noteDataAtom={note} key={note.toString()} />;
        })}
        <div
          className={css({
            w: "100%",
            h: 100,
            p: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgColor: "gray.100",
            _hover: { bgColor: "gray.200" },
          })}
          onClick={() => {
            if (!isFetchingNote) {
              loadMoreNotifications();
            }
          }}
        >
          <p>{isFetchingNote ? "Loading..." : "Click to load"}</p>
        </div>
      </VList>
    </LineWrapper>
  );
};

export default NoteLine;
