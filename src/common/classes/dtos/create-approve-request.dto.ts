export class CreateApproveRequestDTO {
  userId: string;
  fullName: string;
  email: string;
  musicalEducation: string;
  yearsExperience: string;
  instruments: string;
  biography: string;
  documents: File | string;
  cpf?: string;
  phone?: string;

  constructor(
    userId: string,
    fullName: string,
    email: string,
    musicalEducation: string,
    yearsExperience: string,
    instruments: string,
    biography: string,
    documents: string | File,
    phone?: string,
    cpf?: string,
  ) {
    this.userId = userId;
    this.fullName = fullName;
    this.email = email;
    this.cpf = cpf;
    this.musicalEducation = musicalEducation;
    this.yearsExperience = yearsExperience;
    this.instruments = instruments;
    this.biography = biography;
    this.documents = documents;
    this.phone = phone;
  }
}
