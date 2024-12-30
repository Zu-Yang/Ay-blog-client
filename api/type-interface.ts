export type bucket = {
  [key: string]: any; // 添加索引签名
  bucketName: string;
  prefix?: string;
};

export type pagination = {
  page: number;
  limit: number;
};

export type readCount = {
  article_id: number;
  ip: string;
};

export type addArticle = {
  // user_id: number
  user_name: string;
  user_email: string;
  user_nickname?: string;
  user_avatar?: string;
  user_age?: number;
  user_birthday?: Date;
  user_register_time?: Date;
};
