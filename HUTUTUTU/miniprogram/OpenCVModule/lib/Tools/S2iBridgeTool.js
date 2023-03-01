
const wxTool = require('./S2iWXOpenCVTool')

const S2iBridgeTool = {

  async getImageDataWithPath(imgPath) {
    if ((typeof(wx) != undefined)) {
      return await wxTool.getImageDataWithPath(imgPath);
    }

    return {};
  },

  convertMatToBase64(mat) {
    if ((typeof(wx) != undefined)) {
      return wxTool.convertMatToBase64(mat);
    }

    return ""; 
  },

  convertImgPathToBase64(path) {
    if ((typeof(wx) != undefined)) {
       return wxTool.convertImgPathToBase64(path);
    }

    return ""; 
  },

}

module.exports = S2iBridgeTool;