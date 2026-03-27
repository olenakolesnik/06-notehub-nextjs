

"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, hydrate, DehydratedState, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./NotesPage.module.css";
import {FetchNotesResponse} from "@/lib/api"

type NotesClientProps = {
  initialPage: number;
  initialSearch: string;
  dehydratedState: DehydratedState;
};

export default function NotesClient({ initialPage, initialSearch, dehydratedState }: NotesClientProps) {
  const [queryClient] = useState(() => new QueryClient());
  hydrate(queryClient, dehydratedState);

  return (
    <QueryClientProvider client={queryClient}>
      <NotesContent initialPage={initialPage} initialSearch={initialSearch} />
    </QueryClientProvider>
  );
}

function NotesContent({ initialPage, initialSearch }: { initialPage: number; initialSearch: string }) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); 
  }, 500);

  const { data, isLoading } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, search }),
    placeholderData: keepPreviousData,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox search={search} onSearch={handleSearch} />
        {(data?.totalPages ?? 0) > 0 && (
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 0}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.button} onClick={openModal}>Create note +</button>
      </header>

      {isLoading && <strong className={css.loading}>Loading notes...</strong>}

      {(data?.notes ?? []).length > 0 && (
        <NoteList notes={data?.notes ?? []} />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
}