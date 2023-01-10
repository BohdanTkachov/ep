export type LayoutProps = {
  children: React.ReactNode;
};

export type Page = 'calendar' | 'students' | 'materials' | 'settings';

export type CalendarDate = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

export type ScheduleResponse = {
  id: number;
  startDateTime: Date;
  endDateTime: Date;
  repeatWeekly: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  student: Student;
  group: Group;
};
export type Group = {
  id: number;
  teacherId: number;
  title: string;
  quickTranslation: boolean;
  lessonDuration: number;
  createdAt: Date;
  updatedAt: Date;
  students: Student[];
  avatar: Avatar;
};

export type Avatar = {
  id: number;
  imageType: string;
  fileName: string;
  createdAt: Date;
  updatedAt: Date;
  fileUrl: string;
};

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateBirth: Date;
  isDeleted: boolean;
  isActivated: boolean;
  activatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  avatar: Avatar;
};

export type CalendarProps = {
  dateString: string;
  className?: string;
  schedules: ScheduleResponse[];
  twelveHoursFormat: boolean;
  viewType: 'day' | 'week' | 'month' | 'double';
};

export type CalendarHeaderProps = {
  currentDate: Date;
  showArrows?: boolean;
  title?: string;
  viewType: 'day' | 'week' | 'month' | 'double';
};
