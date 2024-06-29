import { FC, memo, useEffect, useState } from "react";
import { TNotification, TNotificationAtom } from "@/src/hooks/connection";
import InnerPost from "@/src/components/Post/InnerPost";
import { css } from "@/styled-system/css";
import { calcTimeDelta } from "@/src/utils";
import { MdFavorite, MdRepeat, MdPerson } from "react-icons/md";
import { GoMention } from "react-icons/go";
import { useAtom, useAtomValue } from "jotai";
import { ColumnsAtom } from "@/src/atoms";

type Props =
  | {
      noteData: TNotification;
    }
  | {
      noteDataAtom: TNotificationAtom;
    };

const describeNote = (type: TNotification["type"]): string => {
  switch (type) {
    case "favourite":
      return "liked";
    case "mention":
      return "mentioned you";
    case "reblog":
      return "retruthed";
    case "follow":
      return "followed you";
    default:
      return "";
  }
};

const noteIcon = (type: TNotification["type"]) => {
  switch (type) {
    case "favourite":
      return <MdFavorite />;
    case "reblog":
      return <MdRepeat />;
    case "follow":
      return <MdPerson />;
    case "mention":
      return <GoMention />;
  }
};

const noteColor = (type: TNotification["type"]) => {
  switch (type) {
    case "favourite":
      return "pink.700";
    case "reblog":
      return "green.700";
    case "mention":
    case "follow":
      return "blue.700";
    default:
      return "gray.700";
  }
};

const NotificationCore: FC<{
  noteData: TNotification;
}> = ({ noteData }) => {
  const [_, dispatchColumn] = useAtom(ColumnsAtom);

  const [isSelecting, setIsSelecting] = useState(false);
  useEffect(() => {
    const handleSelectionChange = () => {
      // テキストが選択されているかどうかを確認
      const selection = window.getSelection();
      setIsSelecting(
        selection !== null ? selection.toString().length > 0 : false
      );
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return (
    <div
      className={css({
        bgColor: "gray.100",
        p: 4,
        px: 4,
        borderY: "solid",
        borderYWidth: 1,
        borderColor: "gray.200",
        w: "100%",
        display: "flex",
        flexDir: "column",
        gap: 2,
        color: "gray.800",
        _hover: {
          bgColor: "gray.200",
        },
        cursor: "pointer",
      })}
      onClick={() => {
        if (!isSelecting) {
          noteData.status &&
            dispatchColumn({
              type: "push",
              value: {
                type: "PostDetail",
                postId: noteData.status.id,
              },
            });
        }
      }}
    >
      <p
        className={css({
          fontSize: "small",
          display: "inline-flex",
          alignItems: "center",
          flexFlow: "wrap",
        })}
      >
        <span
          className={css({
            display: "inline",
            fontSize: "md",
            color: noteColor(noteData.type),
          })}
        >
          {noteIcon(noteData.type)}
        </span>
        <span className={css({ mx: 2 })}>
          <img
            className={css({
              h: 6,
              w: 6,
              borderRadius: "full",
              display: "inline",
            })}
            src={noteData.account.avatar}
          />
        </span>
        <span className={css({ fontWeight: "bold" })}>
          {noteData.account.name}
        </span>
        &nbsp;
        <span>{describeNote(noteData.type)}</span>&nbsp;
        <span>・{calcTimeDelta(noteData.createdAt)}</span>
      </p>
      {noteData.status !== undefined ? (
        <InnerPost postdata={noteData.status} showCard={false} />
      ) : (
        <></>
      )}
    </div>
  );
};

const NotificationWithAtom: FC<{ noteDataAtom: TNotificationAtom }> = ({
  noteDataAtom,
}) => {
  const noteData = useAtomValue(noteDataAtom);
  return <NotificationCore noteData={noteData} />;
};

const Notification: FC<Props> = ({ ...props }) => {
  if ("noteData" in props) {
    return <NotificationCore noteData={props.noteData} />;
  } else if ("noteDataAtom" in props) {
    return <NotificationWithAtom noteDataAtom={props.noteDataAtom} />;
  }
  return <></>;
};

const memoizedNotification = memo(Notification);

export default memoizedNotification;
