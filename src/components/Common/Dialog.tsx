import { css } from "@/styled-system/css";
import { Dialog as ArkDialog, Portal, UseDialogReturn } from "@ark-ui/react";
import { FC, ReactNode } from "react";
import { MdClose } from "react-icons/md";

type Props = {
  title?: ReactNode;
  children?: ReactNode;
  dialogValue: UseDialogReturn;
} & Omit<ArkDialog.RootProviderProps, "value">;

const Dialog: FC<Props> = ({ title, children, dialogValue, ...props }) => {
  return (
    <ArkDialog.RootProvider value={dialogValue} {...props}>
      <Portal>
        <ArkDialog.Backdrop
          className={css({
            position: "fixed",
            inset: 0,
            bgColor: "rgba(0, 0, 0, 0.5)",
          })}
        />
        <ArkDialog.Positioner
          className={css({
            height: "100vh",
            width: "100vw",
            display: "flex",
            position: "fixed",
            inset: 0,
          })}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ArkDialog.Content
            className={css({
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgColor: "white",
              borderRadius: "md",
              boxShadow: "lg",
              padding: 6,
              fontFamily: "notosans",
            })}
          >
            <ArkDialog.Title
              className={css({
                fontSize: "lg",
                fontWeight: "bold",
                marginBottom: 4,
                color: "gray.800",
              })}
            >
              {title ?? "Dialog Title"}
            </ArkDialog.Title>
            <ArkDialog.Description>
              {children ?? "Dialog content goes here."}
            </ArkDialog.Description>
            <ArkDialog.CloseTrigger
              className={css({
                position: "absolute",
                top: 4,
                right: 4,
                cursor: "pointer",
                color: "gray.500",
                "&:hover": {
                  color: "gray.800",
                },
              })}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MdClose />
            </ArkDialog.CloseTrigger>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.RootProvider>
  );
};

export default Dialog;
