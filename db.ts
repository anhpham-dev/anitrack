import { Anime, User, Role } from './types';
import { initialAnimeData } from './constants';

const DB_KEY = 'anime-gallery-db';
const OLD_DB_KEY = 'anime-gallery-data'; // The old key for single-user data

interface Database {
  users: User[];
  animeData: {
    [username: string]: Anime[];
  };
}

// Function to save the database to localStorage
const saveDB = (db: Database): void => {
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Creates the basic structure with an admin user and default anime data.
const createFreshDB = (): Database => {
    const adminUser: User = {
        id: 'user-1',
        username: 'admin',
        password: 'password',
        role: Role.Admin,
    };

    return {
        users: [adminUser],
        animeData: {
            [adminUser.username]: initialAnimeData,
        },
    };
};

// This function handles the initial loading, migration, or creation of the database.
const loadAndInitializeDB = (): Database => {
  try {
    const existingDB = window.localStorage.getItem(DB_KEY);
    if (existingDB) {
      return JSON.parse(existingDB);
    }
    
    // If no new DB, check for old single-user data to migrate.
    const oldDataRaw = window.localStorage.getItem(OLD_DB_KEY);
    if (oldDataRaw) {
      console.log("Old data found, migrating to new user-based database structure.");
      const oldAnimeList: Anime[] = JSON.parse(oldDataRaw);
      
      const migratedDB = createFreshDB(); // Creates admin user
      migratedDB.animeData['admin'] = oldAnimeList; // Overwrites default anime with user's old list
      
      saveDB(migratedDB);
      window.localStorage.removeItem(OLD_DB_KEY); // Clean up old data
      return migratedDB;
    }

    // If no data exists at all, create and save a fresh database.
    console.log("No existing data found. Initializing a fresh database.");
    const freshDB = createFreshDB();
    saveDB(freshDB);
    return freshDB;

  } catch (error) {
    console.error("Error initializing DB from localStorage, creating a fresh one:", error);
    // Fallback if anything goes wrong.
    const freshDB = createFreshDB();
    saveDB(freshDB);
    return freshDB;
  }
};


// We'll use a single instance of the DB loaded at startup.
// This simulates a "server" loading the DB into memory.
let dbInstance: Database = loadAndInitializeDB();

const persistDBInstance = () => {
  saveDB(dbInstance);
};

// User Management
export const authenticateUser = (username: string, password: string): User | null => {
  const user = dbInstance.users.find(u => u.username === username && u.password === password);
  return user || null;
};

export const getUsers = (): User[] => {
  return [...dbInstance.users]; // Return a copy for safety
};

export const addUser = (newUser: Omit<User, 'id'>): { success: boolean, message: string } => {
  if (dbInstance.users.some(u => u.username === newUser.username)) {
    return { success: false, message: 'Username already exists.' };
  }
  const userWithId: User = { ...newUser, id: `user-${Date.now()}` };
  dbInstance.users.push(userWithId);
  dbInstance.animeData[userWithId.username] = []; // Initialize with empty anime list
  persistDBInstance();
  return { success: true, message: 'User added successfully.' };
};

export const updateUserPassword = (userId: string, newPassword: string): { success: boolean, message: string } => {
  const userIndex = dbInstance.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return { success: false, message: 'User not found.' };
  }
  dbInstance.users[userIndex].password = newPassword;
  persistDBInstance();
  return { success: true, message: 'Password updated successfully.' };
};


// Anime Data Management
export const getUserAnime = (username: string): Anime[] => {
  return dbInstance.animeData[username] || [];
};

export const saveUserAnime = (username: string, animeList: Anime[]): void => {
  // Ensure the user exists before saving data to prevent errors
  if (dbInstance.users.some(u => u.username === username)) {
    dbInstance.animeData[username] = animeList;
    persistDBInstance();
  } else {
    console.warn(`Attempted to save anime for non-existent user: ${username}`);
  }
};
