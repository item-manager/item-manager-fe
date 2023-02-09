/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ErrorResult {
  /** @format int32 */
  code?: number
  message?: string
}

export interface CreateUserRQ {
  id: string
  password: string
  username: string
  passwordConfirm: string
}

export interface CreateUserRS {
  /** @format int64 */
  userNo?: number
}

export interface ResultCreateUserRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: CreateUserRS
}

export interface CreateRoomRQ {
  name: string
}

export interface CreateRoomRS {
  /** @format int64 */
  roomNo?: number
}

export interface ResultCreateRoomRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: CreateRoomRS
}

export interface CreatePlaceRQ {
  /** @format int64 */
  roomNo: number
  name: string
}

export interface CreatePlaceRS {
  /** @format int64 */
  placeNo?: number
}

export interface ResultCreatePlaceRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: CreatePlaceRS
}

export interface CreateLabelRQ {
  name?: string
}

export interface CreateLabelRS {
  /** @format int64 */
  labelNo: number
}

export interface ResultCreateLabelRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: CreateLabelRS
}

export interface CreateItemRQ {
  name: string
  type: 'CONSUMABLE' | 'EQUIPMENT'
  /** @format int64 */
  locationNo: number
  locationMemo?: string
  /** @format binary */
  photo?: File
  /** @format int32 */
  priority?: number
}

export interface CreateItemRS {
  /** @format int64 */
  itemNo?: number
}

export interface ResultCreateItemRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: CreateItemRS
}

export interface AttachLabelToItemRQ {
  /** @format int64 */
  itemNo?: number
  /** @format int64 */
  labelNo?: number
}

export interface ItemLabelRS {
  /** @format int64 */
  itemNo?: number
  /** @format int64 */
  labelNo?: number
}

export interface ResultItemLabelRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: ItemLabelRS
}

export interface LoginUserRQ {
  id: string
  password: string
}

export interface LoginUserRS {
  /** @format int64 */
  userNo?: number
  username?: string
}

export interface ResultLoginUserRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: LoginUserRS
}

export interface UpdateLabelRQ {
  name?: string
}

export interface ResultVoid {
  /** @format int32 */
  code?: number
  message?: string
  data?: object
}

export interface ResultSessionUser {
  /** @format int32 */
  code?: number
  message?: string
  data?: SessionUser
}

export interface SessionUser {
  /** @format int64 */
  userNo?: number
  username?: string
}

export interface ResultListRoomsRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: RoomsRS[]
}

export interface RoomsRS {
  /** @format int64 */
  roomNo?: number
  name?: string
}

export interface PlacesRQ {
  /** @format int64 */
  roomNo?: number
}

export interface PlacesRS {
  /** @format int64 */
  placeNo?: number
  name?: string
}

export interface ResultListPlacesRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: PlacesRS[]
}

export interface LabelRS {
  /** @format int64 */
  labelNo: number
  name: string
}

export interface ResultListLabelRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: LabelRS[]
}

export interface ItemRS {
  /** @format int64 */
  itemNo?: number
  name?: string
  type?: 'CONSUMABLE' | 'EQUIPMENT'
  room?: string
  place?: string
  locationMemo?: string
  /** @format int32 */
  quantity?: number
  /** @format int32 */
  priority?: number
  labels?: LabelRS[]
}

export interface ResultListItemRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: ItemRS[]
}

export interface ResultItemRS {
  /** @format int32 */
  code?: number
  message?: string
  data?: ItemRS
}

export interface DetachLabelFromItemRQ {
  /** @format int64 */
  itemNo?: number
  /** @format int64 */
  labelNo?: number
}

import axios, { AxiosInstance, AxiosRequestConfig, HeadersDefaults, ResponseType } from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || 'http://ycrpark.iptime.org:8080',
    })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method)

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem)
    } else {
      return `${formItem}`
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      const propertyContent: any[] = property instanceof Array ? property : [property]

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem))
      }

      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const responseFormat = format || this.format || undefined

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>)
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body)
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data)
  }
}

