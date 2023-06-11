import { AxiosPromise, AxiosResponse } from "axios";
import { request } from "../../../utils/request";
import { Result } from "../../../types/result";
import { useFetchs } from "../../../composables/useHttp"
/**
 * 获取全部活动列表
 * @returns EventVO[]
 */
export function getEventsList(): AxiosPromise<Result<EventVO[]>> {
  return useFetchs({
    method: "get",
    url: "/event/list",
  }) as AxiosPromise<Result<EventVO[]>>;
}

