export function deepCopy<T>(obj: T): T {  
  if (obj === null || typeof obj !== 'object') {  
      // 对于非对象类型，直接返回  
      return obj;  
  }  

  // 创建一个新的空对象或数组  
  const copy: any = Array.isArray(obj) ? [] : {};  

  for (const key in obj) {  
      if (obj.hasOwnProperty(key)) {  
          // 递归拷贝属性值  
          copy[key] = deepCopy(obj[key]);  
      }  
  }  

  // 返回拷贝后的对象  
  return copy as T;  
}  