/**
 * @title OpenAPI definition
 * @version v0
 * @baseUrl http://ycrpark.iptime.org:8080
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  users = {
    /**
     * No description
     *
     * @tags user-controller
     * @name CreateUser
     * @summary 회원가입
     * @request POST:/users
     */
    createUser: (data: CreateUserRQ, params: RequestParams = {}) =>
      this.request<ResultCreateUserRS, ErrorResult>({
        path: `/users`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name DeleteUser
     * @summary 로그인한 유저 탈퇴
     * @request DELETE:/users
     */
    deleteUser: (params: RequestParams = {}) =>
      this.request<ResultVoid, ErrorResult>({
        path: `/users`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name GetUser
     * @summary 로그인한 유저 pk, id
     * @request GET:/users/session
     */
    getUser: (params: RequestParams = {}) =>
      this.request<ResultSessionUser, ErrorResult>({
        path: `/users/session`,
        method: 'GET',
        ...params,
      }),
  }
  locations = {
    /**
     * No description
     *
     * @tags location-controller
     * @name AllRooms
     * @summary 사용자의 '보관장소(방)' 목록 조회
     * @request GET:/locations/rooms
     */
    allRooms: (params: RequestParams = {}) =>
      this.request<ResultListRoomsRS, ErrorResult>({
        path: `/locations/rooms`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags location-controller
     * @name CreateRoom
     * @summary 보관장소(방) 생성
     * @request POST:/locations/rooms
     */
    createRoom: (data: CreateRoomRQ, params: RequestParams = {}) =>
      this.request<ResultCreateRoomRS, ErrorResult>({
        path: `/locations/rooms`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags location-controller
     * @name GetPlacesByRoomNo
     * @summary '보관장소(방)'의 '위치' 목록 조회
     * @request GET:/locations/places
     */
    getPlacesByRoomNo: (query: PlacesRQ, params: RequestParams = {}) =>
      this.request<ResultListPlacesRS, ErrorResult>({
        path: `/locations/places`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags location-controller
     * @name CreatePlace
     * @summary 위치 생성
     * @request POST:/locations/places
     */
    createPlace: (data: CreatePlaceRQ, params: RequestParams = {}) =>
      this.request<ResultCreatePlaceRS, ErrorResult>({
        path: `/locations/places`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  labels = {
    /**
     * No description
     *
     * @tags label-controller
     * @name GetLabels
     * @summary 라벨 목록 조회
     * @request GET:/labels
     */
    getLabels: (params: RequestParams = {}) =>
      this.request<ResultListLabelRS, ErrorResult>({
        path: `/labels`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags label-controller
     * @name CreateLabel
     * @summary 라벨 생성
     * @request POST:/labels
     */
    createLabel: (data: CreateLabelRQ, params: RequestParams = {}) =>
      this.request<ResultCreateLabelRS, ErrorResult>({
        path: `/labels`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags label-controller
     * @name DeleteLabel
     * @summary 라벨 제거
     * @request DELETE:/labels/{labelNo}
     */
    deleteLabel: (labelNo: number, params: RequestParams = {}) =>
      this.request<ResultVoid, ErrorResult>({
        path: `/labels/${labelNo}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @tags label-controller
     * @name PatchLabel
     * @summary 라벨 수정
     * @request PATCH:/labels/{labelNo}
     */
    patchLabel: (labelNo: number, data: UpdateLabelRQ, params: RequestParams = {}) =>
      this.request<ResultVoid, ErrorResult>({
        path: `/labels/${labelNo}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  items = {
    /**
     * No description
     *
     * @tags item-controller
     * @name GetItems
     * @summary 물품 목록 조회
     * @request GET:/items
     */
    getItems: (params: RequestParams = {}) =>
      this.request<ResultListItemRS, ErrorResult>({
        path: `/items`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags item-controller
     * @name CreateItem
     * @summary 물품 생성
     * @request POST:/items
     */
    createItem: (data: CreateItemRQ, params: RequestParams = {}) =>
      this.request<ResultCreateItemRS, ErrorResult>({
        path: `/items`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags item-controller
     * @name AttachLabelToItemRq
     * @summary 물품에 라벨링
     * @request POST:/items/labels
     */
    attachLabelToItemRq: (data: AttachLabelToItemRQ, params: RequestParams = {}) =>
      this.request<ResultItemLabelRS, ErrorResult>({
        path: `/items/labels`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags item-controller
     * @name DetachLabelFromItem
     * @summary 물품에서 라벨 제거
     * @request DELETE:/items/labels
     */
    detachLabelFromItem: (data: DetachLabelFromItemRQ, params: RequestParams = {}) =>
      this.request<ResultVoid, ErrorResult>({
        path: `/items/labels`,
        method: 'DELETE',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags item-controller
     * @name GetItem
     * @summary 물품 pk로 조회
     * @request GET:/items/{itemNo}
     */
    getItem: (itemNo: number, params: RequestParams = {}) =>
      this.request<ResultItemRS, ErrorResult>({
        path: `/items/${itemNo}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags item-controller
     * @name LoadPhoto
     * @summary 물품 사진 조회
     * @request GET:/items/{itemNo}/photo
     */
    loadPhoto: (itemNo: number, params: RequestParams = {}) =>
      this.request<File, ErrorResult>({
        path: `/items/${itemNo}/photo`,
        method: 'GET',
        ...params,
      }),
  }
  auth = {
    /**
     * No description
     *
     * @tags auth-controller
     * @name Login
     * @summary 로그인
     * @request POST:/auth/login
     */
    login: (data: LoginUserRQ, params: RequestParams = {}) =>
      this.request<ResultLoginUserRS, ErrorResult>({
        path: `/auth/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name Logout
     * @summary 로그아웃
     * @request GET:/auth/logout
     */
    logout: (params: RequestParams = {}) =>
      this.request<ResultVoid, ErrorResult>({
        path: `/auth/logout`,
        method: 'GET',
        ...params,
      }),
  }
}
