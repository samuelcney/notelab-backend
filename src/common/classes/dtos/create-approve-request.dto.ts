export class CreateApproveRequestDTO {
  userId: string;
  certificate: string;

  constructor(userId: string, certificate: string) {
    this.userId = userId;
    this.certificate = certificate;
  }
}
