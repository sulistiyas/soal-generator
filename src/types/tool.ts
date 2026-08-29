export type ToolCategory = 'all' | 'evaluasi' | 'administrasi' | 'kreatif';

export type ToolStatus = 'active' | 'coming_soon' | 'beta';

export interface TeacherTool {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'evaluasi' | 'administrasi' | 'kreatif';
  categoryLabel: string;
  iconName: string;
  status: ToolStatus;
  tags: string[];
  path: string;
  badge?: string;
  features?: string[];
  targetAudience?: string;
}

export interface CategoryFilterItem {
  id: ToolCategory;
  label: string;
  description?: string;
  iconName?: string;
}
