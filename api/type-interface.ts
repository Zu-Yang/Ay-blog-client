export type bucket = {
  [key: string]: any; // 添加索引签名
  bucketName: string;
  prefix?: string;
};

export type pagination = {
  page: number;
  orderBy: string;
  limit: number;
};

export type commentList = {
  biz_id: number;
  biz_type: string;
  page: number;
  limit: number;
};

export type comment = {
  nick_name: string,
  user_email: string,
  user_avatar: string,
  user_ip: number,
  jump_url: string,
  biz_type: string,
  biz_id: number,
  comment_id: number,
  reply_ip?: string,
  parent_id: number,
  content: string,
  deleted: number,
  approved: number
}

export type likeStatus = {
  article_id: number;
  status: boolean;
  user_email: string;
  country?: string;
  short_name?: string;
  province?: string;
  city?: string;
  area?: string;
  isp?: string;
  net?: string;
};

export type setCount = {
  article_id: number;
  user_email: string;
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
