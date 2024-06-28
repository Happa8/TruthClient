import { css } from "@/styled-system/css";
import { ComponentProps, FC } from "react";
import LineWrapper from "./LineWrapper";
import LineHeader from "./LineHeader";
import TruthSubmitForm from "./TruthSubmitForm";
import Button from "./Common/Button";
import { useLogout } from "../hooks/auth";

type Props = ComponentProps<"div">;

const SendLine: FC<Props> = () => {
  const logout = useLogout();

  return (
    <LineWrapper>
      <LineHeader>
        Truthdeck
        <span
          className={css({
            fontSize: "xs",
            fontWeight: "bold",
            color: "gray.500",
            ml: 2,
            px: 1,
            bg: "gray.200",
          })}
        >
          ALPHA
        </span>
      </LineHeader>
      <div
        className={css({
          display: "flex",
          padding: 2,
          flexDir: "column",
          w: "100%",
          h: "100%",
          gap: 1,
        })}
      >
        <TruthSubmitForm />
        <div
          className={css({
            flexGrow: 1,
            display: "flex",
            flexDir: "column",
            justifyContent: "flex-end",
            padding: 2,
          })}
        >
          <Button
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </LineWrapper>
  );
};

export default SendLine;
