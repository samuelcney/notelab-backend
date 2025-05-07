export class EnrollmentDTO {
  courseId: number;
  userId: string;

  constructor(courseId: number, userId: string) {
    this.courseId = courseId;
    this.userId = userId;
  }
}
