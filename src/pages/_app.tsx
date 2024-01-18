import "allsettled-polyfill";
import "polyfill-object.fromentries";

import { unseal } from "@hapi/iron";
import { parse } from "cookie";
import {
  getSelectorsByUserAgent,
  isMobile as rddIsMobile
} from "react-device-detect";
import { setIsMobile } from "store/uiSlice";
import { setUserEmail } from "store/userSlice";
import { setSession } from "store/sessionSlice";
import {
  devSession,
  testSession,
  getAuthToken,
  sealOptions,
  TOKEN_NAME,
  Session
} from "utils/auth";
import { isServer } from "utils/isServer";

import { AppProps as NextAppProps } from "next/app";
import { useRouter } from "next/router";
import NextNprogress from "nextjs-progressbar";
import React from "react";
import { GlobalConfig } from "features/GlobalConfig";
import { ThemeProvider } from "features/ThemeProvider";
import { Main, PageProps } from "main";
import { wrapper } from "store";
const { getEnv } = require("utils/env");
if (getEnv === "development") {
  require("../../wdyr");
}

interface AppProps {
  cookies?: string;
  pageProps: PageProps;
}

// workaround to invalidate user subscription query
// so there's no need to pass the email in mutation payloads
export let globalEmail: string | undefined;

const App = wrapper.withRedux(
  ({ Component, cookies, pageProps }: NextAppProps<PageProps> & AppProps) => {
    const router = useRouter();

    return (
      <>
        {!router.pathname.includes("/callback") && <GlobalConfig />}
        <NextNprogress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow
        />
        <ThemeProvider cookies={cookies} isMobile={pageProps.isMobile}>
          <Main Component={Component} {...pageProps} />
        </ThemeProvider>
      </>
    );
  }
);

App.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ Component, ctx }): Promise<AppProps> => {
      const headers = ctx.req?.headers;

      //#region browser
      let userAgent = headers?.["user-agent"];
      if (!isServer) {
        if (!userAgent) userAgent = navigator.userAgent;
      }
      //#endregion

      //#region device
      const isMobile =
        typeof userAgent === "string"
          ? getSelectorsByUserAgent(userAgent).isMobile
          : rddIsMobile;
      store.dispatch(setIsMobile(isMobile));
      //#endregion

      //#region email and session handling
      let email = ctx.query.email;
      let session: Session | undefined;

      if (devSession && getEnv() === "development") {
        session = devSession;
        //@ts-ignore
        email = devSession.user.email;
      }

      if (testSession && getEnv() === "test") {
        session = testSession;
        //@ts-ignore
        email = testSession.user.email;
      }

      const cookies = headers?.cookie;
      let authToken: string | null = null;

      if (typeof cookies === "string" && cookies.includes(TOKEN_NAME)) {
        const cookie = parse(cookies);
        authToken = getAuthToken(cookie);

        if (authToken) {
          const user = await unseal(authToken, process.env.SECRET, sealOptions);

          if (user) {
            const isAdmin =
              typeof process.env.ADMIN_EMAILS === "string"
                ? process.env.ADMIN_EMAILS.split(",").includes(user.email)
                : false;

            session = {
              user: {
                ...user,
                isAdmin
              }
            };
            email = user.email;
          }
        }
      }

      if (typeof email === "string") {
        globalEmail = email;
        store.dispatch(setUserEmail(email));
      }
      if (session) {
        store.dispatch(setSession({ ...session, [TOKEN_NAME]: authToken }));
      }
      //#endregion

      //#region page
      let pageProps: AppProps["pageProps"] = { isMobile };

      if (Component.getInitialProps)
        pageProps = {
          ...pageProps,
          ...(await Component.getInitialProps(ctx))
        };
      //#endregion

      return {
        cookies,
        pageProps
      };
    }
);

export default App;
