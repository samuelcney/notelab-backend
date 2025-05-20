export class EnrollmentDTO {
  courseId: string;
  userId: string;

  constructor(courseId: string, userId: string) {
    this.courseId = courseId;
    this.userId = userId;
  }
}
