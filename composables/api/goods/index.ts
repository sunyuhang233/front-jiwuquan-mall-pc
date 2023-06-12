import { AxiosPromise, AxiosResponse } from "axios";
import { request } from "@/utils/request";
import { Result } from "@/types/result";

export function getGoodsListByPage(page: number, size: number, dto: GoodsPageDTO): AxiosPromise<Result<Object[]>> {
  console.log(dto);

  return request({
    method: "POST",
    url: `/goods/list/${page}/${size}`,
    data: dto
  }) as AxiosPromise<Result<Object[]>>;
}
/**商品分页参数类型 */
interface GoodsPageDTO {
  cid?: string,
  name?: string,
  isPostage?: Sort,
  priceSort?: Sort,
  viewsSort?: Sort,
  saleSort?: Sort,
  isNew?: isTrue,
}

// interface {


//   categoryId: string,
//     city : string,
//       costPrice : number,
//         createTime : "2023-05-12 21:46:08",
//           description : "goods_k75_des1.png,goods_k75_des2.png,goods_k75_des3.png",
//             district : null,
//               id: "104215909657394688",
//                 images : "goods_k75.png,goods_k75_1.png,goods_k75_2.png",
//                   isNew : 0,
//                     isShow : 1,
//                       name: "K75机械键盘",
//                         postage : 0,
//                           price : 479,
//                             province : null,
//                               refundTime : 7,
//                                 sales: 100,
//                                   updateTime: "2023-06-09 02:04:38",
//                                     video: "goods1_mps20230609_020201.mp4",
//                                       views: 210,
//                                         warrantyTime: 3
// }
