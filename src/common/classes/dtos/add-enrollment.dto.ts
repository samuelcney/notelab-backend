export class EnrollmentDTO {
  courseId: string | string[];
  userId: string;

  constructor(courseId: string | string[], userId: string) {
    this.courseId = courseId;
    this.userId = userId;
  }
}
