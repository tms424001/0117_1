规模分档 Spec（Product v0.9）

> 页面：`/standard/scales`  
> 目标：可维护分档类型与档位，支持校验连续/不重叠；供标签化/指标/估算使用

---

## 1 页面IA
- 左：ScaleType 列表
- 右：ScaleRange 表格（该类型下）
- 抽屉：编辑档位
- 底部：校验结果面板（连续/重叠/递增）

## 2 线框
```text
┌/standard/scales────────────────────────────────────────────┐
│ 左：AREA/BED/CLASS... │ 右：档位表(min/max/rangeText/状态/校验) │
│ [校验] [智能补齐]  行点击→抽屉编辑                           │
└────────────────────────────────────────────────────────────┘
3 必备规则（UI必须体现）

左闭右开：min<=v<max

max=-1 显示为∞

同类型档位：不重叠、连续、严格递增

功能规模优先于面积（当 TagScaleConfig 指定）

4 API（概念）

GET /scale-types

GET /scale-types/{typeCode}/ranges

POST /scale-ranges/match

5 验收

修改中间档位上限时提示“是否连带调整后续min”

校验失败不得保存（至少对系统内置类型）

---

## Implementation Notes (Windsurf)

| 项目 | 待对齐 |
|------|--------|
| **路由文件** | `src/router/standard.ts` |
| **组件路径** | `src/pages/standard/scales/ScaleList.tsx`, `src/pages/standard/scales/ScaleDrawer.tsx` |
| **DTO** | `src/types/scale.ts` (ScaleType, ScaleRange) |
| **接口函数** | `src/api/scale.ts` |

> Windsurf 实现时在此补充实际路径与命名