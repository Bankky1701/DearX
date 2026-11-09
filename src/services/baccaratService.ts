import { Formula, FormulaList, RedeemCode, RoomData, Statistic, User } from '../types/baccarat';

const USERS_KEY = 'bacc_users';
const FORMULAS_KEY = 'bacc_formulas';
const FORMULA_LIST_KEY = 'bacc_formula_list';
const CODES_KEY = 'bacc_codes';
const STATS_KEY = 'bacc_stats';
const ROOMS_KEY = 'bacc_rooms';
const CURRENT_USER_KEY = 'bacc_current_user';

const INITIAL_USERS: User[] = [
  {
    id: 1,
    user: 'admin',
    pass: '1234',
    email: 'admin@baccarathack.com',
    credit: 999.0,
    rank: 'admin',
    online: Date.now(),
    lobby: 0,
  },
  {
    id: 2,
    user: 'member',
    pass: '1234',
    email: 'member@baccarathack.com',
    credit: 50.0,
    rank: 'member',
    online: Date.now(),
    lobby: 0,
  },
];

const INITIAL_FORMULAS: Formula[] = [
  { id: 2, fm: 'BBBPB', an: 'P', idea: 1 },
  { id: 3, fm: 'BBPBP', an: 'B', idea: 1 },
  { id: 4, fm: 'BPBBB', an: 'B', idea: 1 },
  { id: 5, fm: 'BPBBP', an: 'P', idea: 1 },
  { id: 6, fm: 'BPBPB', an: 'P', idea: 1 },
  { id: 7, fm: 'BPPBP', an: 'B', idea: 1 },
  { id: 8, fm: 'BPPBB', an: 'B', idea: 1 },
  { id: 9, fm: 'BPPPB', an: 'P', idea: 1 },
  { id: 10, fm: 'BPPPP', an: 'P', idea: 1 },
  { id: 11, fm: 'PBBBB', an: 'B', idea: 1 },
  { id: 12, fm: 'PBBPB', an: 'P', idea: 1 },
  { id: 13, fm: 'BPBBB', an: 'B', idea: 1 },
  { id: 14, fm: 'PBPBP', an: 'B', idea: 1 },
  { id: 15, fm: 'PBPPB', an: 'P', idea: 1 },
  { id: 16, fm: 'PPPBP', an: 'B', idea: 1 },
  { id: 26, fm: 'PPPBB', an: 'B', idea: 1 },
  // Idea 2 patterns
  { id: 27, fm: 'BBBBB', an: 'P', idea: 2 },
  { id: 28, fm: 'PPPPP', an: 'B', idea: 2 },
  { id: 29, fm: 'BPBPB', an: 'B', idea: 2 },
  { id: 30, fm: 'PBPBP', an: 'P', idea: 2 },
  { id: 31, fm: 'BBPBB', an: 'P', idea: 2 },
];

const INITIAL_FORMULA_LIST: FormulaList[] = [
  { id: 1, time: 0 },
  { id: 2, time: 1581479390 },
];

const INITIAL_CODES: RedeemCode[] = [
  { id: 1, code: 'VIP999', credit: 100, create_by: 'admin', create_date: Date.now(), code_use: 0, use_by: '' },
  { id: 2, code: 'BACC888', credit: 50, create_by: 'admin', create_date: Date.now(), code_use: 0, use_by: '' },
  { id: 3, code: 'FREE50', credit: 50, create_by: 'admin', create_date: Date.now(), code_use: 0, use_by: '' },
  { id: 4, code: 'LUCKY777', credit: 200, create_by: 'admin', create_date: Date.now(), code_use: 0, use_by: '' },
];

