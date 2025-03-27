/* 将 Unicode 转义序列还原为Emoji->内容过多截断->匹配内容链接转a标签；注：转换顺序不能变。 */
export const useDecodeEmoji = (content: string, limit: number = 200, isExpanded: boolean = false): string => {

  // const decodeEmoji = content.replace(/\\u([\dA-Fa-f]{4,5})/g, (match, p1) => String.fromCodePoint(parseInt(p1, 16)))

  // 添加展开状态判断
  let processedContent = content;
  if (!isExpanded && content.length > limit) {
    processedContent = content.slice(0, limit) + "...";
  }

  const withLinks = processedContent.replace(
    /(?:https?:\/\/)?((?:www\.|[\da-z-]+\.)+[\da-z-]{2,}(?:\.\w{2,})?|(?:\d{1,3}\.){3}\d{1,3}|localhost)(?::\d+)?(\/[^\s<>{}|\\^~[\]`!?:;'"`]*[^\s\/<>{}|\\^~[\]`!?:;'"`])?\/?/gi,
    (match) => {
      let fullUrl = match;
      // 自动补全协议
      if (!/^https?:\/\//i.test(match)) {
        fullUrl = match.startsWith('www.')
          ? `https://${match}`
          : `https://${match}`;
      }
      return `<a href="${fullUrl}" class="text-(--theme-color)" target="_blank" rel="noopener noreferrer">${match}</a>`
    });

  return withLinks;
};

/* 将字符串中的 Emoji 转换为 Unicode 转义序列。 */
export const useEncodeEmoji = (content: string): string => {
  return content.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{200D}\u{FE0F}]/gu,
    (match: string) => {
      return `\\u${match.codePointAt(0)?.toString(16).padStart(4, "0")}`;
    }
  );
};