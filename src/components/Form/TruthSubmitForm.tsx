import { css, cx } from "@/styled-system/css";
import { FC, useEffect, useState } from "react";
import TextArea from "@/src/components/Common/TextArea";
import { atom, useAtom, useAtomValue } from "jotai";
import { usePostTruth } from "@/src/hooks/post";
import {
  QuotePostAtom,
  ReplyPostAtom,
  useNullableAtomValue,
} from "@/src/atoms";
import InnerPost from "@/src/components/Post/InnerPost";
import { MdCancel, MdImage } from "react-icons/md";
import { FileUpload } from "@ark-ui/react";
import UploadImageThumbnail from "./UploadImageThumbnail";
import { useUploadMedia } from "@/src/hooks/media";
import { TMedia } from "@/src/hooks/connection";

type Props = {
  className?: string;
};

type TDisplayMedia = {
  type: "image";
  status: "uploading" | "uploaded" | "failed";
  file: File;
  uniqueKey: string;
  data?: TMedia;
};

const truthTextAtom = atom<string>("");
const truthTextCountAtom = atom<number>(
  (get) => [...get(truthTextAtom)].length
);

const TruthSubmitForm: FC<Props> = ({ className }) => {
  // 入力管理
  const [truthText, setTruthText] = useAtom(truthTextAtom);
  const truthTextCount = useAtomValue(truthTextCountAtom);

  // 引用投稿
  const [quotePostAtom, setQuotePostAtom] = useAtom(QuotePostAtom);
  const quotePost = useNullableAtomValue(quotePostAtom);

  // リプライ投稿
  const [replyPostAtom, setReplyPostAtom] = useAtom(ReplyPostAtom);
  const _replyPost = useNullableAtomValue(replyPostAtom);
  const replyPost =
    _replyPost?.reblog !== null ? _replyPost?.reblog : _replyPost;

  // リプライ対象のアカウント
  // リプライ元Truthのメンションにアカウントがあればそれを
  // なければリプライ元のアカウントを追加
  const [replyToAccounts, setReplyToAccounts] = useState<string[]>(
    replyPost
      ? replyPost.mentions.length > 0
        ? replyPost.mentions.map((mention) => mention.username)
        : [replyPost.account.userName]
      : []
  );

  // replyPostに更新があったら、replyToAccountsを更新
  useEffect(() => {
    setReplyToAccounts(
      replyPost
        ? replyPost.mentions.length > 0
          ? replyPost.mentions.map((mention) => mention.username)
          : [replyPost.account.userName]
        : []
    );
  }, [replyPost]);

  // アップロードするMedia
  const [media, setMedia] = useState<TDisplayMedia[]>([]);

  // 投稿処理のためのフック
  const { mutateAsync, status } = usePostTruth();

  // すべてのメディアがアップロードされたかどうか
  const [isUploadedAllMedia, setIsUploadedAllMedia] = useState(false);
  useEffect(() => {
    if (media.length > 0) {
      setIsUploadedAllMedia(
        media.filter((m) => m.status === "uploading").length === 0
      );
    } else {
      setIsUploadedAllMedia(true);
    }
  }, [media]);

  // 投稿可能かどうか
  const isCanSubmit =
    (truthTextCount > 0 || media.length > 0) && status !== "pending";

  const [isSending, setIsSending] = useState(false);

  // 実際の投稿処理
  // isSendingがtrueのとき、かつ、すべてのメディアがアップロードされているときに投稿
  useEffect(() => {
    if (isSending) {
      if (isUploadedAllMedia) {
        mutateAsync({
          content: truthText,
          quoteId: quotePost?.id,
          replyId: replyPost?.id,
          replyAccountUserNames:
            replyToAccounts.length > 0 ? replyToAccounts : undefined,
          mediaIds: media
            .filter((m) => m.status === "uploaded" && m.data !== undefined)
            .map((m) => m.data?.id as string),
        }).then(() => {
          // 投稿後、各種入力を初期化
          setTruthText("");
          setQuotePostAtom(null);
          setReplyPostAtom(null);
          setReplyToAccounts([]);
          setMedia([]);
          setIsSending(false);
        });
        setIsSending(false);
      }
    }
  }, [isSending, isUploadedAllMedia]);
  // ↑isSendingとisUploadedAllMediaが変更されたときに実行

  // 投稿処理
  // isSendingをtrueにすること=投稿処理を開始すること
  const submit = () => {
    if (isSending) {
      return;
    }
    if (!isCanSubmit) {
      return;
    }

    setIsSending(true);
  };

  // 投稿のショートカット
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      submit();
    }
  };

  // メディアのアップロードのためのフック
  const { mutateAsync: uploadMediaAsync } = useUploadMedia();

  // 画像追加処理
  const handleAddMedia = (file: File) => {
    setMedia((prev) => {
      if (prev.length >= 4) {
        return prev;
      } else {
        const key = `${file.name}-${Date.now()}`;
        uploadMediaAsync({
          file: file,
          type: "image",
        }).then((res) => {
          setMedia((prev) =>
            prev.map((media) =>
              media.uniqueKey === key
                ? { ...media, status: "uploaded", data: res }
                : media
            )
          );
        });
        return prev.concat({
          type: "image",
          status: "uploading",
          file,
          uniqueKey: key,
        });
      }
    });
  };

  const handlePasteImage = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) {
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (!blob) {
          continue;
        }
        handleAddMedia(blob);
        e.preventDefault();
        break;
      }
    }
  };

  return (
    <form
      className={cx(
        css({
          bgColor: "white",
          padding: 2,
          display: "flex",
          flexDir: "column",
          gap: 2,
        }),
        className
      )}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {replyPostAtom && (
        <div
          className={css({
            display: "flex",
            flexDir: "column",
            gap: 2,
          })}
        >
          <div
            className={css({
              position: "relative",
            })}
          >
            <InnerPost postdataAtom={replyPostAtom} />
            <button
              type="button"
              className={css({
                position: "absolute",
                top: 0,
                right: 0,
                padding: 2,
                cursor: "pointer",
                color: "gray.400",
              })}
              onClick={() => {
                setReplyPostAtom(null);
              }}
            >
              <MdCancel />
            </button>
          </div>
          <p
            className={css({
              fontSize: "sm",
              color: "gray.600",
              px: 1,
            })}
          >
            Reply to&nbsp;
            {replyToAccounts.length === 0 && "the post"}
            {replyToAccounts.map((account) => (
              <span
                className={css({
                  display: "inline-flex",
                  alignItems: "center",
                })}
              >
                <span
                  className={css({
                    color: "green.700",
                  })}
                >
                  @{account}&nbsp;
                </span>
                <span
                  className={css({
                    color: "gray.400",
                    cursor: "pointer",
                    _hover: { color: "gray.600" },
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    setReplyToAccounts(
                      replyToAccounts.filter((a) => a !== account)
                    );
                  }}
                >
                  <MdCancel />
                </span>
              </span>
            ))}
          </p>
        </div>
      )}

      <TextArea
        value={truthText}
        onChange={(e) => setTruthText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What's your Truth?"
        onPaste={handlePasteImage}
        disabled={isSending}
      />

      {quotePostAtom && (
        <div
          className={css({
            position: "relative",
          })}
        >
          <InnerPost postdataAtom={quotePostAtom} />
          <button
            type="button"
            className={css({
              position: "absolute",
              top: 0,
              right: 0,
              padding: 2,
              cursor: "pointer",
              color: "gray.400",
            })}
            onClick={() => {
              setQuotePostAtom(null);
            }}
          >
            <MdCancel />
          </button>
        </div>
      )}

      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <span
          className={css({
            fontSize: "xs",
            color: truthTextCount > 1000 ? "red.500" : "gray.600",
          })}
        >
          {truthTextCount} / 1000
        </span>
        <div>
          <FileUpload.Root
            accept={{
              "image/png": [".png", ".PNG"],
              "image/jpeg": [".jpg", ".jpeg", ".JPG", ".JPEG"],
            }}
            onFileAccept={(e) => {
              // ファイルを追加
              if (e.files.length === 0) {
                return;
              }

              if (e.files.length + media.length > 4) {
                return;
              }

              e.files.forEach((file) => {
                handleAddMedia(file);
              });
            }}
          >
            <FileUpload.Trigger
              className={css({
                fontSize: "lg",
                color: "gray.600",
                cursor: "pointer",
                _hover: { color: "gray.800" },
              })}
            >
              <MdImage />
            </FileUpload.Trigger>
            <FileUpload.HiddenInput />
          </FileUpload.Root>
        </div>
      </div>

      <div
        className={css({
          display: "flex",
          flexDir: "row",
          gap: 2,
        })}
      >
        {media.map((m) => (
          <UploadImageThumbnail
            file={m.file}
            key={m.uniqueKey}
            status={m.status}
            onClickClose={() => {
              setMedia((prev) =>
                prev.filter((media) => media.uniqueKey !== m.uniqueKey)
              );
            }}
          />
        ))}
      </div>

      <button
        type="submit"
        className={css({
          w: "100%",
          padding: 2,
          bgColor: "gray.200",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        })}
        disabled={!isCanSubmit}
      >
        {isSending ? "Sending your Truth..." : "Truth!"}
      </button>
    </form>
  );
};

export default TruthSubmitForm;
