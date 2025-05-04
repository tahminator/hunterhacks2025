import axios from 'axios'
import { HOSTNAME } from './config'
import { IsLoggedInResult } from '@base/types'

export function getIsAuthenticated(): Promise<IsLoggedInResult> {
  return axios
    .get<any>(`${HOSTNAME}/api/auth/@me`)
    .then((res) => {
      console.log(res)
      return {
        loggedIn: true,
      }
    })
    .catch((err) => {
      console.log(err)
      return {
        loggedIn: false,
      }
    })
}

export function logOut(): Promise<void> {
  return axios
    .post<any>(`${HOSTNAME}/api/auth/logout`)
    .then(() => {
      return
    })
    .catch((error) => console.error(error))
}

export function authenticateGuest(): Promise<void> {
  return axios
    .post<any>(`${HOSTNAME}/api/auth/guest`)
    .then((res) => {
      console.log(res)
      return
    })
    .catch((error) => console.error(error))
}

// export function getActiveUser(): Promise<>
