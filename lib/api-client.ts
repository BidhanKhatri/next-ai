import { IVideo } from "@/model/Video"

export type VideoFormData = Omit<IVideo, "_id">

type fetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: fetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api/${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos(): Promise<IVideo[]> {
    return this.fetch<IVideo[]>("/video");
  }

  async createVideo(videoData: VideoFormData): Promise<IVideo> {
    return this.fetch<IVideo>("/video", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
