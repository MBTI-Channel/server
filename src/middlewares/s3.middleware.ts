import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import config from "../config/index";
import { Request } from "express";
import { User } from "../modules/user/entity/user.entity";
import { v4 } from "uuid";

const { s3AccessKey, s3SecretKey } = config.aws;

const createFileName = (req: Request, fileType: string) => {
  if (!req.files) {
    // 파일 존재 x 다음으로 그냥 넘기기
    return undefined;
  }
  const user = req.user as User;
  const userId = user.id;
  const fileFormat = fileType.split("/")[1];

  return `${userId}-${v4()}.${fileFormat}`;
};

export const upload = multer({
  storage: multerS3({
    s3: new S3Client({
      credentials: {
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretKey,
      },
      region: "ap-northeast-2", // 수정
    }),
    bucket: "mbti-channel", // 수정
    // acl: "public-read-write",
    key(req: Request, file: Express.Multer.File, callback) {
      const fileType = file.mimetype;
      const fileName = createFileName(req, fileType);
      if (fileName) callback(null, `files/${fileName}`);
    },
  }),
  dest: "files/",
});
