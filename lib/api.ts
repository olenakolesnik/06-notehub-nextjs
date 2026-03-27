



import axios from "axios";
import type { CreateNote, Note } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

 export interface FetchNotesResponse {
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

export async function fetchNoteById(id: Note["id"]) {
    const { data } = await axios.get<Note>(`/notes/${id}`, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },  
    });
    return data;
}

  
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