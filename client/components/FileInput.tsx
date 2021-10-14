import React, { useState } from "react";
import { Box, Text, Flex, useDisclosure, Spinner } from "@chakra-ui/react";
import Uppy from "@uppy/core";
import Url from "@uppy/url";
import { Dashboard, useUppy } from "@uppy/react";
import Webcam from "@uppy/webcam";
import Instagram from "@uppy/instagram";
import Facebook from "@uppy/facebook";
import GoogleDrive from "@uppy/google-drive";
import Dropbox from "@uppy/dropbox";
import XHRUpload from "@uppy/xhr-upload";
import French from "@uppy/locales/lib/fr_FR";
import Spanish from "@uppy/locales/lib/es_ES";
import Modal from "~components/Modal";
import Upload from "public/assets/img/upload.svg";
import Check from "public/assets/img/check.svg";
import dynamic from "next/dynamic";
import { Control, useController, useFormContext } from "react-hook-form";
import { useTranslation } from "next-i18next";
import axios from "axios";
import useToast from "~hooks/useToast";
import { cardAtom } from "~atoms/card";
import { useSetRecoilState } from "recoil";
import { CARD_DEFAULT_STATE } from "~data/card";

const getUppyTranslations = (locale) => {
  switch (locale) {
    case "fr":
      return French;
    case "es":
      return Spanish;
    default:
      return false;
  }
};
interface Props {
  name: string;
  control: Control;
}

const PLUGINS = [
  "Instagram",
  "Webcam",
  "Url",
  "GoogleDrive",
  "Facebook",
  "Dropbox",
];
const COMPANION_URL = `${process.env.NEXT_PUBLIC_API_URL}/image/companion`;

const FileInput = ({ name, control }: Props) => {
  const { setValue } = useFormContext();
  const setCardState = useSetRecoilState(cardAtom);
  const { errorToast } = useToast();
  const { i18n, t } = useTranslation("generator");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { field } = useController({
    name,
    control,
  });

  const [isLoading, setLoading] = useState(false);

  const deleteFile = () => {
    field.onChange(null);
  };

  const uppy = useUppy(() => {
    return new Uppy({
      id: name,
      autoProceed: true,
      locale: getUppyTranslations(i18n.language),
      debug: true,
      allowMultipleUploads: false,
      restrictions: {
        maxFileSize: 1000000,
        maxNumberOfFiles: 1,
        allowedFileTypes: ["image/*"],
      },
    })
      .use(XHRUpload, {
        endpoint: `${process.env.NEXT_PUBLIC_API_URL}/image/upload`,
        getResponseData: (responseText, response) => ({
          url: responseText,
        }),
      })
      .use(Webcam)
      .use(Url, {
        companionUrl: COMPANION_URL,
      })
      .use(Dropbox, {
        companionUrl: COMPANION_URL,
      })
      .use(Instagram, {
        companionUrl: COMPANION_URL,
      })
      .use(Facebook, {
        companionUrl: COMPANION_URL,
      })
      .use(GoogleDrive, {
        companionUrl: COMPANION_URL,
      })
      .on("upload-success", (file, response) => {
        setLoading(true);
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/image/tmp/get/${response.body.url}`,
            {
              responseType: "blob",
            }
          )
          .then((res) => {
            const reader = new FileReader();
            reader.onload = function (e) {
              field.onChange(e.target.result);
              onClose();
              uppy.reset();

              // Reset transformation values
              setValue(`${name}X`, CARD_DEFAULT_STATE[`${name}X`]);
              setValue(`${name}Y`, CARD_DEFAULT_STATE[`${name}Y`]);
              setValue(`${name}ScaleX`, CARD_DEFAULT_STATE[`${name}ScaleX`]);
              setValue(`${name}ScaleY`, CARD_DEFAULT_STATE[`${name}ScaleY`]);

              // Select uploaded image
              setTimeout(() => {
                setCardState((s) => ({ ...s, selectedImg: name }));
              }, 100);
            };
            reader.readAsDataURL(res.data);
          })
          .catch(() => {
            onClose();
            uppy.reset();
            errorToast(t("uploadFailed"));
          })
          .finally(() => setLoading(false));
      });
  });

  return (
    <Modal
      size="xl"
      onClose={onClose}
      isOpen={isOpen}
      button={
        <Box>
          <Flex
            direction="column"
            justifyContent="center"
            height={10}
            width="100%"
            borderRadius="sm"
            border="1px solid #cacaca"
            overflow="hidden"
            pos="relative"
            bgColor="rgb(255 255 255 / 30%)"
            _hover={{
              borderColor: "#77b2f5",
            }}
            transition="border-color 200ms"
          >
            <Text
              onClick={onOpen}
              color="grey.500"
              fontSize=".9rem"
              fontWeight="500"
              pl="10px"
              cursor="pointer"
            >
              {t("choosePicture")}
            </Text>
            <Box
              position="absolute"
              left={Boolean(field.value) ? 0 : "calc(100% - 38px)"}
              top="50%"
              transform="translateY(-50%)"
              bgColor="text"
              borderRadius="sm"
              h="38px"
              w="38px"
              color="white"
              transition="left ease-in-out 0.5s"
              zIndex="1"
              p=".7rem"
            >
              {isLoading ? (
                <Spinner />
              ) : Boolean(field.value) ? (
                <Check />
              ) : (
                <Upload />
              )}
            </Box>
            <Box
              position="absolute"
              top="0px"
              bottom="0px"
              w="100%"
              left={Boolean(field.value) ? "19px" : "calc(100% - 19px)"}
              transition="left ease-in-out 0.5s"
              bgColor="text"
              pl="3rem"
              color="white"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              cursor="default"
              pointerEvents="unset"
            >
              <Text
                textOverflow="ellipsis"
                w="80%"
                overflow="hidden"
                fontSize=".9rem"
                fontWeight="600"
              >
                {t("pictureAdded")}
              </Text>
            </Box>
          </Flex>
          {Boolean(field.value) && (
            <Text
              fontSize="0.7rem"
              mt={0.5}
              cursor="pointer"
              onClick={deleteFile}
              _hover={{
                textDecoration: "underline",
              }}
            >
              {t("removePicture")}
            </Text>
          )}
        </Box>
      }
    >
      <Dashboard
        uppy={uppy}
        plugins={PLUGINS}
        proudlyDisplayPoweredByUppy={false}
        metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
      />
    </Modal>
  );
};

export default dynamic(() => Promise.resolve(FileInput), {
  ssr: false,
});
