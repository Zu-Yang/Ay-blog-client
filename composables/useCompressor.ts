import Compressor from "compressorjs";

export const useCompressor = (file: Blob | File) => {
  const $message = useDiscreteApi().message;
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      success(file) {
        resolve(file);
      },
      error(err) {
        reject(err);
        console.error(err.message);
        $message.error(err.message);
      },
    });
  });
};
