import { Spinner, useColorMode, useToast } from "@chakra-ui/react";
import { Editor, IAllProps } from "@tinymce/tinymce-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useAppDispatch } from "store";
import { incrementRTEditorIndex, selectRTEditorIndex } from "store/uiSlice";

const bindEvent = (
  target: Document | Element,
  eventName: string,
  fun: () => void
) => {
  if (target.addEventListener) {
    target.removeEventListener(eventName, fun, false);
    target.addEventListener(eventName, fun, false);
  }
};

export const RTEditor = ({
  defaultValue,
  event,
  org,
  placeholder,
  readOnly,
  value,
  onBlur,
  onChange,
  ...props
}: IAllProps["init"] & {
  defaultValue?: string;
  setIsLoading?: (bool: boolean) => void;
  value?: string;
  onBlur?: (html: string) => void;
  onChange?: ({ html }: { html: string }) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const toast = useToast({ position: "top" });

  const currentIndex = useSelector(selectRTEditorIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [shortId, setShortId] = useState<string | undefined>();
  const [maxHeight, setMaxHeight] = useState(0);
  useEffect(() => setMaxHeight(window.innerHeight - 80), []);

  //#region tinymce
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const closeToolbar = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.on("keydown", (e) => {
        if (e.keyCode === 27) {
          //escape
        }
      });

      if (editor.queryCommandState("ToggleToolbarDrawer")) {
        try {
          editor.execCommand("ToggleToolbarDrawer");
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, [editorRef]);
  const init: IAllProps["init"] = {
    branding: false,
    browser_spellcheck: true,
    content_css: isDark ? "dark" : undefined,
    skin: isDark ? "oxide-dark" : undefined,
    font_css: "/fonts/spectral.css",
    content_style: `
      body {
        font-family: 'Spectral', Georgia, ui-serif, serif;
        font-size: 19px;
        text-align: justify;
      }
      hr {
        border-top-width: 3px;
        margin: 0 24px;
      }
      p {
        margin: 0;
        padding: 0;
      }
    `,
    convert_urls: false,
    document_base_url: process.env.NEXT_PUBLIC_URL + "/",
    //font_family_formats: "Spectral",
    font_family_formats:
      "Spectral;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;",
    height: props.height,
    language: "fr_FR",
    language_url: "/tinymce/langs/fr_FR.js",
    min_height: props.minHeight,
    max_height: props.maxHeight || maxHeight,
    text_patterns: [
      { start: "*", end: "*", format: "italic" },
      { start: "**", end: "**", format: "bold" },
      { start: "#", format: "h1" },
      { start: "##", format: "h2" },
      { start: "###", format: "h3" },
      { start: "####", format: "h4" },
      { start: "#####", format: "h5" },
      { start: "######", format: "h6" },
      // The following text patterns require the `lists` plugin
      { start: "1. ", cmd: "InsertOrderedList" },
      { start: "* ", cmd: "InsertUnorderedList" },
      { start: "- ", cmd: "InsertUnorderedList" }
    ],
    //image_upload_handler: uploadImage,
    // image plugin
    //file_picker_types: "image", // file image media
    //file_picker_callback: onImageClick,
    plugins: [
      "anchor",
      "autolink",
      "autoresize",
      "charmap",
      "code",
      "emoticons",
      "fullscreen",
      "help",
      //"hr",
      "image",
      "link",
      "lists",
      "media",
      //"paste",
      "searchreplace"
    ],
    contextmenu: false,
    menubar: false,
    statusbar: false,
    toolbar: [
      {
        name: "outils",
        items: [
          "fullscreen",
          "undo",
          "redo",
          "emoticons",
          "link",
          "anchor",
          "hr",
          "removeformat",
          "searchreplace"
        ]
      },
      {
        name: "texte",
        items: [
          "fontfamily",
          "fontsizeinput",
          "forecolor",
          "alignjustify",
          "aligncenter",
          "bold",
          "italic",
          "charmap"
        ]
      },
      {
        name: "media",
        items: ["link", "unlink", "image", "media", "code", "help"]
      }
    ]
  };
  //#endregion

  useEffect(() => {
    dispatch(incrementRTEditorIndex());
    setShortId(`rteditor-${currentIndex + 1}`);
    //   if (editorRef.current) {
    //     console.log(editorRef.current.getContent());
    //   }
  }, []);

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "relative"
          }}
        >
          <Spinner />
        </div>
      )}

      {shortId && (
        <Editor
          disabled={readOnly}
          id={shortId}
          init={init}
          initialValue={isTouched ? undefined : defaultValue}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          value={value}
          onBlur={(e, editor) => {
            closeToolbar();
            onBlur && onBlur(editor.getContent());
          }}
          onEditorChange={(html, editor) => {
            onChange && onChange({ html });

            if (html !== defaultValue) {
              setIsTouched(true);
            }
          }}
          onInit={(evt, editor) => {
            setIsLoading(false);
            props.setIsLoading && props.setIsLoading(false);
            editorRef.current = editor;
            const target = editor.contentDocument.documentElement;

            if (target) {
              bindEvent(target, "click", () => {
                closeToolbar();
              });
            }
          }}
        />
      )}
    </>
  );
};
