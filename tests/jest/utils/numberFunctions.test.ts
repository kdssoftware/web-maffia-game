import * as fn from '@utils/numberFunctions';

describe("Testing zeroPad", () => {

    test("Should return a string with correct amount of padded zeros", () => {
        expect(fn.zeroPad(1, 3)).toBe("001");
        expect(fn.zeroPad(10, 3)).toBe("010");
        expect(fn.zeroPad(100, 4)).toBe("0100");
        expect(fn.zeroPad(1, 5)).toBe("00001");
    });

    test("Should return a string with correct negative number and padded zeros", ()=>{
        expect(fn.zeroPad(-1, 3)).toBe("-001");
        expect(fn.zeroPad(-10, 3)).toBe("-010");
        expect(fn.zeroPad(-100, 4)).toBe("-0100");
        expect(fn.zeroPad(-1, 5)).toBe("-00001");
    })

    test("Should return the same string is the padded zeros are lower than the lenght of the string", ()=>{
        expect(fn.zeroPad(10, 2)).toBe("10");
        expect(fn.zeroPad(112233, 4)).toBe("112233");
        expect(fn.zeroPad(12345678910, 7)).toBe("12345678910");
    })

    test("Should return the same string if the given places is 0", ()=>{
        expect(fn.zeroPad(1, 0)).toBe("1");
        expect(fn.zeroPad(112233, 0)).toBe("112233");
        expect(fn.zeroPad(12345678910, 0)).toBe("12345678910");
    })
})