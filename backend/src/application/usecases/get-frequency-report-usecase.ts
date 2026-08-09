import { AttendanceStatus } from "@/domain";
import { NotFoundError } from "@/application/infra/errors";
import type { StudentRepository } from "../services/student-repository";
import type { EnrollmentRepository } from "../services/enrollment-repository";
import type { ClassRepository } from "../services/class-repository";
import type { AttendanceRepository } from "../services/attendance-repository";

export type GetFrequencyReportInput = {
  classId?: string;
  mask?: boolean;
};

export type FrequencyReportEntry = {
  studentId: string;
  studentName: string;
  studentEmail: string;
  codigoMatricula: string;
  classId: string;
  className: string;
  totalClasses: number;
  presenceCount: number;
  absenceCount: number;
  justifiedCount: number;
  attendanceRate: number;
};

export function maskName(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => {
      if (part.length <= 1) return part;
      return part[0] + "*".repeat(Math.min(part.length - 1, 4));
    })
    .join(" ");
}

export function maskEmail(email: string | null | undefined): string {
  if (!email) return "";
  const parts = email.split("@");
  if (parts.length !== 2) return "***";
  const [username, domain] = parts;
  if (username.length <= 2) {
    return "*".repeat(username.length) + "@" + domain;
  }
  return (
    username.substring(0, 2) +
    "*".repeat(Math.min(username.length - 2, 4)) +
    "@" +
    domain
  );
}

export class GetFrequencyReportUseCase {
  public static Name = "GetFrequencyReportUseCase" as const;

  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly classRepository: ClassRepository,
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async execute(
    input: GetFrequencyReportInput,
  ): Promise<FrequencyReportEntry[]> {
    const shouldMask = input.mask === true;
    const result: FrequencyReportEntry[] = [];

    let targetClassIds: string[] = [];
    const classNames = new Map<string, string>();

    if (input.classId) {
      const classRoom = await this.classRepository.findById(input.classId);
      if (!classRoom) {
        throw new NotFoundError("Class not found");
      }
      targetClassIds.push(input.classId);
      classNames.set(input.classId, classRoom.nomeCurso);
    } else {
      const { classes } = await this.classRepository.findAll(1, 1000);
      targetClassIds = classes.map((c) => c.id);
      classes.forEach((c) => classNames.set(c.id, c.nomeCurso));
    }

    for (const classId of targetClassIds) {
      const enrollments =
        await this.enrollmentRepository.findActiveByClass(classId);
      const className = classNames.get(classId) ?? "Unknown Class";

      for (const enrollment of enrollments) {
        const student = await this.studentRepository.findById(
          enrollment.studentId,
        );
        if (!student) continue;

        const attendances =
          await this.attendanceRepository.findStudentAttendances(
            enrollment.studentId,
            classId,
          );

        const totalClasses = attendances.length;
        const presenceCount = attendances.filter(
          (a) => a.status === AttendanceStatus.PRESENT,
        ).length;
        const absenceCount = attendances.filter(
          (a) => a.status === AttendanceStatus.ABSENT,
        ).length;
        const justifiedCount = attendances.filter(
          (a) =>
            a.status === AttendanceStatus.JUSTIFIED ||
            a.status === AttendanceStatus.FT,
        ).length;

        const attendanceRate =
          totalClasses > 0
            ? Math.round((presenceCount / totalClasses) * 100)
            : 100;

        const finalName = shouldMask ? maskName(student.name) : student.name;
        const finalEmail = shouldMask
          ? maskEmail(student.email)
          : (student.email ?? "");

        result.push({
          studentId: student.id,
          studentName: finalName,
          studentEmail: finalEmail,
          codigoMatricula: student.codigoMatricula,
          classId,
          className,
          totalClasses,
          presenceCount,
          absenceCount,
          justifiedCount,
          attendanceRate,
        });
      }
    }

    return result;
  }
}
