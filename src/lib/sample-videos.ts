export interface CityVideo {
  id: string;
  city_id: string;
  city_name: string;
  video_url: string;
  title: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export const sampleCityVideos: CityVideo[] = [
  {
    id: "v1",
    city_id: "dholera",
    city_name: "Dholera",
    video_url: "https://www.youtube.com/watch?v=Y4gyMSCS-RE",
    title: "Dholera Smart City — India's Biggest Mega Project",
    description: "Watch how Dholera SIR is transforming into India's first greenfield smart city with international airport, expressway, and massive infrastructure development.",
    is_active: true,
    sort_order: 0,
    created_at: "2024-01-01T00:00:00Z",
  },
];

export function getActiveVideoForCity(cityId: string): CityVideo | null {
  return sampleCityVideos.find((v) => v.city_id === cityId && v.is_active) || null;
}

export function getAllCityVideos(): CityVideo[] {
  return sampleCityVideos;
}
