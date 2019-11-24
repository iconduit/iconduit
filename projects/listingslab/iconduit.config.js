module.exports = () => {
  return {
    name: "listingslab",
    description: "Globally Relevant JavaScript Engineering",
    urls: {
      base: "https://listingslab.com"
    },
    colors: {
      brand: "#42949f"
    },
    masks: {
      primary: "iconMaskAndroidSquircle",
      output: {
        appleTouchIconMasked: "iconMaskIosSquircle",
        webAppIconMasked: "iconMaskAndroidCircle"
      }
    },
    os: {
      ios: {
        statusBarStyle: "black-translucent"
      }
    },
    definitions: {
      output: {
        appleTouchIconMasked: {
          input: "appleTouchIcon",
          name: "apple-touch-icon-masked-[dimensions].png",
          options: {
            isMasked: true
          },
          sizes: ["appleTouchIconRetina"]
        }
      }
    },
    outputs: {
      include: ["appleTouchIconMasked"]
    },
    extra: {
      license: "MIT"
    }
  };
};
