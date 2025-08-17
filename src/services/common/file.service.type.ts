export enum FileQualityType {
  LARGE = 'large',
  SMALL = 'small',
}
export enum FileSizeType {
  HIGH = 'high',
  LOW = 'low',
}
export interface ISubFileQualities {
  type: string;
  quality: number;
}
export interface IFileQualities {
  large: ISubFileQualities;
  small: ISubFileQualities;
}
export interface ISubFileSize {
  type: string;
  size: Array<number>;
}
export interface IFileSize {
  large: ISubFileSize;
  small: ISubFileSize;
}
export const FILE_QUALITY: IFileQualities = {
  large: { type: FileQualityType.LARGE, quality: 80 },
  small: { type: FileQualityType.SMALL, quality: 1 },
};

export const FILE_SIZE: IFileSize = {
  //
  large: { type: FileSizeType.HIGH, size: [888, 595] },
  //
  small: { type: FileSizeType.LOW, size: [84, 48] },
};

export interface IFile {
  fileName: string;
  originalname?: string;
  fileMimeType: string;
  fileBuffer: Buffer;
  fileQualities?: IFileQualities;
  fileSize: number;
}

export interface IFolder {
  mainFolderName?: string;
  folderName?: string;
  innerFolderName?: string;
  idFolder?: string | null;
  subFolderName?: string | null;
  fileMainFolder?: string;
}

export interface IFileDetails extends IFolder, IFile {
  fileUploadType: string;
  needCompress?: boolean;
}
