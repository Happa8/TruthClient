import { TMedia } from "@/src/hooks/connection";
import { Portal } from "@zag-js/react";
import { css } from "@/styled-system/css";
import { FC, memo, useState } from "react";
import { Dialog, HoverCard } from "@ark-ui/react";
import { MdClose } from "react-icons/md";

type Props = {
  data: TMedia;
};

const Image: FC<Props> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <HoverCard.Root>
        <HoverCard.Trigger>
          <img
            src={data.previewUrl}
            alt={data.description}
            key={data.id}
            className={css({
              overflow: "hidden",
              w: "100%",
              h: "100%",
              objectFit: "cover",
              cursor: "pointer",
            })}
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          />
        </HoverCard.Trigger>
        <Portal>
          <HoverCard.Positioner>
            <HoverCard.Content>
              <img
                className={css({
                  maxW: "40vw",
                  maxH: "40vh",
                  borderRadius: "sm",
                  boxShadow: "md",
                })}
                src={data.previewUrl}
              />
            </HoverCard.Content>
          </HoverCard.Positioner>
        </Portal>
      </HoverCard.Root>
      <Dialog.Root
        open={isModalOpen}
        onOpenChange={(e) => {
          setIsModalOpen(e.open);
        }}
      >
        <Portal>
          <Dialog.Backdrop
            className={css({
              bgColor: "rgba(0, 0, 0, 0.5)",
              position: "fixed",
              inset: 0,
            })}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <Dialog.Positioner
            className={css({
              height: "100vh",
              width: "100vw",
              display: "flex",
              position: "fixed",
              inset: 0,
            })}
            onClick={(e) => {
              setIsModalOpen(false);
              e.stopPropagation();
            }}
          >
            <Dialog.Content>
              <div
                className={css({
                  w: "100svw",
                  h: "100svh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  objectFit: "contain",
                  position: "relative",
                })}
              >
                <img
                  className={css({
                    maxW: "80%",
                    maxH: "80%",
                    display: "block",
                    margin: "auto",
                    position: "fixed",
                    inset: 0,
                    borderRadius: "sm",
                    boxShadow: "md",
                  })}
                  src={data.previewUrl}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </div>
              <div
                className={css({
                  position: "absolute",
                  top: 10,
                  right: 10,
                  fontSize: "x-large",
                  color: "gray.300",
                  cursor: "pointer",
                })}
                onClick={(e) => {
                  setIsModalOpen(false);
                  e.stopPropagation();
                }}
              >
                <MdClose />
              </div>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default Image;
