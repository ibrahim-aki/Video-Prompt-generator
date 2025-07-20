export interface UserCredential {
    username: string;
    password: string;
    unlimited?: boolean;
    limit?: number;
}

export const credentials: UserCredential[] = [
    { username: 'dita', password: 'dodol', limit: 5 },
    { username: 'ibrahim', password: 'ganteng', unlimited: true },
    { username: 'enablr', password: 'enablr', limit: 5 },
    { username: 'blackaxe', password: 'blackaxe', limit: 3 },
    { username: 'testuser', password: 'test', limit: 3 },
    { username: 'demo', password: 'demo', limit: 3 },
    { username: 'guest', password: 'guest', limit: 3 },
    { username: 'operator', password: 'op123', limit: 3 },
    { username: 'manager', password: 'manpass', limit: 15 },
];