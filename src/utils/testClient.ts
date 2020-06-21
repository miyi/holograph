import { CookieJar } from 'tough-cookie'
import axios, { AxiosInstance } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
axiosCookieJarSupport(axios)
const cookieJar = new CookieJar()

export class TestClient {
  url: string
  axiosInstance: AxiosInstance

  constructor(url: string) {
    this.url = url
    this.axiosInstance = axios.create({
      jar: cookieJar,
      withCredentials: true,
      baseURL: url,
    })
  }

  register(email: string, password: string) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          register(email: "${email}", password: "${password}") {
            path
            message
          }
        }
      `,
    })
  }

  login(email: string, password: string) {
    return this.axiosInstance.post('/', {
      query: `
				mutation {
					login(email: "${email}", password: "${password}") {
						success
					}
				}
			`,
    })
  }

  logout(withCredentials: boolean = true) {
  	return this.axiosInstance.post(
      '/', 
      {
        query: `
          mutation {
            logout {
              success
              error {
                path
                message
              }
            }
          }
        `
      },
      {
        withCredentials
      },
  	)
  }

  me() {
    return this.axiosInstance.post('/', {
      query: `
				{
					me {
						id
						email
					}
				}
			`,
    })
  }
}
