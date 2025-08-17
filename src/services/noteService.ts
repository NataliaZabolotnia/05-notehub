import axios from "axios";
import type { Note,NewNote } from "../types/note";

 interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
const myKey=import.meta.env.VITE_NOTEHUB_TOKEN;

export const fetchNotes =async(page:number,searchText:string):Promise<FetchNotesResponse>=>{
    const res=await axios.get<FetchNotesResponse>(`https://notehub-public.goit.study/api/notes`, {
params: {
    page,
    perPage: 12,
    search: searchText
  },
headers: {
Authorization: `Bearer ${myKey}`
}})
    console.log(res.data);
    return res.data;
}

export const postNote=async(newNote:NewNote):Promise<Note>=>{
    const res=await axios.post<Note>(`https://notehub-public.goit.study/api/notes`,newNote,{
headers: {
Authorization: `Bearer ${myKey}`
}})
        return res.data;
}

export const deleteNote=async(noteId:string):Promise<Note>=>{
     const res=await axios.delete<Note>(`https://notehub-public.goit.study/api/notes/${noteId}`,{
headers: {
Authorization: `Bearer ${myKey}`
}})
        return res.data;
}


export const searchNote=async()=>{
     const res=await axios.get<Note>(`https://notehub-public.goit.study/api/note?search=mysearchtext`,{
headers: {
Authorization: `Bearer ${myKey}`
}})
        return res.data;
}