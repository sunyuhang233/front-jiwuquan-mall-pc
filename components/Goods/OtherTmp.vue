<script lang="ts" setup></script>
<template>
  <div>
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <li
            text-4
            my-2
            font-700
            style="list-style: circle"
          >
            常见问题？
            <i
              i-solar:question-circle-broken
              p-2
            ></i>
          </li>
        </template>
        <div>
          1、如何下单购买商品？
          <br />
          答：在您浏览商品时，点击“加入购物车”，确认购物车中的商品，然后点击“结算并付款”，选择付款方式和收货地址即可下单购买。
        </div>
        <div>
          2、商品发货时间是多久？
          <br />
          答：通常情况下，我们将在24小时内发货。如果出现特殊情况，例如节假日等，我们将提前在网站上进行通知。
        </div>
        <div>
          3、如何查询我的订单状态？
          <br />
          答：您可以在“我的订单”中查看所有订单的状态，包括待付款、待发货、已发货等状态。
        </div>
        <div>
          4、是否支持货到付款？
          <br />
          答：目前我们暂时不支持货到付款，仅支持在线支付。
        </div>
      </el-collapse-item>
    </el-collapse>

    <li
      text-4
      my-2
      mb-4
      font-700
      style="list-style: circle"
    >
      购买须知：
    </li>
    <p
      style="text-indent: 2em; line-height: 1.4em"
      opacity-80
    >
      商品展示的划线价或指导价可能是商品制造厂商的零售市场指导价、品牌专柜价、商品吊牌价或该商品在极物圈上曾经展示过的销售价；由于地区、时间的不同和市场波动，品牌专柜标价、商品吊牌价等可能会与您购物时展示的不一致，该价格仅供您参考。
      因系统缓存更新延迟等不确定性情况，可能导致价格显示异常，商品具体售价请以订单结算页价格为准。
      若您对商品展示有疑问，欢迎咨询客服。
      为保护广大消费者的利益，极物圈抵制囤积居奇等扰乱市场的行为，我们会对商品的下单进行风险控制，并保留取消非正常购买订单之权利。
    </p>
  </div>
</template>
<style scoped lang="scss"></style>
