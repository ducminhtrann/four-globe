export const getSkipTake = ({ page = 1, per_page = 10 }) => {
  const take = per_page;
  const skip = (page - 1) * take;
  return { skip, take };
};
