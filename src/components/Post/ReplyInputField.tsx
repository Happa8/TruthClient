import { css, cx } from "@/styled-system/css";
import { Collapsible } from "@ark-ui/react";
import { FC } from "react";

type Props = {
  className?: string;
  open: boolean;
};

const ReplyInputField: FC<Props> = ({ className, open }) => {
  return (
    <Collapsible.Root className={cx(css({}), className)} lazyMount open={open}>
      <Collapsible.Content
        className={css({
          bgColor: "gray.50",
        })}
      >
        Reply
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default ReplyInputField;
