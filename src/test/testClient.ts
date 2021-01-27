import { CookieJar } from 'tough-cookie'
import axios, { AxiosInstance } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { TagInput, PostInput } from '../types/graphql'

axiosCookieJarSupport(axios)
const cookieJar = new CookieJar()

export class TestClient {
  url: string
  axiosInstance: AxiosInstance

  constructor(url: string = process.env.HOST_URL + '/graphql') {
    this.url = url
    console.log(url)
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
            success
            error {
              path
              message
            }
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
            error {
              path
              message
            }
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
        `,
      },
      {
        withCredentials,
      },
    )
  }

  logoutAll() {
    return this.axiosInstance.post('/', {
      query: `
          mutation {
            logoutAll {
              success
              error {
                path
                message
              }
            }
          }
        `,
    })
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

  sendForgotPasswordEmail(email: string) {
    return this.axiosInstance.post('/', {
      query: `
				mutation {
					sendForgotPasswordEmail(email: "${email}") {
            success,
            error {
              path,
              message
            }
          }
				}
			`,
    })
  }

  forgotPasswordChange(linkId: string, newPassword: string) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          forgotPasswordChange(linkId: "${linkId}", newPassword: "${newPassword}") {
            success,
            error {
              path,
              message
            }
          }
        }
      `,
    })
  }

  getUserById(id: string) {
    return this.axiosInstance.post('/', {
      query: `
        {
          getUserById(id: "${id}") {
            id
            email
          }
        }
      `,
    })
  }

  getUserByEmail(email: string) {
    return this.axiosInstance.post('/', {
      query: `
        {
          getUserByEmail(email: "${email}") {
            id
            email
          }
        }
      `,
    })
  }

  updateUserEmail(email: string) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          updateUserEmail(email: "${email}") 
        }
      `,
    })
  }

  seeUserPostFromUserId(id: string) {
    return this.axiosInstance.post('/', {
      query: `
       {
         getUserById(id: "${id}") {
          email
          posts {
            id
            title
          }
         }
       }
      `,
    })
  }

  getPostById(id: string) {
    return this.axiosInstance.post('/', {
      query: `
        {
          getPostById(id: "${id}") {
            title
            author {
              email
            }
            isInMyCollection
            tags {
              name
            }
          }
        }
      `,
    })
  }

  getPostsByTitle(title: string) {
    return this.axiosInstance.post('/', {
      query: `
        {
          getPostsByTitle(title: "${title}") {
            title
            id
            author {
              email
            }
            tags {
              name
            }
          }
        }
      `,
    })
  }

  getPostsByAuthorId(authorId: string) {
    return this.axiosInstance.post('/', {
      query: `
        {
          getPostsByAuthorId(authorId: "${authorId}") {
            id
            title
            author {
              email
            }
            tags {
              name
            }
          }
        }
      `,
    })
  }

  createPost(postInput: PostInput) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          createPost(postObject: ${postInput}) {
            id
            title
            author {
              email
            }
          }
        }
      `,
    })
  }

  publishPost(id: string, tags: TagInput[] | undefined = undefined) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          publishPost(id: "${id}", tags: "${tags}")
        }
      `,
    })
  }

  removePost(id: string) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          removePost(id: "${id}")
        }
      `,
    })
  }

  saveEditPost(id: string, postInput: PostInput) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          saveEditPost(id: "${id}", postObject: "${postInput}") {
            body
            author {
              email
            }
            tags {
              name
            }
          }
        }
      `,
    })
  }

  getProfileByUserId(userId: string) {
    return this.axiosInstance.post('/', {
      query: `
        {
          getProfileByUserId(userId: "${userId}") {
            id
            collection {
              title
            }
            user {
              email
            }
          }
        }
      `,
    })
  }

  getMyProfile() {
    return this.axiosInstance.post('/', {
      query: `
        {
          getMyProfile {
            id
            user {
              email
            }
          }
        }
      `,
    })
  }

  updateMyProfileDescription(description: string) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          updateMyProfileDescription(description: "${description}") {
            id
            description
          }
        }
      `,
    })
  }

  getMyCollection() {
    return this.axiosInstance.post('/', {
      query: `
        {
          getMyCollection {
            title
          }
        }
      `,
    })
  }

  getCollectionFromUser(userId: string) {
    return this.axiosInstance.post('/', {
      query: `
        {
          getCollectionFromUser(userId: "${userId}") {
            title
          }
        }
      `,
    })
  }

  addPostToMyCollection(postId: string) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          addPostToMyCollection(postId: "${postId}") 
        }
      `,
    })
  }

  removePostFromMyCollection(postId: string) {
    return this.axiosInstance.post('/', {
      query: `
        mutation {
          removePostFromMyCollection(postId: "${postId}")
        }
      `,
    })
  }
}
