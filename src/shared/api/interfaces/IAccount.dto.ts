export interface IAccountDto {
  id: string;
  ageRange?: string;
  gender?: string;
  getGender(): number | undefined;
  getAgeRange(): string | undefined;
}
