import { ENVIROMENT } from "@/config";
import {
  S3,
  ListBucketsCommand,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
const bucket = ENVIROMENT.SPACES_BUCKET || "";
export const s3Client = new S3({
  endpoint: ENVIROMENT.SPACES_ENDPOINT || "",
  region: ENVIROMENT.SPACES_REGION || "",
  credentials: {
    accessKeyId: ENVIROMENT.SPACES_KEY || "",
    secretAccessKey: ENVIROMENT.SPACES_SECRET || "",
  },
});

export const listSpaces = async () => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log("Success", data.Buckets);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

export const upload = async (
  file: Buffer,
  file_name: string,
  file_type: string
) => {
  try {
    return s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: file_name,
        ACL: "public-read",
        Body: file,
        ContentType: file_type,
      })
    );
  } catch (err) {
    return false;
  }
};

export const listFile = async () => {
  try {
    return s3Client.send(new ListObjectsCommand({ Bucket: bucket }));
  } catch (err) {
    console.log("Error", err);
  }
};

export const listFilePrefix = async (prefix: string) => {
  try {
    return s3Client.send(
      new ListObjectsCommand({ Bucket: bucket, Prefix: prefix })
    );
  } catch (err) {
    console.log("Error", err);
  }
};

export const isExists = async (prefix: string) => {
  try {
    const files = await s3Client.send(
      new ListObjectsCommand({ Bucket: bucket, Prefix: prefix })
    );
    if (files && files.Contents && files.Contents[0]) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

export const deleteFile = async (file_name: string) => {
  try {
    return s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: file_name,
      })
    );
  } catch (err) {
    console.log("Error", err);
  }
};

export const getBufferFile = async (file_name: string) => {
  const streamToString = (stream: any): Promise<Buffer> =>
    new Promise((resolve, reject) => {
      const chunks: any = [];
      stream.on("data", (chunk: any) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: file_name,
  });

  const { Body } = await s3Client.send(command);
  return streamToString(Body);
};
