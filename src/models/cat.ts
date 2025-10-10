import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { User } from "./User";

export interface CatBasic {
  $id: string;
  name: string;
  species: string;
  life_stage?: string;
  gender?: string;
  size?: string;
  description?: string;
  tags?: string[];
  fieleId?: string;
  imageUrl?: string;
  birthdate?: string;
  age_years?: number;
  weight_kg?: string;
  declawed?: boolean;
  last_vet_visit?: string;
  coat_length?: string;
  color_primary?: string;
  color_secondary?: string;
  status?: string;
}

export interface CatRelations {
  userId: User;
  catId: CatBasic;
}

export interface CatBreedAppearance {
  coat_length?: string;
  color_primary?: string;
  color_secondary?: string;
}

export interface CatAgeMeasurements {
  birthdate?: string;
  age_years?: number;
  weight_kg?: string;
}

export interface CatHealth {
  declawed?: boolean;
  last_vet_visit?: string;
}

export interface CatBehaviorEnvironment {
  catId: CatBasic;
  house_trained?: boolean;
  environment_children?: string;
  environment_dogs?: string;
  environment_cats?: string;
  activity_level?: string;
  friendliness?: string;
  vocalisation_level?: string;
  behaviour_notes?: string;
}

export interface CatStatusAdoption {
  status?: string;
}

export interface CatLocation {
  catId: CatBasic;
  country?: string;
  city?: string;
  postalcode?: string;
  lat: Float;
  lon: Float;
}

export interface CatMedia {
  catId: CatBasic;
  fileId: string;
}