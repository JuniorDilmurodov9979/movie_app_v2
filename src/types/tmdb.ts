export interface TMDBListResponse<T> {
  results: T[];
}
export interface TMDBGenreResponse {
  genres: {
    id: number;
    name: string;
  }[];
}
