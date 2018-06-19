<template>
    <div>
        <div :style="[transitionalStyleObj, heightStyleObj]">
            <div ref="content">
                <slot>Shrink box with no inner content defined. This is not right.</slot>
            </div>
        </div>
    </div>    
</template>

<script>
export default {
  props: ["isShrunk"],
  data: function() {
    return {
      heightStyleObj: {
        height: "0px",
        opacity: 0.1,
        overflow: "hidden",
        display: "none"
      },
      contentSpan: null,
      animMilleSec: 250
    };
  },
  computed: {
    transitionalStyleObj: function() {
      return { transition: "all " + this.animMilleSec / 1000 + "s ease" };
    }
  },
  mounted: function() {
    var self = this;
    this.$nextTick(function() {
      self.contentSpan = self.$refs.content;

      if (!self.isShrunk) {
        //  If starting state is not shrunk, then toggleDisplay to enable the display
        self.toggleDisplay();
      }
    });
  },
  watch: {
    isShrunk: function(value) {
      this.toggleDisplay();
    }
  },
  methods: {
    toggleDisplay: function() {
      if (this.isShrunk) {
        this.heightStyleObj.opacity = 0.1;
        this.heightStyleObj.height = this.contentSpan.offsetHeight + "px";
        setTimeout(this.setHeightAuto, 0);
        //  Needed this.heightStyleObj.height = '0px' in a separate function
        //  VueJS is too smart is just sets the height to '0px' immediately
        //  Which means it tries to transition from 'auto' to '0px'
        //  Which doesn't work
      } else {
        this.heightStyleObj.height = this.contentSpan.offsetHeight + "px";
        this.heightStyleObj.opacity = 1;
        setTimeout(this.setHeightAuto, this.animMilleSec);
      }
    },
    setHeightAuto: function() {
      if (this.isShrunk) {
        this.heightStyleObj.height = "0px";
        this.heightStyleObj.overflow = "hidden";
        this.heightStyleObj.display = "none";
      } else {
        this.heightStyleObj.height = "auto";
        this.heightStyleObj.overflow = "visible";
        this.heightStyleObj.display = "block";
      }
    }
  }
};
</script>