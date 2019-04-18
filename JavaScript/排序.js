var randomAry = function(a) {
  return new Array(a).fill(0).map(it => (Math.random() * a) | 0);
};

//冒泡排序优化版
function sort(ary) {
  let l = ary.length;
  var count = 0;
  for (let i = 0; i < l; i++) {
    let flag = false;
    for (let j = 0; j < l - i - 1; j++) {
      //  if (ary[j] > ary[j + 1]) {
      //    let tmp = ary[j + 1]
      //    ary[j + 1] = ary[j]
      //    ary[j] = tmp
      //  }
      count++;
      if (ary[j] > ary[j + 1]) {
        let tmp = ary[j];
        ary[j] = ary[j + 1];
        ary[j + 1] = tmp;
        flag = true;
      }
    }
    if (!flag) {
      console.log(count);

      return ary;
    }
  }
  console.log(count);

  return ary;
}

sort(a);

// 选择排序

function sort1(ary) {
  for (let i = 0; i < ary.length - 1; i++) {
    var minIndex = i;
    for (let j = i; j < ary.length; j++) {
      if (ary[j] < ary[minIndex]) {
        minIndex = j;
      }
    }
    var tmp = ary[i];
    ary[i] = ary[minIndex];
    ary[minIndex] = tmp;
  }
  return ary;
}

// 快速排序

function quicksort(ary) {
  if (ary.length <= 1) {
    return [...ary];
  }
  let print = ary[Math.floor(ary.length * Math.random())];
  let left = [];
  let middle = [];
  let right = [];

  for (let item of ary) {
    count++;
    if (item < print) {
      left.push(item);
    } else if (item > print) {
      right.push(item);
    } else {
      middle.push(item);
    }
  }

  return quicksort(left).concat(middle, quicksort(right));
}

// 哨兵排序 (快排的优化版本)
var swap = function(ary, i, j) {
  var tmp = ary[i];
  ary[i] = ary[j];
  ary[j] = tmp;
};

function partition(ary, start = 0, end = ary.length -1) {
  if (start >= end) {
    return
  }
  var pivotIndex = Math.floor((end - start + 1) * Math.random() + start)
  var pivot = ary[pivotIndex];
  swap(ary, pivotIndex, end);
  for (var i = start - 1, j = start; j <= end; j++) {
    if (ary[j] <= pivot) {
      i++;
      swap(ary, i, j);
    }
  }
  partition(ary, start, i - 1)
  partition(ary, i + 1, end)
  return ary;
}














