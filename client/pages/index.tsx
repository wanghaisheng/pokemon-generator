import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { HStack, Container, Flex } from "@chakra-ui/react";
import { SSRConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import BackgroundBlur from "~components/BackgroundBlur";
import Card from "~components/Card";
import CardForm from "~components/CardForm";
import { CARD_DEFAULT_STATE } from "~data/card";
import { decrypt, cacheCard } from "~utils/cache";
import { useForm, FormProvider } from "react-hook-form";
import PanelOptions from "~components/PanelOptions";
import Nav from "~components/Nav";

const Home: NextPage = () => {
  const cachedCard =
    typeof window !== "undefined"
      ? localStorage.getItem(process.env.NEXT_PUBLIC_KEY_CACHE)
      : null;

  const form = useForm({
    defaultValues: cachedCard
      ? decrypt(cachedCard, process.env.NEXT_PUBLIC_ENCRYPT_KEY)
      : CARD_DEFAULT_STATE,
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const onChange = () => {
    cacheCard(form.getValues());
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={onChange}
        style={{ height: "100%" }}
      >
        <BackgroundBlur />
        <Container h="100%" py={6}>
          <HStack
            justifyContent="center"
            h="100%"
            alignItems="flex-start"
            spacing={5}
          >
            <PanelOptions />
            <CardForm />
            <Flex
              flex={2}
              alignItems="center"
              justifyContent="center"
              height="100%"
              borderRadius="md"
            >
              <Nav />
              <Card />
            </Flex>
          </HStack>
        </Container>
      </form>
    </FormProvider>
  );
};

export const getServerSideProps: GetServerSideProps<SSRConfig> = async ({
  locale,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "generator"])),
    },
  };
};

export default Home;