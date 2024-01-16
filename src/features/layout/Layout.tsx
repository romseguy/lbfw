import { Box, BoxProps, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { css } from "twin.macro";
import { PageProps } from "main";
import { Link } from "features/common";
import { capitalize } from "utils/string";

export interface LayoutProps extends PageProps, BoxProps {
  children: React.ReactNode | React.ReactNodeArray;
  pageTitle?: string;
}

export const Layout = ({
  children,
  isMobile,
  pageTitle,
  ...props
}: LayoutProps) => {
  const title = `${
    pageTitle ? capitalize(pageTitle) : "Merci de patienter..."
  } – ${process.env.NEXT_PUBLIC_SHORT_URL}`;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <title>{title}</title>
      </Head>

      <Box m="0 auto" maxWidth={1180}>
        <Box as="nav">
          <Table
            role="navigation"
            css={css`
              a {
                padding-right: 12px;
              }
            `}
          >
            <Tbody role="rowgroup">
              <Tr role="rowheader">
                <Td border={0} p={0}>
                  <Link href="/" variant="underline">
                    Accueil
                  </Link>
                  <Link href="/sent" variant="underline">
                    Sent
                  </Link>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        <Box as="main" {...props}>
          {children}
        </Box>
      </Box>
    </>
  );
};
