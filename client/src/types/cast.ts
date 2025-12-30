export interface CastMember {
  adult: boolean;
  gender: number; // 0, 1, 2 (TMDB convention)
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}