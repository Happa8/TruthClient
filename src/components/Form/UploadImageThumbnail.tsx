import { css, cx } from "@/styled-system/css";
import { FC } from "react";
import { MdClose } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

type Props = {
  file: File;
  className?: string;
  status: "uploading" | "uploaded" | "failed";
  onClickClose?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const UploadImageThumbnail: FC<Props> = ({
  file,
  className,
  status,
  onClickClose,
}) => {
  return (
    <div
      className={cx(
        css({
          width: 14,
          height: 14,
          aspectRatio: "1 / 1",
          overflow: "hidden",
          borderRadius: 4,
          borderColor: "gray.300",
          borderWidth: 1,
          position: "relative",
        }),
        className
      )}
    >
      <img
        className={css({
          width: "100%",
          height: "100%",
          objectFit: "cover",
        })}
        src={URL.createObjectURL(file)}
        alt="thumbnail"
      />
      <div
        className={css({
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          color: "white",
          padding: 1,
          borderRadius: "0 2px 0 2px",
          cursor: "pointer",
          fontSize: "x-small",
          zIndex: 10,
        })}
        onClick={(e) => {
          onClickClose && onClickClose(e);
        }}
      >
        <MdClose />
      </div>
      {status === "uploading" && (
        <div
          className={css({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "x-large",
            color: "white",
          })}
        >
          <FaSpinner
            className={css({
              animation: "spin 3s linear infinite",
            })}
          />
        </div>
      )}
    </div>
  );
};

export default UploadImageThumbnail;
