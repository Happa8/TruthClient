import { TPoll } from "@/src/hooks/connection";
import { FC, useState } from "react";

import { css } from "../../../styled-system/css";
import { MdCheckCircle } from "react-icons/md";
import { createListCollection, Format, Listbox } from "@ark-ui/react";
import Button from "../Common/Button";
import { useVotePoll } from "@/src/hooks/post";

type Props = {
  data: TPoll;
};

const Poll: FC<Props> = ({ data: originalData }) => {
  const collection = createListCollection({
    items: originalData.options.map((option) => option.title),
  });
  const [value, setValue] = useState<string[]>([]);

  const [data, setData] = useState(originalData);

  const { mutateAsync, status } = useVotePoll();

  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        gap: 2,
        borderRadius: "md",
      })}
    >
      {data.voted || data.expired ? (
        <div
          className={css({
            display: "flex",
            flexDir: "column",
            gap: 2,
            borderRadius: "md",
            // p: 3,
          })}
        >
          {data.options.map((option, index) => (
            <div
              key={index}
              className={css({
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "gray.50",
                py: 1,
                px: 2,
                borderRadius: "md",
                zIndex: 0,
                position: "relative",
                border: "solid",
                borderColor: "gray.300",
                borderWidth: "1px",
              })}
            >
              <p
                className={css({
                  color: "gray.900",
                  fontSize: "sm",
                  zIndex: 2,
                })}
              >
                {option.title}
                <span
                  className={css({
                    display: "inline-block",
                    marginLeft: "1rem",
                    color: "gray.500",
                    fontSize: "sm",
                    zIndex: 2,
                    textAlign: "right",
                  })}
                >
                  {option.votesCount} votes
                </span>
                {data.voted && data.ownVotes.includes(index) && (
                  <span
                    className={css({
                      display: "inline-block",
                      color: "gray.500",
                      fontSize: "sm",
                      zIndex: 2,
                      marginLeft: "0.5rem",
                      transform: "translateY(0.1rem)",
                    })}
                  >
                    <MdCheckCircle />
                  </span>
                )}
              </p>

              <div
                className={css({
                  backgroundColor: "gray.200",
                  height: "100%",
                  borderRadius: "md",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  zIndex: 1,
                })}
                style={{
                  width: `${(option.votesCount / data.votesCount) * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        // 未投票時
        <>
          <Listbox.Root
            disabled={status === "pending"}
            collection={collection}
            selectionMode={data.multiple ? "multiple" : "single"}
            onValueChange={(e) => setValue(e.value)}
            value={value}
          >
            <Listbox.Content
              className={css({
                display: "flex",
                flexDir: "column",
                gap: 2,
                borderRadius: "md",
              })}
            >
              {collection.items.map((item) => (
                <Listbox.Item
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  key={item}
                  item={item}
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "gray.50",
                    py: 1,
                    px: 2,
                    borderRadius: "md",
                    zIndex: 0,
                    position: "relative",
                    color: "gray.900",
                    fontSize: "sm",

                    border: "solid",
                    borderColor: "gray.300",
                    borderWidth: "1px",

                    "&[data-state='checked']": {
                      backgroundColor: "gray.200",
                    },
                  })}
                >
                  <Listbox.ItemText>{item}</Listbox.ItemText>
                  <Listbox.ItemIndicator
                    className={css({
                      color: "gray.500",
                    })}
                  >
                    <MdCheckCircle />
                  </Listbox.ItemIndicator>
                </Listbox.Item>
              ))}
            </Listbox.Content>
          </Listbox.Root>
          <Button
            disabled={status === "pending" || value.length === 0}
            onClick={(e) => {
              e.stopPropagation();
              if (value.length === 0) {
                return;
              }
              mutateAsync({
                poll: data,
                choiseIndex: value.map((v) => {
                  const index = data.options.findIndex((o) => o.title === v);
                  if (index === -1) {
                    throw new Error("Invalid option");
                  }
                  return index;
                }),
              }).then((res) => {
                console.log(res);
                setData(res);
                setValue([]);
              });
            }}
          >
            {status === "pending" ? "Voting..." : "Vote"}
          </Button>
        </>
      )}
      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          color: "gray.500",
          fontSize: "sm",
        })}
      >
        <p>
          {data.votesCount} votes・
          {data.expired ? (
            "Closed"
          ) : (
            <Format.RelativeTime value={data.expiresAt} />
          )}
        </p>
      </div>
    </div>
  );
};

export default Poll;
