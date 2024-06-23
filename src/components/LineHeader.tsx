import { FC } from "react";
import { css } from "../../styled-system/css";

type Props = {
  title: string;
};

const LineHeader: FC<Props> = ({ title }) => {
  return (
    <div
      className={css({
        h: 50,
        p: 4,
        display: "flex",
        alignItems: "center",
        borderBottom: "solid",
        borderBottomWidth: "2px",
        borderColor: "gray.200",
      })}
    >
      <p
        className={css({
          fontWeight: "bold",
          fontSize: "large",
          color: "gray.700",
        })}
      >
        {title}
      </p>
    </div>
  );
};

export default LineHeader;
