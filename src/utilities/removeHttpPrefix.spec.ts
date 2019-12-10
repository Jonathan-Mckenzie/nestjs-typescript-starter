import removeHttpPrefix from './removeHttpPrefix';

describe('it should work', () => {
    it('should parse out http prefixes', () => {
        expect(removeHttpPrefix('http://localhost')).toEqual('localhost');
        expect(removeHttpPrefix('localhost')).toEqual('localhost');
        expect(removeHttpPrefix('https://localhost')).toEqual('localhost');
        expect(removeHttpPrefix('')).toEqual('');
        expect(removeHttpPrefix(null)).toEqual(undefined);
        expect(removeHttpPrefix(undefined)).toEqual(undefined);
    });
});
