export interface User {
  email: string;
  password: string;
  role: 'admin' | 'employee';
}

export let users: User[] = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { email: 'employee@example.com', password: 'employee123', role: 'employee' },
];

export function findUser(email: string, password: string): User | undefined {
  return users.find(user => user.email === email && user.password === password);
}

export function addUser(user: User) {
  users.push(user);
}

