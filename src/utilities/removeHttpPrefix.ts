export default (hostname: string): string => hostname?.replace(/^(http|https):\/\//gi, '');

