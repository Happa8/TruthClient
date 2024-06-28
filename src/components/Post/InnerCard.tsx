import { FC } from "react";
import { TCard } from "@/src/hooks/connection";
import { css } from "@/styled-system/css";
import { MdLink } from "react-icons/md";

type Props = {
  carddata: TCard;
};

const InnerCard: FC<Props> = ({ carddata }) => {
  return (
    <a
      href={carddata.url}
      target="_blank"
      rel="noopener noreferrer"
      className={css({
        w: "100%",
        border: "solid",
        borderColor: "gray.300",
        borderWidth: 1,
        borderRadius: "md",
        fontSize: "small",
        display: "flex",
        flexDir: "column",
        overflow: "hidden",
      })}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {carddata.image !== "" ? (
        <img
          className={css({
            w: "100%",
            h: 120,
            overflow: "hidden",
            objectFit: "cover",
          })}
          src={carddata.image}
        />
      ) : (
        <></>
      )}

      <div className={css({ p: 3 })}>
        <p
          className={css({
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            w: "100%",
            fontWeight: "bold",
          })}
        >
          {carddata.title}
        </p>
        <p
          className={css({
            //   whiteSpace: "pre-wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            w: "100%",
            maxH: 20,
          })}
        >
          {carddata.description}
        </p>
        <p
          className={css({
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "gray.500",
          })}
        >
          <span className={css({ fontSize: "sm" })}>
            <MdLink />
          </span>
          <span>{carddata.providerName}</span>
        </p>
      </div>
    </a>
  );
};

export default InnerCard;