const PRESET_ROOM_HISTORIES: string[][] = [
  ['b', 'b', 'p', 'b', 'b', 'b', 'p', 'b', 'p', 'p', 'b', 'b', 'p', 'b', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'b', 'p'],
  ['p', 'p', 'b', 'p', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'p', 'b', 'p', 'b', 'b', 'p', 'p', 'b'],
  ['b', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'b', 'p', 't', 'b', 'p', 'b', 'b', 'p', 'p', 'p', 'b', 'p', 'b', 'p', 'b', 'p', 'b', 'b'],
  ['b', 'b', 'b', 'b', 'p', 'p', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'b', 'p', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'b'],
  ['p', 'b', 'p', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'p', 'b', 'p', 'b', 'b', 'p', 'b'],
  ['b', 'b', 'p', 'b', 'p', 'p', 'b', 'b', 'p', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'p'],
  ['p', 'p', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'p', 'p', 'b', 'b', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'b'],
  ['b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'p', 'b', 'b', 'p', 'b', 't', 'p', 'b', 'b', 'p', 'b', 'b', 'p', 'p', 'b', 'p', 'b'],
  ['b', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'p', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p'],
  ['p', 'b', 'b', 'p', 'b', 'p', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'p', 'b', 'b'],
  ['b', 'p', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'p', 'b', 'b', 'p', 'b', 'p', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'b'],
  ['p', 'p', 'b', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p'],
  ['b', 'b', 'p', 'p', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'p', 'b', 'b', 'p', 'b', 'p'],
  ['p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'p', 'b', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'b'],
  ['b', 'p', 'b', 'p', 'b', 'p', 'b', 'p', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'p', 'p', 'b', 'b', 'p'],
  ['b', 'b', 'b', 'p', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'p', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'p', 'b', 'b', 'p'],
];

export class BaccaratService {
  private static get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  static initialize(): void {
    if (!localStorage.getItem(USERS_KEY)) {
      this.set(USERS_KEY, INITIAL_USERS);
    }
    if (!localStorage.getItem(FORMULAS_KEY)) {
      this.set(FORMULAS_KEY, INITIAL_FORMULAS);
    }
    if (!localStorage.getItem(FORMULA_LIST_KEY)) {
      this.set(FORMULA_LIST_KEY, INITIAL_FORMULA_LIST);
    }
    if (!localStorage.getItem(CODES_KEY)) {
      this.set(CODES_KEY, INITIAL_CODES);
    }
    if (!localStorage.getItem(STATS_KEY)) {
      this.set(STATS_KEY, []);
    }
    if (!localStorage.getItem(ROOMS_KEY)) {
      const rooms: RoomData[] = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        name: `ROOM : ${String(i + 1).padStart(3, '0')}`,
        status: ['Dealing', 'Waiting', 'Player', 'Banker'][i % 4] as any,
        percent: Math.floor(75 + Math.random() * 23),
        data: PRESET_ROOM_HISTORIES[i] || ['b', 'p', 'b', 'b', 'p'],
      }));
      this.set(ROOMS_KEY, rooms);
    }

    // Default auto login admin if no current user is saved
    if (!localStorage.getItem(CURRENT_USER_KEY)) {
      this.set(CURRENT_USER_KEY, INITIAL_USERS[0]);
    }
  }

  // --- Auth ---
  static getCurrentUser(): User | null {
    const user = this.get<User | null>(CURRENT_USER_KEY, null);
    if (!user) return null;
    // sync fresh credit/data
    const users = this.getUsers();
    const fresh = users.find((u) => u.user === user.user);
    if (fresh) {
      this.set(CURRENT_USER_KEY, fresh);
      return fresh;
    }
    return user;
  }

  static login(username: string, pass: string): { success: boolean; message: string; user?: User } {
    if (!username.trim() || !pass.trim()) {
      return { success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
    }
    const users = this.getUsers();
    const found = users.find((u) => u.user.toLowerCase() === username.trim().toLowerCase());
    if (!found) {
      return { success: false, message: 'ไม่พบชื่อผู้ใช้นี้ในระบบ' };
    }
    if (found.pass !== pass) {
      return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
    }

    // Update online status
    found.online = Date.now();
    this.updateUser(found);
    this.set(CURRENT_USER_KEY, found);

    return {
      success: true,
      message: `ยินดีต้อนรับคุณ ${found.user}`,
      user: found,
    };
  }

  static register(data: { user: string; pass: string; repass: string; email: string }): { success: boolean; message: string; user?: User } {
    if (!data.user.trim() || !data.pass || !data.email.trim()) {
      return { success: false, message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' };
    }
    if (data.pass !== data.repass) {
      return { success: false, message: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน' };
    }
    const users = this.getUsers();
    if (users.some((u) => u.user.toLowerCase() === data.user.trim().toLowerCase())) {
      return { success: false, message: 'มีชื่อผู้ใช้นี้ในระบบแล้ว กรุณาใช้ชื่ออื่น' };
    }

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      user: data.user.trim(),
      pass: data.pass,
      email: data.email.trim(),
      credit: 50.0, // Free 50 welcome credits
      rank: 'member',
      online: Date.now(),
      lobby: 0,
    };

    users.push(newUser);
    this.set(USERS_KEY, users);
    this.set(CURRENT_USER_KEY, newUser);

    return {
      success: true,
      message: `สมัครสมาชิกสำเร็จ! ได้รับเครดิตทดลองฟรี 50 เครดิต`,
      user: newUser,
    };
  }

  static logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // --- Users ---
  static getUsers(): User[] {
    return this.get<User[]>(USERS_KEY, INITIAL_USERS);
  }

  static updateUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.set(USERS_KEY, users);
      const curr = this.getCurrentUser();
      if (curr && curr.id === user.id) {
        this.set(CURRENT_USER_KEY, user);
      }
    }
  }

  // --- Rooms ---
  static getRooms(): RoomData[] {
    return this.get<RoomData[]>(ROOMS_KEY, []);
  }

  static getRoom(roomId: number): RoomData | undefined {
    return this.getRooms().find((r) => r.id === roomId);
  }

  static addCardToRoom(roomId: number, card: 'b' | 'p' | 't'): RoomData {
    const rooms = this.getRooms();
    const room = rooms.find((r) => r.id === roomId);
    if (!room) throw new Error('Room not found');

    room.data.push(card);
    room.status = card === 'b' ? 'Banker' : card === 'p' ? 'Player' : 'Tie';
    room.percent = Math.floor(70 + Math.random() * 28);
    this.set(ROOMS_KEY, rooms);

    // Evaluate formula predictions for this room
    this.evaluateStatsAfterNewCard(roomId, card, room.data.join(''));

    return room;
  }

  static clearRoomCards(roomId: number): RoomData {
    const rooms = this.getRooms();
    const room = rooms.find((r) => r.id === roomId);
    if (!room) throw new Error('Room not found');

    room.data = [];
    room.status = 'Shuffle';
    room.percent = Math.floor(75 + Math.random() * 20);
    this.set(ROOMS_KEY, rooms);
    return room;
  }

  // --- Formulas & Prediction ---
  static getFormulas(idea = 1): Formula[] {
    const list = this.get<Formula[]>(FORMULAS_KEY, INITIAL_FORMULAS);
    return list.filter((f) => f.idea === idea);
  }

  static getAllFormulas(): Formula[] {
    return this.get<Formula[]>(FORMULAS_KEY, INITIAL_FORMULAS);
  }

  static addFormula(fm: string, an: 'B' | 'P' | 'T', idea = 1): Formula {
    const formulas = this.getAllFormulas();
    const newFormula: Formula = {
      id: formulas.length > 0 ? Math.max(...formulas.map((f) => f.id)) + 1 : 1,
      fm: fm.toUpperCase(),
      an,
      idea,
    };
    formulas.push(newFormula);
    this.set(FORMULAS_KEY, formulas);
    return newFormula;
  }

  static deleteFormula(id: number): void {
    const formulas = this.getAllFormulas().filter((f) => f.id !== id);
    this.set(FORMULAS_KEY, formulas);
  }

  static getFormulaList(): FormulaList[] {
    return this.get<FormulaList[]>(FORMULA_LIST_KEY, INITIAL_FORMULA_LIST);
  }

  static addFormulaList(): FormulaList {
    const list = this.getFormulaList();
    const newItem: FormulaList = {
      id: list.length > 0 ? Math.max(...list.map((item) => item.id)) + 1 : 1,
      time: Math.floor(Date.now() / 1000),
    };
    list.push(newItem);
    this.set(FORMULA_LIST_KEY, list);
    return newItem;
  }

  /**
   * Evaluates the formula for the current room cards.
   * Matches logic from original `fml.php`:
   * - Takes the last 5 cards in uppercase
   * - Queries `fml` table for matching pattern
   * - Charges 1 credit per prediction
   * - Inserts/manages pending statistic with status "wait"
   */
  static calculateFormula(roomId: number, cardSequence: string[], idea = 1): {
    fm: 'B' | 'P' | 'T' | 'W';
    refill: boolean;
    credit: number;
    matchPattern?: string;
  } {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { fm: 'W', refill: true, credit: 0 };
    }

    if (currentUser.credit <= 0) {
      return { fm: 'W', refill: true, credit: currentUser.credit };
    }

    const cleanStr = cardSequence.join('').toUpperCase();
    if (cleanStr.length < 5) {
      return { fm: 'W', refill: false, credit: currentUser.credit };
    }

    const last5 = cleanStr.slice(-5);
    const formulas = this.getFormulas(idea);
    const matched = formulas.find((f) => f.fm === last5);

    if (matched) {
      // Check if there is an existing 'wait' stat
      const stats = this.getStats();
      const existingWait = stats.find(
        (s) => s.user === currentUser.user && s.room === roomId && s.result === 'wait'
      );

      if (!existingWait) {
        // Charge 1 credit
        currentUser.credit = Math.max(0, currentUser.credit - 1);
        this.updateUser(currentUser);

        const newStat: Statistic = {
          id: stats.length > 0 ? Math.max(...stats.map((s) => s.id)) + 1 : 1,
          user: currentUser.user,
          room: roomId,
          date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          fm: cleanStr,
          an: matched.an,
          result: 'wait',
          lap: 1,
        };
        stats.push(newStat);
        this.set(STATS_KEY, stats);
      }

      return {
        fm: matched.an,
        refill: false,
        credit: currentUser.credit,
        matchPattern: matched.fm,
      };
    } else {
      return {
        fm: 'W',
        refill: false,
        credit: currentUser.credit,
      };
    }
  }

  /**
   * When a new card is dealt in a room, checks if there were pending 'wait' predictions.
   * - If matched: WIN
   * - If not matched: LOSE, and refunds 1 credit (as in original PHP)
   */
  private static evaluateStatsAfterNewCard(roomId: number, card: 'b' | 'p' | 't', fullSeq: string): void {
    const stats = this.getStats();
    const waitStats = stats.filter((s) => s.room === roomId && s.result === 'wait');

    for (const stat of waitStats) {
      const outcome = card.toUpperCase();
      const isWin = outcome === stat.an.toUpperCase();

      if (isWin) {
        stat.result = 'win';
      } else {
        stat.result = 'lose';
        // Refund 1 credit on loss (as in original PHP fml.php: credit = credit + 1)
        const users = this.getUsers();
        const userObj = users.find((u) => u.user === stat.user);
        if (userObj) {
          userObj.credit += 1;
          this.updateUser(userObj);
        }
      }
    }

    this.set(STATS_KEY, stats);
  }

  // --- Statistics ---
  static getStats(roomId?: number, username?: string): Statistic[] {
    const all = this.get<Statistic[]>(STATS_KEY, []);
    let filtered = all;
    if (roomId !== undefined) {
      filtered = filtered.filter((s) => s.room === roomId);
    }
    if (username) {
      filtered = filtered.filter((s) => s.user === username);
    }
    return filtered;
  }

  static getRoomScoreSummary(roomId: number, username?: string): {
    win: number;
    lose: number;
    history: { lapNumber: number; sticks: number; status: 'win' | 'lose' }[];
    chartData: { top: number[]; bottom: number[] };
  } {
    const user = username || this.getCurrentUser()?.user || 'admin';
    const stats = this.getStats(roomId, user).filter((s) => s.result === 'win' || s.result === 'lose');

    let gWin = 0;
    let gLose = 0;
    let loseStreak = 0;
    let globalLap = 0;
    const history: { lapNumber: number; sticks: number; status: 'win' | 'lose' }[] = [];

    for (const item of stats) {
      if (item.result === 'win') {
        const lapCount = globalLap === 0 ? 1 : globalLap;
        history.push({ lapNumber: history.length + 1, sticks: lapCount, status: 'win' });
        gWin++;
        globalLap = 0;
        loseStreak = 0;
      } else if (item.result === 'lose') {
        if (loseStreak === 2) {
          history.push({ lapNumber: history.length + 1, sticks: 3, status: 'lose' });
          gLose++;
          loseStreak = 0;
        } else {
          loseStreak++;
          globalLap++;
        }
      }
    }

    // Chart trajectory calculation (as in chart.php)
    const top: number[] = [];
    const bottom: number[] = [];
    let ms = 0;
    let sc = 0;

    for (const h of history) {
      top.push(ms);
      bottom.push(sc);
      ms++;
      if (h.status === 'win') {
        sc++;
      } else {
        if (sc > 0) sc--;
      }
    }

    // If history is small, provide default initial points
    if (top.length === 0) {
      top.push(0, 1, 2);
      bottom.push(0, 1, 1);
    }

    return {
      win: gWin,
      lose: gLose,
      history,
      chartData: { top, bottom },
    };
  }

  // --- Redeem Codes ---
  static getCodes(): RedeemCode[] {
    return this.get<RedeemCode[]>(CODES_KEY, INITIAL_CODES);
  }

  static redeemCode(codeStr: string): { success: boolean; message: string; credit?: number } {
    const cleanCode = codeStr.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'กรุณากรอกรหัส Redeem Code' };
    }

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'กรุณาเข้าสู่ระบบก่อนเติมเครดิต' };
    }

    const codes = this.getCodes();
    const found = codes.find((c) => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return { success: false, message: 'ไม่พบโค้ดนี้ในระบบ' };
    }

    if (found.code_use === 1) {
      return { success: false, message: 'โค้ดนี้ถูกใช้งานไปแล้ว' };
    }

    // Mark as used
    found.code_use = 1;
    found.use_by = currentUser.user;
    this.set(CODES_KEY, codes);

    // Add credits to user
    currentUser.credit += found.credit;
    this.updateUser(currentUser);

    return {
      success: true,
      message: `ใช้โค้ดสำเร็จ! ได้รับ ${found.credit.toLocaleString()} เครดิต`,
      credit: currentUser.credit,
    };
  }

  static generateCodes(creditAmount: number, count: number): string[] {
    const currentUser = this.getCurrentUser();
    const creator = currentUser ? currentUser.user : 'admin';
    const codes = this.getCodes();
    const generated: string[] = [];
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const safeCount = Math.min(count, 500);

    for (let i = 0; i < safeCount; i++) {
      let code = '';
      for (let j = 0; j < 13; j++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const newRecord: RedeemCode = {
        id: codes.length > 0 ? Math.max(...codes.map((c) => c.id)) + 1 : 1,
        code,
        credit: creditAmount,
        create_by: creator,
        create_date: Math.floor(Date.now() / 1000),
        code_use: 0,
        use_by: '',
      };
      codes.push(newRecord);
      generated.push(code);
    }

    this.set(CODES_KEY, codes);
    return generated;
  }

  // --- Backend Overview Stats ---
  static getBackendStats(): {
    todayTotal: number;
    weekTotal: number;
    monthTotal: number;
    allTimeTotal: number;
    onlineUsersCount: number;
    totalWins: number;
  } {
    const users = this.getUsers();
    const stats = this.getStats();
    const codes = this.getCodes();

    const usedCodes = codes.filter((c) => c.code_use === 1);
    const allTimeCreditUsed = usedCodes.reduce((sum, c) => sum + c.credit, 0);

    const now = Date.now();
    const onlineCount = users.filter((u) => now - u.online < 300000).length; // active in last 5 mins
    const winCount = stats.filter((s) => s.result === 'win').length;

    return {
      todayTotal: Math.round(allTimeCreditUsed * 0.35),
      weekTotal: Math.round(allTimeCreditUsed * 0.7),
      monthTotal: allTimeCreditUsed,
      allTimeTotal: allTimeCreditUsed * 1.5 + 15000,
      onlineUsersCount: Math.max(1, onlineCount),
      totalWins: Math.max(winCount, 42),
    };
  }
}
