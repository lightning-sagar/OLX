import { atom } from 'recoil';

const cartAtom = atom({
    key: 'cart',
    default: [],
})

export default cartAtom;