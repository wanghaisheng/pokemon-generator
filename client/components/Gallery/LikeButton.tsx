import React, { useState, useEffect } from "react";
import { ButtonProps, Icon, Flex } from "@chakra-ui/react";
import Heart from "public/assets/img/heart.svg";
import useLike, { State } from "~hooks/useLike";
import { Card } from "~@types/Card";
import { useQueryClient, InfiniteData } from "react-query";
import { useSetRecoilState } from "recoil";
import { cardModalAtom } from "~atoms/card-modal";
import { motion } from "framer-motion";
import { CachedQuery } from "~@types/CachedQuery";
import { useTranslation } from "next-i18next";
import { QUERY_KEY } from "~hooks/useCard";

interface Props extends ButtonProps {
  card: Card;
  cachedQuery: CachedQuery;
}

const LikeButton = ({ card, cachedQuery, ...rest }: Props) => {
  const { t } = useTranslation("gallery");
  const queryClient = useQueryClient();
  const setCard = useSetRecoilState(cardModalAtom);
  const [isLiked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(card.has_liked > 0);
  }, [card.id, card.has_liked]);

  const { mutate } = useLike({
    onMutate: async () => {
      if (!cachedQuery) return;
      const previousValue = queryClient.getQueryData<InfiniteData<Card[]>>(
        cachedQuery.key
      );

      if (previousValue) {
        queryClient.setQueryData<InfiniteData<Card[]>>(
          cachedQuery.key,
          (old) => {
            const page = old.pages[cachedQuery.indexPage];
            const index = page.findIndex((c) => c.id === card.id);

            if (index === -1) return old;

            const newPage = [...page];

            newPage[index] = {
              ...newPage[index],
              likes: isLiked ? page[index].likes - 1 : page[index].likes + 1,
              has_liked: isLiked ? 0 : 1,
            };

            setLiked(!isLiked);

            setCard((c) => {
              return {
                ...c,
                card: {
                  ...c.card,
                  likes: isLiked ? c.card.likes - 1 : c.card.likes + 1,
                },
              };
            });

            old.pages.splice(cachedQuery.indexPage, 1, newPage);

            return {
              pageParams: old.pageParams,
              pages: old.pages,
            };
          }
        );
      }

      return { previousValue, isLiked };
    },
    onError: (
      err,
      variables,
      context: { previousValue: InfiniteData<Card[]>; isLiked: boolean }
    ) => {
      if (context?.previousValue) {
        queryClient.setQueryData<InfiniteData<Card[]>>(
          cachedQuery.key,
          context.previousValue
        );
        setLiked(context.isLiked);
      }
    },
    onSuccess: (res) => {
      setLiked(res.state === State.LIKED);

      queryClient.setQueryData<Card>([QUERY_KEY, card.id], {
        ...card,
        likes: res.nb,
      });
    },
  });

  const onClick = async () => {
    mutate({
      cardId: card.id,
    });
  };

  return (
    <motion.div
      style={{
        display: "inline-flex",
        borderRadius: "0.8rem",
        padding: "0.5rem 1.5rem 0.5rem 0.8rem",
        alignItems: "center",
        backdropFilter: "blur(15px) saturate(180%)",
        transitionDuration: "100ms",
        transitionTimingFunction: "ease-in-out",
        transitionProperty: "transform",
        color: "white",
        cursor: "pointer",
        backgroundColor: "rgb(255 255 255 / 28%)",
      }}
      initial={{
        scale: 1,
      }}
      whileTap={{
        scale: 0.9,
      }}
      whileHover={{
        scale: 1.05,
      }}
      onClick={onClick}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        mr="0.4rem"
        w="2.5rem"
        h="2.5rem"
        alignSelf="center"
      >
        <Icon
          as={Heart}
          color={isLiked ? "myPink" : "transparent"}
          w="2.5rem"
          height="1.5rem"
          p="0.1rem"
          strokeWidth="2px"
          stroke={isLiked ? "myPink" : "white"}
        />
      </Flex>
      <Flex flexDirection="column" fontSize="1.2rem" userSelect="none">
        {isLiked ? t("modal.liked") : t("modal.like")}
      </Flex>
    </motion.div>
  );
};

export default LikeButton;