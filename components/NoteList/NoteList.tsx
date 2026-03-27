


import { useMutation } from "@tanstack/react-query"; 
import { useQueryClient } from "@tanstack/react-query";
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { deleteNote } from "@/lib/api";
import Link from "next/link";



interface NoteListProps {
    notes: Note[];
    onSelect: (note: Note) => void;
}


function NoteList({ notes, onSelect }: NoteListProps) {
    const queryClient = useQueryClient();

    const {mutate, isPending} = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
        onError: (error) => {
            console.error(error);
        }
    })
    return (
        <ul className={css.list}>
            {/* Набір елементів списку нотаток */}
            {notes.map(note => (
                <li key={note.id} onClick={() => onSelect(note)} className={css.listItem}>
                    <Link href={`/notes/${note.id}`}>{note.title}</Link>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
          <button className={css.button} disabled={isPending} onClick={() => mutate(note.id)}>Delete</button>
        </div>
                </li>
                ))}
    </ul> 
    )
}

export default NoteList;