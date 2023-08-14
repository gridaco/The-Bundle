export async function download(blob: Blob, name?: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name ?? "file";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
