import { TPoll } from "@/src/hooks/connection";
import { FC } from "react";

import { css } from "../../../styled-system/css";

type Props = {
  data: TPoll;
};

const Poll: FC<Props> = ({ data }) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        gap: 2,
        borderRadius: "md",
        p: 3,
      })}
    >
      {data.options.map((option, index) => (
        <div
          key={index}
          className={css({
            display: "flex",
            alignItems: "center",
            gap: 2,
          })}
        >
          <input type="radio" name="poll" value={option.title} />
          <label>
            {option.title} - {option.votesCount}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Poll;
