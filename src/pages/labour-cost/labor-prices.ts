/**
 * 工价数据（列表与详情共用）
 */
export interface LaborPriceItem {
  id: number
  category: string
  trade: string
  name: string
  price: string
  unit: string
  pricingNote: string
  serviceScope: string
  image?: string
  description?: string
  standards?: string[]
}

export const laborPrices: LaborPriceItem[] = [
  {
    id: 1,
    category: 'paint',
    trade: '油漆',
    name: '墙面乳胶漆施工',
    price: '35',
    unit: '元/㎡',
    pricingNote: '包工包料，按墙面实际面积计算',
    serviceScope: '含墙面基层处理、刮腻子两遍、打磨平整、刷乳胶漆两遍（底漆+面漆）。',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    description: '采用标准施工工艺，确保墙面平整光滑。适用于新房装修或旧房墙面翻新，包含基础的墙面处理和标准的底漆面漆涂刷。',
    standards: ['基层清理需彻底，无浮灰油污', '腻子批刮厚度均匀，无明显接茬', '打磨后表面平整度误差<3mm', '漆膜饱满，无流挂、漏刷现象']
  },
  {
    id: 101,
    category: 'paint',
    trade: '油漆',
    name: '木器漆翻新',
    price: '80',
    unit: '元/㎡',
    pricingNote: '仅人工费，按展开面积计算',
    serviceScope: '旧漆打磨、修补裂缝、刷底漆两遍、面漆两遍。不含油漆材料费。',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
    description: '针对旧家具或木饰面的翻新服务，通过专业的打磨和涂刷工艺，让旧物焕发新生。',
    standards: ['旧漆膜打磨平整，无原有痕迹', '修补色差接近原木色', '漆面光滑，手感细腻', '无刷痕、气泡']
  },
  {
    id: 2,
    category: 'demolition',
    trade: '拆除',
    name: '非承重墙体拆除',
    price: '80',
    unit: '元/㎡',
    pricingNote: '仅人工费，不含垃圾清运',
    serviceScope: '标准红砖或轻质砖墙体拆除。含施工现场简单清理，不含垃圾下楼及外运。',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    description: '专业拆除团队，使用专业工具进行非承重墙体的拆除作业，注重施工安全和噪音控制。',
    standards: ['严禁拆除承重结构', '拆除边缘整齐，不破坏周边墙体', '水电管线预先断电断水保护', '垃圾袋装化处理']
  },
  {
    id: 201,
    category: 'demolition',
    trade: '拆除',
    name: '地砖拆除',
    price: '35',
    unit: '元/㎡',
    pricingNote: '仅人工费，含地面找平层拆除',
    serviceScope: '拆除原有地砖及水泥砂浆结合层，清理至混凝土楼板层。',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    description: '彻底清除旧地砖及砂浆层，为新的地面铺装做好基础准备。',
    standards: ['拆除至原楼板层', '不破坏楼板结构及原有防水层', '垃圾及时清理堆放']
  },
  {
    id: 3,
    category: 'wood',
    trade: '木工',
    name: '轻钢龙骨石膏板吊顶',
    price: '180',
    unit: '元/㎡',
    pricingNote: '包工包料，按展开面积计算',
    serviceScope: '国标轻钢龙骨架设、E0级石膏板安装、防锈处理、接缝防裂处理。',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    description: '使用国标轻钢龙骨和环保石膏板，结构稳固，平整度高，有效防止开裂变形。',
    standards: ['吊杆间距≤1000mm', '主龙骨间距≤1000mm', '副龙骨间距≤400mm', '石膏板错缝安装，自攻螺丝防锈处理']
  },
  {
    id: 301,
    category: 'wood',
    trade: '木工',
    name: '窗帘盒制作',
    price: '60',
    unit: '元/米',
    pricingNote: '包工包料',
    serviceScope: '细木工板打底，石膏板饰面。含加固处理。',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    description: '定制化窗帘盒制作，隐藏窗帘轨道，提升整体装修美观度。',
    standards: ['基层板固定牢固', '尺寸准确，直线度偏差<2mm', '表面平整，阴阳角方正']
  },
  {
    id: 4,
    category: 'tile',
    trade: '泥工',
    name: '800*800地砖铺贴',
    price: '65',
    unit: '元/㎡',
    pricingNote: '仅人工费，常规铺贴',
    serviceScope: '含地面基层清理、水泥砂浆找平、地砖铺贴、留缝处理。不含美缝。',
    image: 'https://images.unsplash.com/photo-1623932731835-265163013d50?w=800&q=80',
    description: '标准化地砖铺贴工艺，注重平整度和缝隙均匀度，打造完美的地面效果。',
    standards: ['表面平整度误差<2mm', '接缝高低差<0.5mm', '空鼓率<5%', '纹理方向一致']
  },
  {
    id: 401,
    category: 'tile',
    trade: '泥工',
    name: '墙砖薄贴',
    price: '85',
    unit: '元/㎡',
    pricingNote: '人工费+胶泥，不含瓷砖',
    serviceScope: '使用瓷砖胶薄贴工艺，含墙面拉毛处理。适用于全瓷砖上墙。',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
    description: '采用先进的薄贴工艺，粘结力强，有效防止瓷砖空鼓脱落，节省空间。',
    standards: ['墙面需做拉毛处理', '瓷砖胶满浆率>90%', '阴阳角方正度<2mm']
  },
  {
    id: 5,
    category: 'water',
    trade: '水电',
    name: '强电布管穿线',
    price: '45',
    unit: '元/米',
    pricingNote: '包工包料，按实测线管长度计算',
    serviceScope: '含开槽、布管（伟星/中财等国标管）、穿线（熊猫/起帆等国标线）、底盒安装。',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    description: '严格遵守国家电气安全规范，使用品牌阻燃管材和国标电线，保障用电安全。',
    standards: ['横平竖直，禁止斜铺', '强弱电间距>30cm或做屏蔽处理', '管内穿线横截面<40%', '电线分色规范']
  },
  {
    id: 501,
    category: 'water',
    trade: '水电',
    name: '水管铺设（PPR）',
    price: '60',
    unit: '元/米',
    pricingNote: '包工包料，伟星/日丰管',
    serviceScope: '含开槽、管道热熔连接、打压测试、水泥封槽。质保50年。',
    image: 'https://images.unsplash.com/photo-1585314872161-001c223743f0?w=800&q=80',
    description: '采用优质PPR管材，专业热熔连接技术，杜绝漏水隐患，提供长久质保。',
    standards: ['左热右冷，上热下冷', '管卡固定间距规范', '打压测试0.8MPa保持30分钟掉压<0.05MPa']
  },
  {
    id: 6,
    category: 'designer',
    trade: '设计',
    name: '全案设计服务',
    price: '150',
    unit: '元/㎡',
    pricingNote: '按建筑面积计算',
    serviceScope: '含平面方案、效果图（客餐厅/主卧）、全套施工图、主材选购指导、施工交底。',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    description: '为您提供从概念到落地的全方位设计服务，打造理想居住空间。',
    standards: ['方案需满足客户功能需求', '施工图纸规范详尽', '效果图还原度>90%', '全程跟踪指导']
  },
  {
    id: 7,
    category: 'foreman',
    trade: '管理',
    name: '全程工程监理',
    price: '30',
    unit: '元/㎡',
    pricingNote: '按建筑面积计算',
    serviceScope: '节点验收（水电/泥木/油漆/竣工）、施工进度把控、质量监督、材料进场验收。',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    description: '第三方专业监理，为您把控施工质量和进度，让装修更省心、放心。',
    standards: ['严格按国家标准验收', '发现问题及时整改', '如实记录施工日志', '重要节点必须到场']
  }
]

export function getLaborPriceById(id: number): LaborPriceItem | undefined {
  return laborPrices.find(item => item.id === id)
}
