import { useAtomValue } from "jotai";
import { tokenAtom } from "../atoms";
import { TMedia, convertMedia } from "./connection";
import { useMutation } from "@tanstack/react-query";

type TUploadMedia = {
  type: "image";
  file: File;
};

const uploadMedia = async (
  accessToken: string,
  data: TUploadMedia
): Promise<TMedia> => {
  const formData = new FormData();
  formData.append("file", data.file);

  const res = await fetch(`https://truthsocial.com/api/v1/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => convertMedia(res));

  return res;
};

export const useUploadMedia = () => {
  const accessToken = useAtomValue(tokenAtom);

  return useMutation({
    mutationFn: (data: TUploadMedia) => uploadMedia(accessToken, data),
  });
};
