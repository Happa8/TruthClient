import { ComponentProps, FC, ReactNode } from "react";
import { css } from "../../styled-system/css";
import { MdClose } from "react-icons/md";

type Props = {
  onClickClose?: () => void;
  children?: ReactNode;
} & ComponentProps<"div">;

const LineHeader: FC<Props> = ({ children, onClickClose, ...props }) => {
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
        position: "relative",
      })}
      {...props}
    >
      <p
        className={css({
          fontWeight: "bold",
          fontSize: "large",
          color: "gray.700",
        })}
      >
        {children}
      </p>
      {onClickClose && (
        <button
          className={css({
            fontSize: "large",
            color: "gray.700",
            position: "absolute",
            right: 4,
            cursor: "pointer",
          })}
          onClick={onClickClose}
        >
          <MdClose />
        </button>
      )}
    </div>
  );
};

export default LineHeader;
