const allBrand = [{ name: "a3" },{ name: "z" },{ name: "a" }, { name: "b" }];
let result = allBrand.reduce(
  (pre, cur) => {
    let returnedValue;
    let arr = [];
    switch (cur.name.slice(0, 1).toLowerCase()) {
      case "a":
      case "b":
      case "c":
        {
          arr = pre.abc;
          arr.push(cur);
          returnedValue = {
            ...pre,
            abc: arr,
          };
        }
        break;
      case "d":
      case "e":
      case "f":
        {
          arr = pre.def;
          arr.push(cur);
          returnedValue = {
            ...pre,
            def: arr,
          };
        }
        break;
      case "g":
      case "h":
      case "i":
        {
          arr = pre.ghi;
          arr.push(cur);
          returnedValue = {
            ...pre,
            ghi: arr,
          };
        }
        break;
      case "j":
      case "k":
      case "l":
        {
          arr = pre.jkl;
          arr.push(cur);
          returnedValue = {
            ...pre,
            jkl: arr,
          };
        }
        break;
      case "m":
      case "n":
      case "o":
        {
          arr = pre.mno;
          arr.push(cur);
          returnedValue = {
            ...pre,
            mno: arr,
          };
        }
        break;
      case "p":
      case "q":
      case "r":
        {
          arr = pre.pqr;
          arr.push(cur);
          returnedValue = {
            ...pre,
            pqr: arr,
          };
        }
        break;
      case "s":
      case "t":
      case "u":
      case "v":
        {
          arr = pre.stuv;
          arr.push(cur);
          returnedValue = {
            ...pre,
            stuv: arr,
          };
        }
        break;

      default:
        {
          arr = pre.wxyz;
          arr.push(cur);
          returnedValue = {
            ...pre,
            wxyz: arr,
          };
        }
        break;
    }
    return returnedValue;
  },
  { abc: [], def: [], ghi: [], jkl: [], mno: [], pqr: [], stuv: [], wxyz: [] }
);
console.log(result);
