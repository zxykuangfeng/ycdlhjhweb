<template>
    <div class="header-component">
      <div style="position:absolute;top:10px;left: 32px;display: flex;align-items: center;"><img :src="positionImage" alt="定位" class="full-image" /><div style="color:#89C0FF;font-size: 14px;margin-left: 4px;">盐城市</div></div>
      <img class="header-image" :src="headerImage" alt="Header Image" />
      <div class="button-group">
        <div class="background-overlay"></div>
        <button
          v-for="(label, index) in buttonLabels"
          :key="index"
          :class="{ selected: selectedButton === index }"
          @click="selectButton(index)"
        >
          <img :src="selectedButton === index ? selectedButtonImage : buttonImage" alt="Button Image" />
          <span :style="{ color: selectedButton === index ? '#FFFFFF' : '#89C0FF' }">{{ label }}</span>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderComponent',
    props: {
      headerImage: {
        type: String,
        required: true
      },
      buttonImage: {
        type: String,
        required: true
      },
      selectedButtonImage: {
        type: String,
        required: true
      },
      buttonCount: {
        type: Number,
        required: true
      },
      initialSelectedButton: {
        type: Number,
        default: 0
      },
      buttonLabels: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        positionImage: require('@/assets/positionImage.png'),
        selectedButton: this.initialSelectedButton
      }
    },
    methods: {
      selectButton(index) {
        this.selectedButton = index;
        this.$emit('button-selected', index);
      }
    }
  }
  </script>
  
  <style scoped>
  .header-component {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }
  
  .header-image {
    width: 100%;
    height: auto;
  }
  
  .button-group {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    position: relative; /* Ensure the background overlay is positioned relative to this container */
  }
  
  .background-overlay {
    position: absolute;
    top: 80%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%; /* Adjust the width as needed */
    height: 48px; /* Adjust the height as needed */
    background: linear-gradient( 270deg, rgba(17,37,82,0) 0%, #010B22 54%, rgba(17,37,82,0) 100%);
    z-index: 0; /* Ensure the background is behind the buttons */
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    margin: 0 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1; /* Ensure the buttons are above the background */
  }
  
  button.selected img {
    /* border: 2px solid #42b983;  */
  }
  
  button span {
    position: absolute;
    top: 10px;
    left: 55x;
    margin-top: 5px;
    font-size: 14px;
  }
  </style>
  