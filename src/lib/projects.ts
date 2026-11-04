import { mediaUrl } from "@/lib/media";
import type { ProjectPreviewPage } from "@/components/project-preview-stack";
import type { ShowcaseProject } from "@/components/work-showcase";

const hillPreviewPages = [
  {
    index: "01",
    label: "Home / About",
    src: mediaUrl("images/project-hill-page-1.png"),
    width: 1440,
    height: 5032,
    alt: "HILL Nairobi 医院官网首页与品牌介绍完整长页",
  },
  {
    index: "02",
    label: "Services",
    src: mediaUrl("images/project-hill-page-2.png"),
    width: 1440,
    height: 6678,
    alt: "HILL Nairobi 医院官网服务项目完整长页",
  },
  {
    index: "03",
    label: "FAQs",
    src: mediaUrl("images/project-hill-page-3.png"),
    width: 1440,
    height: 2555,
    alt: "HILL Nairobi 医院官网常见问题完整长页",
  },
] satisfies readonly ProjectPreviewPage[];

const pixelCafePreviewPages = [
  {
    index: "01",
    label: "Full website",
    src: mediaUrl("images/project-pixel-cafe-full.png"),
    width: 1440,
    height: 4711,
    alt: "加拿大 Pixel Café 拼豆店官网完整长页",
  },
  {
    index: "02",
    label: "CMS / Upload",
    src: mediaUrl("images/project-pixel-cafe-admin.png"),
    width: 2549,
    height: 1235,
    alt: "Pixel Café 拼豆图纸后台上传与内容管理界面",
  },
] satisfies readonly ProjectPreviewPage[];

const ruihePreviewPages = [
  {
    index: "01",
    label: "Home",
    src: mediaUrl("images/project-ruihe-home.png"),
    width: 1440,
    height: 7479,
    alt: "衡水瑞和制造业企业官网首页完整长页",
  },
  {
    index: "02",
    label: "About",
    src: mediaUrl("images/project-ruihe-about.png"),
    width: 1440,
    height: 4519,
    alt: "衡水瑞和制造业企业官网关于企业完整长页",
  },
  {
    index: "03",
    label: "Products",
    src: mediaUrl("images/project-ruihe-products.png"),
    width: 1440,
    height: 6888,
    alt: "衡水瑞和制造业企业官网产品中心完整长页",
  },
  {
    index: "04",
    label: "Manufacturing",
    src: mediaUrl("images/project-ruihe-quality.png"),
    width: 1440,
    height: 3699,
    alt: "衡水瑞和制造业企业官网制造与质量完整长页",
  },
  {
    index: "05",
    label: "Contact",
    src: mediaUrl("images/project-ruihe-contact.png"),
    width: 1440,
    height: 2661,
    alt: "衡水瑞和制造业企业官网项目联系完整长页",
  },
] satisfies readonly ProjectPreviewPage[];

const suxinPreviewPages = [
  {
    index: "01",
    label: "Homepage",
    src: mediaUrl("images/project-suxin-furniture.png"),
    width: 1440,
    height: 8086,
    alt: "SUXIN 家具品牌外贸站首页完整长页",
  },
] satisfies readonly ProjectPreviewPage[];

export const projects: readonly ShowcaseProject[] = [
  {
    slug: "hill-nairobi",
    index: "01",
    pages: hillPreviewPages,
    title: "HILL Nairobi",
    category: "Healthcare website · Kenya",
    status: "完整案例",
    accent: "#f2a078",
    description:
      "一家位于肯尼亚的医院官网。客户希望在体现医疗机构专业、严谨感的同时，保留面向女性客户所需要的温馨与安全感。",
    result: "专业可信 × 温馨安全",
    period: "Kenya",
  },
  {
    slug: "pixel-cafe-montreal",
    index: "02",
    pages: pixelCafePreviewPages,
    title: "Pixel Café Montréal",
    category: "Creative commerce · Canada",
    status: "完整案例",
    accent: "#f2bd3f",
    description:
      "一家位于加拿大的拼豆创意店。客户希望拥有清晰丰富的拼豆作品展示区、优秀的移动端体验，以及便于持续更新图纸与内容的后台上传功能。",
    result: "活力文艺 × 流畅有趣",
    period: "Montréal · Canada",
  },
  {
    slug: "ruihe-engineering",
    index: "03",
    pages: ruihePreviewPages,
    title: "Ruihe Engineering",
    category: "Industrial website · China",
    status: "完整案例",
    accent: "#c94719",
    description:
      "一家服务铁路、电力配件及接触网专业设备领域的制造业企业官网。项目将专业制造、可靠交付与真实工程能力转化为清晰的信息架构，完整承载产品体系、制造资质、合作网络与项目咨询。",
    result: "专业制造 × 可靠交付",
    period: "Hebei · China",
  },
  {
    slug: "suxin-furniture",
    index: "04",
    pages: suxinPreviewPages,
    title: "SUXIN Furniture",
    category: "Furniture export website · Global",
    status: "正在制作中",
    accent: "#9c6a2f",
    description:
      "一个面向海外市场的家具品牌外贸站。以深色空间影像与编辑式排版建立高端品牌气质，围绕产品系列、工艺能力、项目案例与合作咨询，构建兼顾品牌表达和海外询盘转化的完整体验。",
    result: "品牌叙事 × 海外询盘",
    period: "Global market",
  },
];

