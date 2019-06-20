class Puzzle {
  constructor(option) {
    console.log(123);
    if (!option.id || !option.imgUrl || !option.width || !option.height) {
      return new Error("option不全");
    }
    let initOption = {
      limitNum: 20
    };
    for (const key in option) {
      initOption[key] = option[key];
    }
    this.option = initOption;
    this.step = option.limitNum;
    this.init(initOption);
  }
  init(option) {
    var wrap = document.getElementById(option.id);
    var canvas = document.createElement("canvas");
    canvas.className = "puzzle";
    canvas.width = option.width;
    canvas.height = option.height;
    wrap.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var image = new Image();
    var arr = [];
    var indexArr = [];
    var initArr = [];
    var initIndex = [];
    var Row = 3; /* 行 */
    var Column = 3; /* 列 */
    var IWidth;
    var IHeight;
    var PerCol;
    var PerRow;
    var CWidth = canvas.width;
    var CHeight = canvas.height;

    image.onload = function() {
      IWidth = image.width;
      IHeight = image.height;
      for (var i = 0; i < Row; i++) {
        for (var j = 0; j < Column; j++) {
          arr.push([j, i]);
          initIndex.push(j + i * Row);
        }
      }
      initArr = JSON.parse(JSON.stringify(arr));
      PerCol = IWidth / Column;
      PerRow = IHeight / Row;
      arr.sort(function() {
        return Math.random() - 0.5;
      });
      render();
      getIndexArr();
    };
    image.src = option.imgUrl;
    canvas.addEventListener("click", e => {
      var ex = e.clientX,
        ey = e.clientY,
        rect = canvas.getBoundingClientRect(),
        tx = ex - rect.left - document.documentElement.clientLeft,
        ty = ey - rect.top - document.documentElement.clientTop;
      tx = (tx * canvas.width) / rect.width;
      ty = (ty * canvas.height) / rect.height;
      var clickIndex = getIndex(tx, ty);
      var blanckIndex = indexArr.indexOf(arr.length - 1);
      var click = initArr[clickIndex];
      var blank = initArr[blanckIndex];
      var dis = distance(click, blank);
      if (dis == 1) {
        if (this.step == 0) {
          return;
        }
        swapArr(clickIndex, blanckIndex);
        render();
        getIndexArr();
        this.step -= 1;
        option.every && option.every(this.step);
        if (indexArr.join("") == initIndex.join("")) {
          console.log("完成");
          option.success && option.success();
        } else {
          if (this.step <= 0) {
            option.fail && option.fail();
          }
        }
      }
    });
    function getIndex(x, y) {
      var Y = Math.floor(y / (CHeight / Row));
      var X = Math.floor(x / (CWidth / Column));
      var len = X + Y * Row;
      return len;
    }
    function getIndexArr() {
      var Iarr = [];
      for (var i = 0; i < arr.length; i++) {
        Iarr.push(arr[i][0] + arr[i][1] * Row);
      }
      indexArr = Iarr;
    }
    function swapArr(index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    }
    function distance(click, blank) {
      return Math.abs(click[0] - blank[0]) + Math.abs(click[1] - blank[1]);
    }
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      /* 解决部分安卓机 无法清除画板 导致重叠问题 */
      canvas.style.display = "none";
      canvas.offsetHeight;
      canvas.style.display = "inherit";
      for (var i = 0; i < arr.length; i++) {
        var element = arr[i];
        var iRow = Math.ceil((i + 1) / Row) - 1;
        var iCol = i % Row;
        ctx.drawImage(image, PerCol * element[0], PerRow * element[1], IWidth / Column, IHeight / Row, (CWidth / Column) * iCol, (CHeight / Row) * iRow, CWidth / Column, CHeight / Row);
      }
    }
  }
  recovery() {
    this.step = this.option.limitNum;
  }
}
export default Puzzle;
