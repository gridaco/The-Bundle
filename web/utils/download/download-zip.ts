import JSZip from "jszip";
import { download } from "./download";

export async function downloadZip({
  files,
  name,
  ensureok = false,
}: {
  files: {
    [key: string]:
      | string
      | Blob
      | Uint8Array
      | ArrayBuffer
      | Promise<string | Blob | Uint8Array | ArrayBuffer>
      | { src: string };
  };
  name?: string;
  ensureok?: boolean;
}) {
  const zip = new JSZip();

  for (const [key, value] of Object.entries(files)) {
    let fileContent;
    if (typeof value === "object" && "src" in value) {
      const response = await fetch(value.src);
      if (!response.ok) {
        if (ensureok) {
          throw new Error(`Failed to fetch image from ${value.src}`);
        }
      } else {
        fileContent = await response.blob();
      }
    } else {
      fileContent = await value;
    }

    if (fileContent) {
      zip.file(key, fileContent);
    }
  }

  zip.generateAsync({ type: "blob" }).then(function (content) {
    // see FileSaver.js
    download(content, name);
  });
}
