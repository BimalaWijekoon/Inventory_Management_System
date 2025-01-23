// sorting.js

// Merge Sort implementation
export const mergeSort = (array, key) => {
    if (array.length <= 1) {
      return array;
    }
  
    const middle = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, middle), key);
    const right = mergeSort(array.slice(middle), key);
  
    return merge(left, right, key);
  };
  
  // Helper function to merge two sorted arrays
  const merge = (left, right, key) => {
    const sorted = [];
    let i = 0, j = 0;
  
    while (i < left.length && j < right.length) {
      if (left[i][key] <= right[j][key]) {
        sorted.push(left[i]);
        i++;
      } else {
        sorted.push(right[j]);
        j++;
      }
    }
  
    // Add remaining elements
    return [...sorted, ...left.slice(i), ...right.slice(j)];
  };
  