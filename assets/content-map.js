const contentMap = [
  {
    id: "section-1",
    title: "首页推荐",
    tags: ["爱游戏", "新游速递", "热门排行"],
    url: "https://mainportal-aiyouxi.com.cn/home",
    children: [
      { id: "sub-1", title: "今日精选", tags: ["推荐", "爱游戏"], url: "https://mainportal-aiyouxi.com.cn/featured" },
      { id: "sub-2", title: "编辑推荐", tags: ["编辑", "爱游戏"], url: "https://mainportal-aiyouxi.com.cn/editorpick" }
    ]
  },
  {
    id: "section-2",
    title: "游戏分类",
    tags: ["爱游戏", "角色扮演", "策略", "动作"],
    url: "https://mainportal-aiyouxi.com.cn/categories",
    children: [
      { id: "sub-3", title: "RPG", tags: ["角色扮演", "爱游戏"], url: "https://mainportal-aiyouxi.com.cn/rpg" },
      { id: "sub-4", title: "SLG", tags: ["策略", "爱游戏"], url: "https://mainportal-aiyouxi.com.cn/slg" }
    ]
  },
  {
    id: "section-3",
    title: "攻略中心",
    tags: ["爱游戏", "攻略", "技巧"],
    url: "https://mainportal-aiyouxi.com.cn/guides",
    children: [
      { id: "sub-5", title: "新手入门", tags: ["新手", "爱游戏"], url: "https://mainportal-aiyouxi.com.cn/newbie" },
      { id: "sub-6", title: "进阶技巧", tags: ["进阶", "爱游戏"], url: "https://mainportal-aiyouxi.com.cn/advanced" }
    ]
  }
];

const keywordTags = ["爱游戏", "攻略", "推荐", "热门", "新游", "RPG", "SLG", "动作", "新手", "进阶"];

function searchByTag(tag) {
  const results = [];
  for (const section of contentMap) {
    if (section.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))) {
      results.push({ ...section });
    }
    if (section.children) {
      for (const child of section.children) {
        if (child.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))) {
          results.push({ ...child, parentTitle: section.title });
        }
      }
    }
  }
  return results;
}

function filterByKeyword(keyword) {
  const lowerKw = keyword.toLowerCase();
  const matched = [];
  for (const section of contentMap) {
    const sectionMatch = section.title.toLowerCase().includes(lowerKw) ||
                         section.tags.some(t => t.toLowerCase().includes(lowerKw));
    if (sectionMatch) {
      matched.push({ type: "section", data: section });
    }
    if (section.children) {
      for (const child of section.children) {
        const childMatch = child.title.toLowerCase().includes(lowerKw) ||
                           child.tags.some(t => t.toLowerCase().includes(lowerKw));
        if (childMatch) {
          matched.push({ type: "child", data: child, parentTitle: section.title });
        }
      }
    }
  }
  return matched;
}

function getSectionById(id) {
  for (const section of contentMap) {
    if (section.id === id) return section;
    if (section.children) {
      const found = section.children.find(c => c.id === id);
      if (found) return found;
    }
  }
  return null;
}

function getAllTags() {
  const tagSet = new Set();
  for (const section of contentMap) {
    section.tags.forEach(t => tagSet.add(t));
    if (section.children) {
      section.children.forEach(child => child.tags.forEach(t => tagSet.add(t)));
    }
  }
  return Array.from(tagSet);
}

function getRelatedContent(tag) {
  const related = [];
  for (const section of contentMap) {
    if (section.tags.includes(tag)) related.push(section.title);
    if (section.children) {
      section.children.forEach(child => {
        if (child.tags.includes(tag)) related.push(child.title);
      });
    }
  }
  return related;
}

function generateTagCloud() {
  const tagCount = {};
  for (const tag of keywordTags) {
    tagCount[tag] = 0;
  }
  for (const section of contentMap) {
    section.tags.forEach(t => {
      if (tagCount[t] !== undefined) tagCount[t]++;
    });
    if (section.children) {
      section.children.forEach(child => {
        child.tags.forEach(t => {
          if (tagCount[t] !== undefined) tagCount[t]++;
        });
      });
    }
  }
  return Object.entries(tagCount).map(([tag, count]) => ({ tag, count }));
}