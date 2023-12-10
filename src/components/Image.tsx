import { TMedia } from "../hooks/connection";
import * as hovercard from "@zag-js/hover-card";
import { useMachine, normalizeProps, Portal } from "@zag-js/react";
import { css } from "../../styled-system/css";
import { FC, useState } from "react";

type Props = {
  data: TMedia;
};

const Image: FC<Props> = ({ data }) => {
  const [state, send] = useMachine(hovercard.machine({ id: data.id }));
  const api = hovercard.connect(state, send, normalizeProps);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <img
        src={data.previewUrl}
        alt={data.description}
        key={data.id}
        className={css({
          overflow: "hidden",
          w: "100%",
          h: "100%",
          objectFit: "cover",
        })}
        onClick={() => {
          setIsModalOpen(true);
        }}
        {...api.triggerProps}
      />
      {api.isOpen && (
        <Portal>
          <div {...api.positionerProps}>
            <div {...api.contentProps}>
              <div {...api.arrowProps}>
                <div {...api.arrowTipProps} />
              </div>
              <img
                className={css({
                  maxW: "40vw",
                  maxH: "40vh",
                  borderRadius: "sm",
                  boxShadow: "md",
                })}
                src={data.previewUrl}
              />
            </div>
          </div>
        </Portal>
      )}
      {isModalOpen && (
        <Portal>
          <div
            className={css({
              position: "absolute",
              top: 0,
              left: 0,
              w: "100svw",
              h: "100svh",
              bgColor: "black",
              overscrollBehavior: "contain",
              overflow: "hidden",
            })}
          ></div>
        </Portal>
      )}
    </>
  );
};

export default Image;
