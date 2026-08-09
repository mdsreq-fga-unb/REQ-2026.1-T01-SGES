import { Router } from "express";
import { authMiddleware } from "@/api/middleware/auth-middleware";
import { UserRole, EnrollmentStatus } from "@/domain";
import { container } from "@/infra/container/container";

const router = Router();

// GET /history/classes — Histórico de turmas com contagem de matrículas
router.get(
  "/classes",
  authMiddleware([UserRole.ADMIN, UserRole.TEACHER]),
  async (req, res, next) => {
    try {
      const classRepo = container.ClassRepository;
      const enrollmentRepo = container.EnrollmentRepository;

      const { classes } = await classRepo.findAll(1, 1000);

      const historyClasses = await Promise.all(
        classes.map(async (c) => {
          const [activeCount, evadedCount, completedCount] = await Promise.all([
            enrollmentRepo.countActiveEnrollmentsByClass(c.id),
            enrollmentRepo.countByClassAndStatus?.(
              c.id,
              EnrollmentStatus.EVADED,
            ) ?? 0,
            enrollmentRepo.countByClassAndStatus?.(
              c.id,
              EnrollmentStatus.COMPLETED,
            ) ?? 0,
          ]);

          const teacherName =
            c.instructors && c.instructors.length > 0
              ? c.instructors.map((i) => i.name).join(", ")
              : "Sem instrutor";

          return {
            id: c.id,
            name: c.nomeCurso,
            semester: c.semestre ?? "",
            teacherName,
            enrolledCount: activeCount + evadedCount + completedCount,
            evadedCount,
            completedCount,
          };
        }),
      );

      return res.status(200).json(historyClasses);
    } catch (err) {
      next(err);
    }
  },
);

// GET /history/instructors — Histórico de instrutores
router.get(
  "/instructors",
  authMiddleware([UserRole.ADMIN, UserRole.TEACHER]),
  async (req, res, next) => {
    try {
      const instructorHistoryRepo = container.InstructorHistoryRepository;

      if (!instructorHistoryRepo) {
        return res.status(200).json([]);
      }

      const historyList = await instructorHistoryRepo.findBySemesterOrYear(
        undefined,
        undefined,
      );

      const instructors = historyList.map((h: any) => ({
        id: h.id,
        teacherName: h.instructorName ?? "Desconhecido",
        className: h.courseName ?? "Turma desconhecida",
        semester: h.semestre ?? "",
        hoursCount: 1, // Cada registro representa 1 turma lecionada
      }));

      return res.status(200).json(instructors);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
