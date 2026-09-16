import { UserState } from '../types';

export const initialUserState: UserState = {
  name: 'إيسكو',
  salary: 6000,
  currentBalance: 730,
  daysToSalary: 12,
  todaySpendingTarget: 29,
  lifestyleNotes: 'عندي دوام بكرة، ساكن لحالي، سيارتي تحتاج زيت، أبي أشتري سماعة بـ400، وعندي فاتورة بعد أسبوع.',
  commitments: [
    {
      id: 'com-1',
      title: 'فاتورة الكهرباء والاتصالات',
      amount: 220,
      dueInDays: 4,
      category: 'bill',
      isEssential: true,
    },
    {
      id: 'com-2',
      title: 'تغيير زيت وفلتر السيارة',
      amount: 160,
      dueInDays: 6,
      category: 'car',
      isEssential: true,
    },
  ],
  wishlist: [
    {
      id: 'wish-1',
      title: 'سماعة رأس عازلة للصوت',
      price: 400,
      priority: 'medium',
    },
  ],
  todayExpenses: [],
};
