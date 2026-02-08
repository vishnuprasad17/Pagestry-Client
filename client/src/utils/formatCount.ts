const formatCount = (count = 0) => {
  if (count >= 1000) {
    const value = count / 1000;
    return value % 1 === 0
      ? `${value}K`
      : `${value.toFixed(1)}K`;
  }
  return count.toString();
};

export default formatCount;