<template>
  <div class="big-screen">
    <header-component
      :headerImage="headerImage"
      :buttonImage="buttonImage"
      :selectedButtonImage="selectedButtonImage"
      :buttonCount="buttonCount"
      :initialSelectedButton="3"
      :buttonLabels="buttonLabels"
      @button-selected="handleButtonSelected"
    />
    <div class="content">
      <div id="map" class="map-container"></div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/Header/HeaderComponent'

export default {
  name: 'BigScreen2',
  components: {
    HeaderComponent
  },
  data() {
    return {
      headerImage: require('@/assets/header-image.png'),
      buttonImage: require('@/assets/button.png'),
      selectedButtonImage: require('@/assets/button-selected.png'),
      buttonCount: 4, // Number of buttons
      buttonLabels: ['道路户籍化', '隐患画像', '安全评分', '系统管理'], // Button labels
      map: null // 地图实例
    }
  },
  methods: {
    handleButtonSelected(index) {
      const routes = ['/big-screen2', '/big-screen3', '/big-screen4', '/'];
      this.$router.push(routes[index]);
    },
    async initMap() {
      if (!this.map) {
        this.map = new BMap.Map("map");
      }
      this.map.centerAndZoom(new BMap.Point(120.168, 33.355), 15);

      // 动态隐藏百度地图版权信息
      this.map.addEventListener("tilesloaded", () => {
        const unauthorizedText = document.querySelector(".anchorBL");
        if (unauthorizedText) {
          unauthorizedText.style.display = "none";
        }
      });
    }
  },
  mounted() {
  // 劫持 attachShadow
  if (typeof Element.prototype.attachShadow === "function") {
    let originShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (...args) {
      const shadowRoot = originShadow.call(this, ...args);
      let style = document.createElement("style");
      style.innerHTML = `
        div, span, p, a {
          display: none !important;
        }
      `;
      shadowRoot.appendChild(style);
      return shadowRoot;
    };
  }

  // 初始化地图
  this.initMap();

  // 使用 MutationObserver 动态隐藏
  const observer = new MutationObserver(() => {
    const unauthorizedText = document.querySelector(".anchorBL");
    if (unauthorizedText) {
      unauthorizedText.style.display = "none";
    }
  });

  // 监听整个文档的子节点变化
  observer.observe(document.body, { childList: true, subtree: true });

  // 延迟隐藏
  setTimeout(() => {
    const unauthorizedText = document.querySelector(".anchorBL");
    if (unauthorizedText) {
      unauthorizedText.style.display = "none";
    }
  }, 2000);
}
}
</script>

<style scoped>
.big-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}


</style>

<style >
.anchorBL {
  display: none !important;
}

.anchorBL div {
  display: none !important;
}
</style>
