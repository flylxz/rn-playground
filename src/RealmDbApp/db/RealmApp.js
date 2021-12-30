import Realm from 'realm';
import { REALM_DB_APP_IDD } from '@env';

export const app = new Realm.App({ id: 'my-very-first-realm-app-tsljm' });
// export const app = new Realm.App({id: REALM_DB_APP_IDD});
