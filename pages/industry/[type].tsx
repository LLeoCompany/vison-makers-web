import React from "react";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  getIndustryConfig,
  getAllIndustryTypes,
  type IndustryConfig,
  type IndustryType,
} from "@/config/industryConfig";
import IndustryLanding from "@/components/industry/IndustryLanding";

interface IndustryPageProps {
  config: IndustryConfig;
}

const IndustryPage = ({ config }: IndustryPageProps) => {
  return (
    <>
      <Head>
        <title>{`${config.nameKo} AI 솔루션 | Vision AI - Enterprise RAG Infrastructure`}</title>
        <meta
          name="description"
          content={`${config.description} Vision AI의 ${config.nameKo} 업종 특화 Enterprise RAG 솔루션을 만나보세요.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`${config.nameKo} AI 솔루션 | Vision AI`}
        />
        <meta property="og:description" content={config.description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://visionai.kr/industry/${config.type}`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${config.nameKo} AI 솔루션 | Vision AI`}
        />
        <meta name="twitter:description" content={config.description} />

        {/* Theme Color based on industry */}
        <meta name="theme-color" content={config.theme.primary} />
      </Head>

      <IndustryLanding config={config} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const types = getAllIndustryTypes();

  const paths = types.map((type) => ({
    params: { type },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<IndustryPageProps> = async ({
  params,
}) => {
  const type = params?.type as string;
  const config = getIndustryConfig(type);

  if (!config) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      config,
    },
  };
};

export default IndustryPage;
