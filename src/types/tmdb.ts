export type TMDBListResponse<T> = {
  page?: number;
  results?: T[];
  total_pages?: number;
  total_results?: number;
};
export interface TMDBGenreResponse {
  genres: {
    id: number;
    name: string;
  }[];
}
