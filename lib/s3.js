import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const putObject = async (key, body, contentType) => {
  const s3 = new S3Client({
    region: process.env.AWS_REGION_MYAPP,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_MYAPP,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_MYAPP,
    },
  });

  // workaround for the issue: https://github.com/aws/aws-sdk-js-v3/issues/1800
  s3.middlewareStack.add(
    (next, context) => (args) => {
      delete args.request.headers["content-type"];
      return next(args);
    },
    {
      step: "build",
    }
  );

  const objectParams = {
    ACL: "public-read",
    Bucket: process.env.AWS_BUCKET_MYAPP,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  const results = await s3.send(new PutObjectCommand(objectParams));
  return results;
};
