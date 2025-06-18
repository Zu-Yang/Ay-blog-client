import { fetch } from "~/utils/http";
import type { bucket } from "../../type-interface";

export default {
  getAudio: (query: bucket) => {
    return fetch("/api/minio/getAudio", {
      method: "GET",
      query: query,
    });
  },
  getRandomBanner: (query: bucket) => {
    return fetch("/api/minio/getRandomBanner", {
      method: "GET",
      query: query,
    });
  },

  uploadBanner: async (files: File, body: bucket) => {
    const file = (await useCompressor(files)) as File; // 压缩
    const formData = new FormData();
    formData.append("files", file, file.name); // files与接口的参数名称对应
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key]); // 将 body 的内容添加到 formData 中
    });

    return fetch("/api/minio/uploadBannerMultiple", {
      method: "POST",
      body: formData,
    });
  },

  uploadImage: async (files: File) => {
    const file = (await useCompressor(files)) as File; // 压缩
    const formData = new FormData();
    formData.append("files", file, file.name); // files与接口的参数名称对应
    return fetch("/api/minio/uploadImageMultiple", {
      method: "POST",
      body: formData,
    });
  },

  deleteImage: (parmas: string[]) => {
    return fetch("/api/minio/delImage", {
      method: "DELETE",
      body: parmas,
    });
  },

  // uploadVideo: (file: File) => {
  //   let formData = new FormData();
  //   formData.append("file", file, file.name); // file与接口的参数名称对应
  //   return fetch("/api/minio/uploadVideo", {
  //     method: "POST",
  //     body: formData,
  //     headers: {
  //       // 避免 SharedArrayBuffer is not defined 错误
  //       "Cross-Origin-Opener-Policy": "same-origin",
  //       "Cross-Origin-Embedder-Policy": "require-corp",
  //     },
  //   });
  // },
};