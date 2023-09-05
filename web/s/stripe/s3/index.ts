import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "us-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateSignedDownloadLink(
  bucket: string,
  key: string
): Promise<string> {
  // Initialize the S3 client

  // Create a command object using the parameters
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    // Generate the signed URL
    const signedUrl: string = await getSignedUrl(s3, command, {
      expiresIn: 900, // Signed URL will expire in 900 seconds (15 minutes)
    });

    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL: ", error);
    throw new Error("Failed to generate signed URL");
  }
}
