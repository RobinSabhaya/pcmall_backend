export interface IGenerateUrlResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

export interface IGenerateUrl {
  message: string;
  url: string;
}
