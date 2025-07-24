export enum FileQualityType {
  LARGE = 'large',
  SMALL = 'small',
}
export enum FileSizeType {
  HIGH = 'high',
  LOW = 'low',
}
export interface SubFileQualities {
  type: string;
  quality: number;
}
export interface FileQualities {
  large: SubFileQualities;
  small: SubFileQualities;
}
export interface SubFileSize {
  type: string;
  size: Array<number>;
}
export interface FileSize {
  large: SubFileSize;
  small: SubFileSize;
}
export const FILE_QUALITY: FileQualities = {
  large: { type: FileQualityType.LARGE, quality: 80 },
  small: { type: FileQualityType.SMALL, quality: 1 },
};

export const FILE_SIZE: FileSize = {
  large: { type: FileSizeType.HIGH, size: [888, 595] },
  small: { type: FileSizeType.LOW, size: [84, 48] },
};

export interface File {
  fileName: string;
  originalname: string;
  fileMimeType: string;
  fileBuffer: Buffer;
  fileQualities?: FileQualities;
  fileSize: number;
}

export interface Folder {
  mainFolderName?: string;
  folderName?: string;
  innerFolderName?: string;
  idFolder?: string | null;
  subFolderName?: string | null;
  fileMainFolder?: string;
}

export interface FileDetails extends Folder, File {
  fileUploadType: string;
  needCompress?: boolean;
}
