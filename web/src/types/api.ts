import { Allergy } from './Allergy'

export interface IsLoggedInResult {
  loggedIn: boolean
}

export interface ActiveUserResult {
  firstName: string
  lastName: string
  allergies: Allergy[]
}
