import { atom } from "recoil";

const updateAtom = atom({
    key:"updateAtom",
    default:JSON.parse(localStorage.getItem('update'))
}) 
export default updateAtom;