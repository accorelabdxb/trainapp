/**
 * Generates a random alphanumeric code
 * @param length - Length of the code to generate
 * @returns Random code string
 */
export const generateRedeemCode = (length: number = 8): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Formats points with proper comma separation
 * @param points - Number of points
 * @returns Formatted points string
 */
export const formatPoints = (points: number): string => {
  return points.toLocaleString();
};
