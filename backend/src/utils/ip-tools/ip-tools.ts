export const v6tov4 = (ipv6: string) => {
    // TODO: convert it the right way
    return ipv6.replace('::ffff:', '');
};
