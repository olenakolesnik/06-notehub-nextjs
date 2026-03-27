// import axios from "axios";


// export type Note = {
//     id: string;
//     title: string;
//     content: string;
//     categoryId: string;
//     userId: string;
//     createdAt: string;
//     updatedAt: string;
// };

// export type NoteListResponse = {
//     notes: Note[];
//     total: number;
// };

// axios.defaults.baseURL = "https://next-v1-notes-api.goit.study";

// export const getNotes = async () => {
//     const res = await axios.get<NoteListResponse>("/notes");
//     return res.data;
// };

// export const getSingleNote = async (id: string) => {
//     const res = await axios.get<Note>(`/notes/${id}`);
//     return res.data;
// };



import axios from "axios";
import type { CreateNote, Note } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}
interface FetchNotesParams {
    page?: number;
    search?: string;
    perPage?: number;
}

export const fetchNotes = async ({
    page = 1,
    search = "",
    perPage = 12,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
    const res = await axios.get<FetchNotesResponse>(
      "/notes",
        {
            params: {
                page,
                search,
                perPage,
          },
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
 return res.data;
  };
export const createNote = async (payload: CreateNote) => {
    const { data } = await axios.post<Note>("/notes", payload,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );
    return data;
};
export const deleteNote = async (noteId: Note["id"]): Promise<Note> => {
    const { data } = await axios.delete<Note>(`/notes/${noteId}`, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    return data;
};