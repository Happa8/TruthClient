import { css } from "@/styled-system/css";
import { FC, ReactNode } from "react";
import { Menu as ArkMenu } from "@ark-ui/react";

type Props = {
  children?: ReactNode;
  className?: string;
  trigger?: ReactNode;
} & ArkMenu.RootProps;

const Menu: FC<Props> = ({ children, className, trigger, ...props }) => {
  return (
    <ArkMenu.Root {...props}>
      <ArkMenu.Trigger className={className}>{trigger}</ArkMenu.Trigger>
      <ArkMenu.Positioner
        style={{
          zIndex: 20,
        }}
      >
        <ArkMenu.Content
          className={css({
            bgColor: "gray.50",
            p: 2,
            borderColor: "gray.400",
            borderWidth: 1,
            shadow: "sm",
            borderRadius: 4,
          })}
        >
          {children}
        </ArkMenu.Content>
      </ArkMenu.Positioner>
    </ArkMenu.Root>
  );
};

export const MenuItem: FC<ArkMenu.ItemProps> = ({ children, ...props }) => {
  return (
    <ArkMenu.Item
      {...props}
      className={css({
        p: 1,
        minW: 24,
        cursor: "pointer",
        borderRadius: 4,
        zIndex: 21,
        _hover: {
          bgColor: "gray.100",
        },
      })}
    >
      {children}
    </ArkMenu.Item>
  );
};

export default Menu;
