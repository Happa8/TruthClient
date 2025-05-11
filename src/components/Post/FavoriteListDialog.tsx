import { UseDialogReturn } from "@ark-ui/react";
import Dialog from "../Common/Dialog";
import { css } from "@/styled-system/css";
import { FC } from "react";
import { useFavoritedUsers } from "@/src/hooks/connection";

type Props = {
  postId: string;
  dialogValue: UseDialogReturn;
};

const FavoriteListDialog: FC<Props> = ({ postId, dialogValue: dialog }) => {
  const { data: favoriteUsers, status } = useFavoritedUsers({
    postId: postId,
    enabled: dialog.open,
  });

  return (
    <>
      <Dialog
        dialogValue={dialog}
        title="Favorited Users"
        lazyMount={true}
        unmountOnExit={true}
      >
        <div
          className={css({
            display: "flex",
            flexDir: "column",
            gap: 4,
            borderRadius: "md",
            width: "300px",
          })}
        >
          {status === "pending" && (
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              })}
            >
              <p
                className={css({
                  fontSize: "sm",
                  color: "gray.700",
                })}
              >
                Loading...
              </p>
            </div>
          )}

          {favoriteUsers?.pages
            .reduce((acc, page) => {
              return acc.concat(page);
            }, [])
            .map((user) => (
              <div
                key={user.id}
                className={css({
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                })}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={css({
                    borderRadius: "full",
                    width: "28px",
                    height: "28px",
                    objectFit: "cover",
                  })}
                />
                <div
                  className={css({
                    display: "flex",
                    flexDir: "column",
                  })}
                >
                  <p
                    className={css({
                      fontWeight: "bold",
                      fontSize: "sm",
                      color: "gray.900",
                      lineHeight: "none",
                    })}
                  >
                    {user.name}
                  </p>
                  <p
                    className={css({
                      fontSize: "xs",
                      color: "gray.700",
                    })}
                  >
                    @{user.userName}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </Dialog>
    </>
  );
};

export default FavoriteListDialog;
