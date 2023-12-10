import { FC } from "react";
import { css } from "../../styled-system/css";
import { TPost } from "../hooks/connection";

type Props = {
  data: TPost;
  // AddInfo?: JSX.Element;
};

const oneSecond = 1000;
const oneMinute = 60 * oneSecond;
const oneHour = 60 * oneMinute;
const oneDay = 24 * oneHour;
const oneWeek = 7 * oneDay;

const calcTimeDelta = (time: Date): string => {
  const now = new Date();
  const timeDelta = now.getTime() - time.getTime();

  if (timeDelta > 4 * oneWeek) {
    return time.toLocaleString("en", { month: "short", day: "2-digit" });
  } else if (timeDelta > oneWeek) {
    return `${Math.floor(timeDelta / oneWeek)}w`;
  } else if (timeDelta > oneDay) {
    return `${Math.floor(timeDelta / oneDay)}d`;
  } else if (timeDelta > oneHour) {
    return `${Math.floor(timeDelta / oneHour)}h`;
  } else if (timeDelta > oneMinute) {
    return `${Math.floor(timeDelta / oneMinute)}m`;
  } else if (timeDelta > oneSecond) {
    return `${Math.floor(timeDelta / oneSecond)}s`;
  } else {
    return "now";
  }
};

const PostCore: FC<Props> = ({ data }) => {
  return (
    <div
      className={css({
        bgColor: "gray.100",
        p: 2,
        borderY: "solid",
        borderYWidth: 1,
        borderColor: "gray.200",
      })}
      key={data.id}
    >
      <p>
        <span
          className={css({
            fontWeight: "bold",
            color: "gray.900",
          })}
        >
          {data.account.displayName}
        </span>
        <span
          className={css({
            fontSize: "small",
            color: "gray.700",
          })}
        >
          @{data.account.userName}
        </span>
        <span
          className={css({
            fontSize: "small",
            color: "gray.700",
          })}
        >
          ・{calcTimeDelta(data.createdAt)}
        </span>
      </p>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
      <p>
        RT:{data.reblogsCount} fav:{data.favouritesCount} RP:{data.repliesCount}
      </p>
    </div>
  );
};

export default PostCore;
