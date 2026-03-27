

// import { getNotes } from "@/lib/api";
// import NoteList from "@/components/NoteList/NoteList";





// const Notes = async () => {
//   const response = await getNotes();

//   return (
//     <section>
//       <h1>Notes List</h1>
//       {response?.notes?.length > 0 && <NoteList notes={response.notes} />}
//     </section>
//   );
// }
  
//   export default Notes;


// const Notes = () => {
//     return <div>Notes</div>;
// };

// export default Notes;



// import NoteList from "@/components/NoteList/NoteList";
// import css from "./NotesPage.module.css";


// import { useDebouncedCallback } from "use-debounce";
// import type { Note } from "../../types/note";
// import { useState } from "react";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import SearchBox from "@/components/SearchBox/SearchBox";
// import Modal from "@/components/Modal/Modal";
// import NoteForm from "@/components/NoteForm/NoteForm";
// import { fetchNotes } from "@/lib/api";
// import NoteList from "@/components/NoteList/NoteList";
// import Pagination from "@/components/Pagination/Pagination";


// function Notes() {
//   const [search, setSearch] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);
//   const [page, setPage] = useState(1);
//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };
// const handleSelectNote = (note: Note) => {
//     console.log("Selected:", note);
// };
//   const handleSearch = useDebouncedCallback((value: string) => {
//     setSearch(value);
//     setPage(1);
//   },
//     1000
//   );
//   const { data, isLoading } = useQuery({
//     queryKey: ["notes", page, search],
//     queryFn: () => fetchNotes({page, search}),
//       placeholderData: keepPreviousData,
//   });
// return (
//     <div className={css.app}>
//     <header className={css.toolbar}>
//       <SearchBox search={search} onSearch={handleSearch} />
//         {data && data.totalPages > 0 && (<Pagination
//           page={page}
//           totalPages={data.totalPages}
//           onPageChange={handlePageChange}
//         />)}
//       <button className={css.button} onClick={openModal}>Create note +</button>
//       </header>
//       {isLoading && <strong className={css.loading}>Loading notes...</strong>}
//       {data && data.notes.length > 0 && (<NoteList notes={data.notes} onSelect={handleSelectNote}
//        />)}
//       {isModalOpen && (
//         <Modal onClose={closeModal}>
//           <NoteForm onSuccess={closeModal} />
//           </Modal>
//       )}
//   </div>
//   );
// }

// export default Notes;

import { dehydrate, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type NotesPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const search = params.search || "";


  const queryClient = new QueryClient();

 
  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, search }),
  });

 
  const dehydratedState = dehydrate(queryClient);

  return (
    <NotesClient
      initialPage={page}
      initialSearch={search}
      dehydratedState={dehydratedState}
    />
  );
}
