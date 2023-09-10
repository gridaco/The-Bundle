import { NextRequest } from "next/server";

const getHost = (request: NextRequest) => {
  const host =
    process.env.NODE_ENV === "production"
      ? "https://grida.co/bundle"
      : request.nextUrl.origin + "/bundle";
  return host;
};

export default getHost;
