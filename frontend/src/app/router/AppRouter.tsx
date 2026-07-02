import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { LoginPage } from '@/pages/LoginPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { StudentsPage } from '@/pages/StudentsPage';
import { AttendancePage } from '@/pages/AttendancePage';
// import { FormsPage } from '@/pages/FormsPage'; // INATIVADO TEMPORARIAMENTE
import { HistoryPage } from '@/pages/HistoryPage';
import { ClassesPage } from '@/pages/ClassesPage';
import { InstructorsPage } from '@/pages/InstructorsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { DashboardLayout } from '@/widgets/DashboardLayout';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            {/* <Route path="/forms" element={<FormsPage />} /> */} {/* INATIVADO TEMPORARIAMENTE */}
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
