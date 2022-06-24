import {
  S3,
  ListBucketsCommand,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const bucket = process.env.SPACES_BUCKET || "";
export const s3Client = new S3({
  endpoint: process.env.SPACES_ENDPOINT || "",
  region: process.env.SPACES_REGION || "",
  credentials: {
    accessKeyId: process.env.SPACES_KEY || "",
    secretAccessKey: process.env.SPACES_SECRET || "",
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
    return await s3Client.send(
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
    return await s3Client.send(new ListObjectsCommand({ Bucket: bucket }));
  } catch (err) {
    console.log("Error", err);
  }
};

export const listFilePrefix = async (prefix: string) => {
  try {
    return await s3Client.send(
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
    return await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: file_name,
      })
    );
  } catch (err) {
    console.log("Error", err);
  }
};
