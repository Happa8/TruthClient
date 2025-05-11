import { UseDialogReturn } from "@ark-ui/react";
import Dialog from "../Common/Dialog";
import { css } from "@/styled-system/css";
import { FC } from "react";
import { useRebloggedUsers } from "@/src/hooks/connection";

type Props = {
  postId: string;
  dialogValue: UseDialogReturn;
};

const RepostListDialog: FC<Props> = ({ postId, dialogValue: dialog }) => {
  const { data, status, hasNextPage, fetchNextPage } = useRebloggedUsers({
    postId: postId,
    enabled: dialog.open,
  });

  return (
    <>
      <Dialog
        dialogValue={dialog}
        title="Retruthed Users"
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
            maxHeight: "80vh",
            overflowY: "auto",
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

          {data?.pages
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
          {hasNextPage && (
            <button
              className={css({
                borderRadius: "md",
                padding: 2,
                fontSize: "sm",
                cursor: "pointer",
                color: "gray.700",
                transition: "0.2s",
                _hover: {
                  color: "gray.900",
                  backgroundColor: "gray.100",
                },
              })}
              onClick={() => {
                // Load more users
                fetchNextPage();
              }}
            >
              Load more
            </button>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default RepostListDialog;
