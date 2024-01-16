import { useColorMode } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import theme, { breakpoints } from "features/layout/theme";
import { zIndex } from "utils/string";

export const GlobalStyles = ({ isMobile }: { isMobile: boolean }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Global
      styles={css`
        @import url("/fonts/spectral.css");

        //#region elements
        html,
        body,
        #__next {
          height: 100%;
        }
        body {
          ${isMobile
            ? `overflow-x: hidden`
            : `margin: 0 auto; overflow-x: auto`}
        }
        nav {
          padding: 12px;
        }
        main {
        }
        ol:not([role="list"]),
        ul:not([role="list"]) {
          padding-left: 40px;
        }
        //#endregion

        //#region large screens
        @media (min-width: ${breakpoints["2xl"]}) {
          body {
          }
        }
        //#endregion

        //#region react-toggle
        .react-toggle {
          touch-action: pan-x;

          display: inline-block;
          position: relative;
          cursor: pointer;
          background-color: transparent;
          border: 0;
          padding: 0;

          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;

          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          -webkit-tap-highlight-color: transparent;
        }

        .react-toggle-screenreader-only {
          border: 0;
          clip: rect(0 0 0 0);
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          width: 1px;
        }

        .react-toggle--disabled {
          cursor: not-allowed;
          opacity: 0.5;
          -webkit-transition: opacity 0.25s;
          transition: opacity 0.25s;
        }

        .react-toggle-track {
          width: 50px;
          height: 24px;
          padding: 0;
          border-radius: 30px;
          background-color: #4d4d4d;
          -webkit-transition: all 0.2s ease;
          -moz-transition: all 0.2s ease;
          transition: all 0.2s ease;
        }

        .react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {
          background-color: #000000;
        }

        .react-toggle--checked .react-toggle-track {
          background-color: #19ab27;
        }

        .react-toggle--checked:hover:not(.react-toggle--disabled)
          .react-toggle-track {
          background-color: #128d15;
        }

        .react-toggle-track-check {
          position: absolute;
          width: 14px;
          height: 10px;
          top: 0px;
          bottom: 0px;
          margin: 4px 0 0 0;
          line-height: 0;
          left: 8px;
          opacity: 0;
          -webkit-transition: opacity 0.25s ease;
          -moz-transition: opacity 0.25s ease;
          transition: opacity 0.25s ease;
        }

        .react-toggle--checked .react-toggle-track-check {
          opacity: 1;
          -webkit-transition: opacity 0.25s ease;
          -moz-transition: opacity 0.25s ease;
          transition: opacity 0.25s ease;
        }

        .react-toggle-track-x {
          position: absolute;
          width: 10px;
          height: 10px;
          top: 0px;
          bottom: 0px;
          margin: 4px 0 0 0;
          line-height: 0;
          right: 10px;
          opacity: 1;
          -webkit-transition: opacity 0.25s ease;
          -moz-transition: opacity 0.25s ease;
          transition: opacity 0.25s ease;
        }

        .react-toggle--checked .react-toggle-track-x {
          opacity: 0;
        }

        .react-toggle-thumb {
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          position: absolute;
          top: 1px;
          left: 1px;
          width: 22px;
          height: 22px;
          border: 1px solid #4d4d4d;
          border-radius: 50%;
          background-color: #fafafa;

          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;

          -webkit-transition: all 0.25s ease;
          -moz-transition: all 0.25s ease;
          transition: all 0.25s ease;
        }

        .react-toggle--checked .react-toggle-thumb {
          left: 27px;
          border-color: #19ab27;
        }

        .react-toggle--focus .react-toggle-thumb {
          -webkit-box-shadow: 0px 0px 3px 2px #0099e0;
          -moz-box-shadow: 0px 0px 3px 2px #0099e0;
          box-shadow: 0px 0px 2px 3px #0099e0;
        }

        .react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
          -webkit-box-shadow: 0px 0px 5px 5px #0099e0;
          -moz-box-shadow: 0px 0px 5px 5px #0099e0;
          box-shadow: 0px 0px 5px 5px #0099e0;
        }
        //#endregion

        //#region rteditor
        .rteditor {
          /*font-family: Helvetica,Arial,sans-serif;*/
          /* font-family: -apple-system-ui-serif, ui-serif, Spectral, Georgia,
            serif; */
          font-family: ${theme.fonts.spectral};
          font-size: 19px;
          text-align: justify;
          a {
            color: ${isDark ? "lightblue" : "blue"};
            text-decoration: underline;
          }
          a:visited {
            color: ${isDark ? "lightpurple" : "purple"};
          }
          a.clip {
            text-overflow: ellipsis;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            max-width: 150px;
            vertical-align: top;
          }
          blockquote {
            border-left: 2px solid #ccc;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
            margin-left: 1.5rem;
            padding-left: 1rem;
          }
          h1 {
            font-size: 2em;
          }
          h2 {
            font-size: 1.5em;
          }
          h3 {
            font-size: 1.25em;
          }
          hr {
            border-top-width: 3px;
            margin: 0 24px;
          }
          p {
            margin: 0;
            padding: 0;
          }
          ol,
          ul {
            margin-bottom: 1rem;
          }
        }
        //#endregion

        //#region tinymce
        ${isMobile
          ? `
            body:not(.tox-force-desktop) .tox-dialog { max-height: calc(100vh - 64px * 1.25) !important; }
            .tox-tinymce { border: 0 !important; }
          `
          : ""}

        /*
          button[aria-label="Tailles de police"] {
            width: 80px !important;
          }
        */

        .tox-tinymce-aux {
          z-index: ${zIndex()} !important;
        }
        //#endregion

        //#region toast
        /* .chakra-ui-light {
          .chakra-toast {
            .chakra-alert {
              background: rgba(255, 255, 255, 0.66);
            }
          }
        }

        .chakra-ui-dark {
          .chakra-toast {
            .chakra-alert {
              background: rgba(0, 0, 0, 0.66);
            }
          }
        } */
        //#endregion
      `}
    />
  );
};
