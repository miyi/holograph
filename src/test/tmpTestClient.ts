import { CookieJar } from 'tough-cookie'
import axios, { AxiosInstance } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
axiosCookieJarSupport(axios)
const cookieJar = new CookieJar()

export class TmpTestClient {
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

	setRedis(key: string, value: string) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          setRedis(key: "${key}", value: "${value}")
        }
      `,
    })
  }

  delRedis(key: string) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          delRedis(key: "${key}")
        }
      `,
    })
  }

  getRedis(key: string) {
    return this.axiosInstance.post('/', {
      query: `
        {
          getRedis(key: "${key}")
        }
      `,
    })
	}
	
	libraries() {
		return this.axiosInstance.post('/', {
			query: `
				{
					libraries {
						branch
						books {
							title
							author {
								name
							}
						}
					}
				}
			`,
		})
	}
}