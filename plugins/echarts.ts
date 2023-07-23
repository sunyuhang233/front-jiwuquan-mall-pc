import * as echarts from 'echarts/core';
// @ts-ignore 引入 vue-echarts 组件
import VChart, { THEME_KEY } from "vue-echarts";
import {
  BarChart,
  LineChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,// 头部标签
  GridComponent,
  DatasetComponent,// 数据集组件
  TransformComponent // 内置数据转换器组件 (filter, sort)
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import type {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineSeriesOption
} from 'echarts/charts';
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption
} from 'echarts/components';
import type {
  ComposeOption,
} from 'echarts/core';
// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;

export default defineNuxtPlugin(async (nuxtApp) => {
  // 注册必须的组件
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LineChart,
    LabelLayout, LegendComponent,
    UniversalTransition,
    SVGRenderer
  ]);
  nuxtApp.vueApp.component(VChart)
  return {
    provide: {
      echarts
    }
  }
})
