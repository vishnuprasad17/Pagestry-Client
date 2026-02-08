const countWords = (value = "") =>
  value.trim().split(/\s+/).filter(Boolean).length;

export default countWords;