import JSZip from "jszip";
import { download } from "./download";

export async function downloadZip({
  files,
  name,
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
}) {
  const zip = new JSZip();

  for (const [key, value] of Object.entries(files)) {
    let fileContent;
    if (typeof value === "object" && "src" in value) {
      const response = await fetch(value.src);
      if (!response.ok)
        throw new Error(`Failed to fetch image from ${value.src}`);
      fileContent = await response.blob();
    } else {
      fileContent = await value;
    }
    zip.file(key, fileContent);
  }

  zip.generateAsync({ type: "blob" }).then(function (content) {
    // see FileSaver.js
    download(content, name);
  });
}
