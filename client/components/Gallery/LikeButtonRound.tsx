import React, { useEffect, useState } from "react";
import { Button, ButtonProps, Icon, Box } from "@chakra-ui/react";
import Heart from "public/assets/img/heart.svg";
import useLike from "~hooks/useLike";
import { Card } from "~@types/Card";
import { CachedQuery } from "~@types/CachedQuery";
import { useQueryClient, InfiniteData } from "react-query";
import { motion } from "framer-motion";

interface Props extends ButtonProps {
  card: Card;
  cachedQuery: CachedQuery;
}

const LikeButtonRound = ({ card, cachedQuery, ...rest }: Props) => {
  const queryClient = useQueryClient();
  const [isLiked, setLiked] = useState(card?.has_liked > 0);

  useEffect(() => {
    setLiked(card.has_liked > 0);
  }, [card]);

  const { mutate } = useLike({
    onMutate: async () => {
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
  });

  return (
    <Box pos="relative">
      <Button
        onClick={() => {
          mutate({
            cardId: card.id,
          });
        }}
        minW="0"
        variant="unstyled"
        pos="relative"
        color={isLiked ? "#f07eaa" : "#9e9ea7"}
        {...rest}
        cursor="pointer"
        _hover={{
          border: "0 solid transparent",
          boxShadow: "0px 2px 6px #d3d3d3!important",
        }}
        _active={{
          transform: "scale(0.9)",
        }}
        transitionDuration="300ms"
        border={isLiked ? "0 solid transparent" : "1px solid #ccc"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="30px"
        h="30px"
        role="group"
        borderRadius="100%"
      >
        <Box layerStyle="cover" overflow="hidden" borderRadius="100%">
          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translateX(-50%) translateY(-50%)",
            }}
            transition={{
              duration: 0.3,
            }}
            initial={{
              opacity: 1,
            }}
            animate={{
              transform: `translateX(-50%) translateY(-50%) scale(${
                isLiked ? 4 : 1
              })`,
            }}
          >
            <Icon
              as={Heart}
              transition="color 200ms, transform 200ms"
              _groupHover={{
                transform: "scale(1.15)",
                color: "#f07eaa",
              }}
              display="flex"
              fontSize="0.9rem"
              className="heart-icon"
            />
          </motion.div>
        </Box>
        {isLiked && (
          <>
            <Box layerStyle="cover">
              <motion.div
                style={{
                  backgroundColor: "#fff",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  borderRadius: "100%",
                  width: "75%",
                  height: "75%",
                }}
                initial={{
                  transform: "translateX(-50%) translateY(-50%) scale(0)",
                }}
                animate={{
                  transform: "translateX(-50%) translateY(-50%) scale(1)",
                }}
                transition={{
                  delay: 0.1,
                  duration: 0.5,
                }}
              />
              <motion.div
                style={{
                  backgroundColor: "#f07eaa",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  borderRadius: "100%",
                  width: "75%",
                  height: "75%",
                }}
                initial={{
                  transform: "translateX(-50%) translateY(-50%) scale(0)",
                }}
                animate={{
                  transform: "translateX(-50%) translateY(-50%) scale(1.1)",
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                }}
              />
              <motion.div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translateX(-50%) translateY(-50%)",
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                }}
                initial={{
                  fontSize: 0,
                }}
                animate={{
                  fontSize: "0.8rem",
                }}
              >
                <Icon as={Heart} color="#fff" display="flex" />
              </motion.div>
            </Box>
          </>
        )}
      </Button>
      {isLiked && (
        <>
          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              borderRadius: "100%",
              backgroundColor: "#fbc9dc",
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.3, 1],
            }}
            initial={{
              opacity: 1,
              transform: "translateX(-50%) translateY(-50%) scale(0)",
            }}
            animate={{
              opacity: [1, 1, 0],
              transform: "translateX(-50%) translateY(-50%) scale(1.8)",
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              borderRadius: "100%",
              backgroundColor: "#f9adca",
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.3, 1],
            }}
            initial={{
              opacity: 1,
              transform: "translateX(-50%) translateY(-50%) scale(0)",
            }}
            animate={{
              opacity: [1, 1, 0],
              transform: "translateX(-50%) translateY(-50%) scale(1.5)",
            }}
          />
        </>
      )}
    </Box>
  );
};

export default LikeButtonRound;
