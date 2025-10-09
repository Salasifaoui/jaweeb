import { APP_CONFIG } from '@/src/configs';
import { Account, Avatars, Client, Databases, Functions, Locale, Storage, Teams } from 'react-native-appwrite';


export const client = new Client()
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "")
    .setEndpoint(APP_CONFIG.APPWRITE_API_URL)
    .setDevKey(process.env.EXPO_PUBLIC_APPWRITE_DEV_KEY ?? "");


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const functions = new Functions(client);
const locale = new Locale(client);
const storage = new Storage(client);
const teams = new Teams(client);


export type AppwriteContextType = {
    client: Client,
    account: Account,
    avatars: Avatars,
    databases: Databases,
    functions: Functions,
    locale: Locale,
    storage: Storage,
    teams: Teams,
}

export const appwriteClient = {
    client,
    account,
    avatars,
    databases,
    functions,
    locale,
    storage,
    teams,
}